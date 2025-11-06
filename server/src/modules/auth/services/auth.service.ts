import {
    Injectable,
    Logger,
    UnauthorizedException,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { User } from '../entities/user.entity';
import { FirebaseAuthService } from './firebase-auth.service';
import { UserRepository } from '../repositories/user.repository';
import { JwtTokenService } from './jwt-token.service';
import { RedisTokenService } from './redis-token.service';
import { CreateUserDto } from '../dto/create-user.dto';
import {
    UserRole,
    AuthType,
    AuthProvider,
} from '../../../common/enums/auth.enum';
import { SignInResponseDto } from '../dto/auth-request.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User)
        private authRepository: Repository<User>,
        private firebaseAuthService: FirebaseAuthService,
        private userRepository: UserRepository,
        private jwtTokenService: JwtTokenService,
        private redisTokenService: RedisTokenService,
    ) {}

    async signUp(idToken: string) {
        try {
            const decodedToken =
                await this.firebaseAuthService.verifyIdToken(idToken);
            const userInfo =
                this.firebaseAuthService.extractUserInfo(decodedToken);

            // Check if user already exists in our database
            const existingUser = await this.authRepository.findOne({
                where: { external_uid: userInfo.uid },
            });

            if (existingUser) {
                throw new ConflictException('User already exists');
            }

            const userId = uuidv7();

            // Create user in user-service
            const createUserDto: CreateUserDto = {
                id: userId,
                name: userInfo.name,
                picture: userInfo.picture,
            };

            try {
                await this.userRepository.createUser(createUserDto);
                this.logger.log(`User created in user-service: ${userId}`);
            } catch (userServiceError) {
                this.logger.error(`User-service creation failed: ${userId}`);
                throw new Error(
                    `Failed to create user in user-service: ${userServiceError}`,
                );
            }

            // Create user in our database
            const newUser = this.authRepository.create({
                id: userId,
                external_uid: userInfo.uid,
                email: userInfo.email,
                email_verified: userInfo.emailVerified,
                phone_number: userInfo.phoneNumber
                    ? userInfo.phoneNumber
                    : null,
                phone_verified: userInfo.phoneNumber ? true : false,
                role: UserRole.USER,
                auth_type: AuthType.OAUTH,
                provider: this.mapProvider(userInfo.provider),
                id_token: idToken,
                refresh_token: null,
                custom_claims: {
                    firebase_uid: userInfo.uid,
                    picture: userInfo.picture,
                    auth_time: decodedToken.auth_time,
                    iss: decodedToken.iss,
                },
                last_login_at: new Date(),
            });

            const savedUser = await this.authRepository.save(newUser);
            this.logger.log(`User created in auth database: ${savedUser.id}`);

            return {
                success: true,
                message: 'User created successfully',
                data: {
                    id: savedUser.id,
                    uid: savedUser.external_uid,
                    email: savedUser.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    emailVerified: savedUser.email_verified,
                    role: savedUser.role,
                    provider: savedUser.provider,
                    createdAt: savedUser.created_at,
                },
            };
        } catch (error) {
            this.logger.error('Sign-up failed:', error);
            throw error;
        }
    }

    async signIn(idToken: string): Promise<SignInResponseDto> {
        try {
            const decodedToken =
                await this.firebaseAuthService.verifyIdToken(idToken);
            const userInfo =
                this.firebaseAuthService.extractUserInfo(decodedToken);

            const provider = this.mapProvider(userInfo.provider);
            const user = await this.authRepository.findOne({
                where: {
                    external_uid: userInfo.uid,
                    provider: provider,
                },
            });

            if (!user) {
                this.logger.error(
                    `User not found: ${userInfo.uid}, provider: ${provider}`,
                );
                throw new NotFoundException(
                    'User not found. Please sign up first.',
                );
            }

            const { accessToken, refreshToken } =
                await this.jwtTokenService.generateTokenPair(user);

            user.id_token = idToken;
            user.refresh_token = refreshToken;
            user.last_login_at = new Date();
            await this.authRepository.save(user);

            await this.redisTokenService.storeAccessToken(user.id, accessToken);

            this.logger.log(
                `User signed in successfully: ${user.id}, provider: ${provider}`,
            );

            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            this.logger.error('Sign-in failed:', error);

            if (
                error instanceof NotFoundException ||
                error instanceof UnauthorizedException
            ) {
                throw error;
            }

            throw new UnauthorizedException('Sign-in failed');
        }
    }

    async signInWithOtp(phone: string): Promise<SignInResponseDto> {
        try {
            let user = await this.authRepository.findOne({
                where: { phone_number: phone },
            });

            if (!user) {
                const userId = uuidv7();
                user = this.authRepository.create({
                    id: userId,
                    external_uid: null,
                    email: null,
                    email_verified: false,
                    phone_number: phone,
                    phone_verified: true,
                    role: UserRole.USER,
                    auth_type: AuthType.OAUTH,
                    provider: AuthProvider.ZALO,
                    id_token: null,
                    refresh_token: null,
                    custom_claims: null,
                });

                // Create user in user-service
                const createUserDto: CreateUserDto = {
                    id: userId,
                    name: 'Zalo User-' + phone,
                    picture: null,
                };

                const newUser =
                    await this.userRepository.createUser(createUserDto);
                if (!newUser) {
                    this.logger.error(
                        `User creation failed in user-service: ${userId}`,
                    );
                    throw new Error(
                        `Failed to create user in user-service: ${userId}`,
                    );
                }
                this.logger.log(`User created in user-service: ${userId}`);
            }

            const { accessToken, refreshToken } =
                await this.jwtTokenService.generateTokenPair(user);

            user.refresh_token = refreshToken;
            user.last_login_at = new Date();
            await this.authRepository.save(user);
            this.logger.log(`New user created with phone: ${phone}`);

            await this.redisTokenService.storeAccessToken(user.id, accessToken);

            this.logger.log(`User signed in with phone: ${phone}`);

            return { accessToken, refreshToken };
        } catch (error) {
            this.logger.error('Sign-in with OTP failed:', error);
            throw error;
        }
    }

    async signOut(firebaseUid: string): Promise<void> {
        try {
            const user = await this.authRepository.findOne({
                where: { external_uid: firebaseUid },
            });

            if (!user) {
                throw new NotFoundException(
                    `User not found with Firebase UID: ${firebaseUid}`,
                );
            }

            await this.redisTokenService.removeAccessToken(user.id);
            this.logger.log(
                `Removed access token from Redis for user: ${user.id}`,
            );

            if (user.id_token && user.auth_type === AuthType.OAUTH) {
                try {
                    await this.firebaseAuthService.revokeRefreshTokens(
                        firebaseUid,
                    );
                    this.logger.log(
                        `Revoked Firebase refresh tokens for UID: ${firebaseUid}`,
                    );
                } catch (error) {
                    this.logger.error(
                        `Failed to revoke Firebase refresh tokens for UID ${firebaseUid}:`,
                        error,
                    );
                }
            }

            await this.authRepository.update(user.id, {
                id_token: null,
                refresh_token: null,
            });
            this.logger.log(
                `Cleared tokens from database for user: ${user.id}`,
            );

            this.logger.log(`User signed out successfully: ${user.id}`);
        } catch (error) {
            this.logger.error('Sign-out failed:', error);
            throw error;
        }
    }

    async validateToken(token: string, tokenType: 'access' | 'refresh') {
        try {
            let payload;
            if (tokenType === 'access') {
                payload = await this.jwtTokenService.verifyAccessToken(token);

                const isValid = await this.redisTokenService.isAccessTokenValid(
                    payload.sub,
                    token,
                );
                if (!isValid) {
                    return {
                        success: false,
                        message:
                            'Access token has been revoked or not found in whitelist',
                        data: null,
                    };
                }
            } else {
                payload = await this.jwtTokenService.verifyRefreshToken(token);

                const user = await this.authRepository.findOne({
                    where: { external_uid: payload.firebaseUid },
                });

                if (!user) {
                    return {
                        success: false,
                        message: 'User not found',
                        data: null,
                    };
                }

                if (user.refresh_token !== token) {
                    return {
                        success: false,
                        message:
                            'Provided refresh token does not match with the one in the database',
                        data: null,
                    };
                }
            }

            const user = await this.authRepository.findOne({
                where: { external_uid: payload.firebaseUid },
            });

            return {
                success: true,
                message: `${tokenType} token is valid`,
                data: {
                    userId: payload.sub,
                    firebaseUid: payload.firebaseUid,
                    email: payload.email,
                    tokenType: payload.type,
                    userExists: !!user,
                    role: user?.role,
                    provider: user?.provider,
                    issuedAt: new Date(payload.iat * 1000).toISOString(),
                    expiresAt: new Date(payload.exp * 1000).toISOString(),
                },
            };
        } catch (error) {
            this.logger.error(`${tokenType} token validation failed:`, error);
            return {
                success: false,
                message: `Invalid ${tokenType} token: ${error.message}`,
                data: null,
            };
        }
    }

    async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
        try {
            const payload =
                await this.jwtTokenService.verifyRefreshToken(refreshToken);

            let user = await this.authRepository.findOne({
                where: { external_uid: payload.firebaseUid },
            });

            if (!user) {
                user = await this.authRepository.findOne({
                    where: { id: payload.sub },
                });
            }

            if (user && user.refresh_token === refreshToken) {
                return user;
            }

            return null;
        } catch (error) {
            this.logger.error('Failed to get user by refresh token:', error);
            return null;
        }
    }

    async generateTokenPair(user: User): Promise<SignInResponseDto> {
        try {
            const tokens = await this.jwtTokenService.generateTokenPair(user);

            user.refresh_token = tokens.refreshToken;
            user.last_login_at = new Date();
            await this.authRepository.save(user);

            await this.redisTokenService.storeAccessToken(
                user.id,
                tokens.accessToken,
            );

            this.logger.log(`Generated token pair for user: ${user.id}`);

            return tokens;
        } catch (error) {
            this.logger.error(
                `Failed to generate token pair for user: ${user.id}`,
                error,
            );
            throw error;
        }
    }

    private mapProvider(firebaseProvider: string): AuthProvider {
        switch (firebaseProvider) {
            case 'google.com':
                return AuthProvider.GOOGLE;
            case 'facebook.com':
                return AuthProvider.FACEBOOK;
            default:
                return AuthProvider.LOCAL;
        }
    }
}
