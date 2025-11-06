import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Logger,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
    TokenValidationRequest,
    TokenValidationResponse,
    ValidatedTokenPayload,
} from '../interfaces/token-validation.interface';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    private readonly logger = new Logger(FirebaseAuthGuard.name);

    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            // Extract token from Authorization header
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                this.logger.error('Switch to OTP authentication');
                return true;
            }

            // Validate token using Firebase API
            const { success, uid, userInfo } =
                await this.validateTokenWithFirebase(token);

            if (!success) {
                this.logger.error(
                    `Invalid or expired token: ${token.substring(0, 50)}...`,
                );
                throw new HttpException(
                    {
                        message: 'Token is invalid or expired',
                        error: 'Unauthorized',
                        statusCode: HttpStatus.UNAUTHORIZED,
                    },
                    HttpStatus.UNAUTHORIZED,
                );
            }

            // Store validated information in request for use in controllers
            request.firebaseUid = uid;
            request.validatedToken = token;
            request.userInfo = userInfo;

            this.logger.log(`Token validated successfully for UID: ${uid}`);
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error('Error validating token with Firebase:', error);
            throw new HttpException(
                {
                    message: 'Token validation failed',
                    error: 'Internal Server Error',
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private extractTokenFromHeader(request: any): string | null {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            this.logger.error('Authorization header is missing');
            return null;
        }

        // Remove "Bearer " prefix if present
        let token = authHeader;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        if (!token || token.trim() === '') {
            this.logger.error(
                'Token is empty after extracting from Authorization header',
            );
            return null;
        }

        return token;
    }

    private async validateTokenWithFirebase(idToken: string): Promise<{
        success: boolean;
        uid?: string;
        userInfo?: ValidatedTokenPayload;
    }> {
        try {
            // Prepare request body
            const requestBody: TokenValidationRequest = {
                idToken,
            };

            // Build URL with API key
            const firebaseApiKey =
                this.configService.get<string>('FIREBASE_API_KEY');
            const tokenValidationUrl = this.configService.get<string>(
                'FIREBASE_TOKEN_VALIDATION_URL',
            );

            if (!firebaseApiKey) {
                throw new Error('FIREBASE_API_KEY is not configured');
            }

            const url = `${tokenValidationUrl}?key=${firebaseApiKey}`;

            // Make HTTP request to Firebase
            const response = await firstValueFrom(
                this.httpService.post<TokenValidationResponse>(
                    url,
                    requestBody,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000, // 10 second timeout
                    },
                ),
            );

            // Check if we have user data
            if (!response.data.users || response.data.users.length === 0) {
                return { success: false };
            }

            // Extract user information
            const user = response.data.users[0];
            const userInfo: ValidatedTokenPayload = {
                firebaseUid: user.localId,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                photoUrl: user.photoUrl,
            };

            return {
                success: true,
                uid: user.localId,
                userInfo,
            };
        } catch (error) {
            if (error.response) {
                // Check status code - 400 means invalid token
                if (error.response.status === 400) {
                    this.logger.error(
                        `Token validation returned 400 - token is invalid: ${error.response.status}`,
                    );
                    return { success: false };
                }

                // If status is not 200, it's an error
                if (error.response.status !== 200) {
                    throw new Error(
                        `Firebase API returned status ${error.response.status}`,
                    );
                }
            }

            this.logger.error('Failed to validate token with Firebase:', error);
            throw error;
        }
    }
}
