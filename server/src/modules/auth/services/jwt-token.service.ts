import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

export interface AccessTokenPayload {
    sub: string;
    firebaseUid: string;
    email: string;
    role: string;
    provider: string;
    type: 'access';
}

export interface RefreshTokenPayload {
    sub: string;
    firebaseUid: string;
    email: string;
    type: 'refresh';
}

@Injectable()
export class JwtTokenService {
    private readonly logger = new Logger(JwtTokenService.name);

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async generateAccessToken(user: User): Promise<string> {
        const payload: AccessTokenPayload = {
            sub: user.id,
            firebaseUid: user.external_uid,
            email: user.email,
            role: user.role,
            provider: user.provider,
            type: 'access',
        };

        const secret = this.configService.get<string>('JWT_SECRET');
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

        return this.jwtService.signAsync(payload, {
            secret,
            expiresIn,
        });
    }

    async generateRefreshToken(user: User): Promise<string> {
        const payload: RefreshTokenPayload = {
            sub: user.id,
            firebaseUid: user.external_uid,
            email: user.email,
            type: 'refresh',
        };

        const refreshSecret =
            this.configService.get<string>('JWT_REFRESH_SECRET');
        const refreshExpiresIn = this.configService.get<string>(
            'JWT_REFRESH_EXPIRES_IN',
        );

        return this.jwtService.signAsync(payload, {
            secret: refreshSecret,
            expiresIn: refreshExpiresIn,
        });
    }

    async generateTokenPair(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.generateAccessToken(user),
                this.generateRefreshToken(user),
            ]);

            this.logger.log(`Generated token pair for user: ${user.id}`);

            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            this.logger.error('Failed to generate token pair:', error);
            throw error;
        }
    }

    async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
        const secret = this.configService.get<string>('JWT_SECRET');
        return this.jwtService.verifyAsync(token, { secret });
    }

    async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
        const refreshSecret =
            this.configService.get<string>('JWT_REFRESH_SECRET');
        return this.jwtService.verifyAsync(token, { secret: refreshSecret });
    }
}
