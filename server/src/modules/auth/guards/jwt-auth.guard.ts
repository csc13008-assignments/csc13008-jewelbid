import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
    SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisTokenService } from '../services/redis-token.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

export interface JWTClaims {
    sub: string; // subject (user ID)
    firebaseUid: string;
    email: string;
    type: 'access' | 'refresh';
    iat: number; // issued at
    exp: number; // expires at
}

// Decorator to specify token type for endpoints
export const TokenType = (type: 'access' | 'refresh') =>
    SetMetadata('tokenType', type);

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private reflector: Reflector,
        private redisTokenService: RedisTokenService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const expectedTokenType =
            this.reflector.get<'access' | 'refresh'>(
                'tokenType',
                context.getHandler(),
            ) || 'access';

        try {
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new UnauthorizedException({
                    error: 'Authorization header is required',
                    message:
                        'Please provide Authorization header with Bearer token',
                });
            }

            const claims = await this.validateToken(token, expectedTokenType);

            request.userId = claims.sub;
            request.firebaseUid = claims.firebaseUid;
            request.email = claims.email;
            request.tokenType = claims.type;
            request.validatedToken = token;

            this.logger.log(
                `${expectedTokenType} token validated successfully for user: ${claims.sub}`,
            );
            return true;
        } catch (error) {
            this.logger.error(
                `Invalid or expired ${expectedTokenType} token:`,
                error,
            );
            throw new UnauthorizedException({
                error: 'Invalid token',
                message: `${expectedTokenType} token is invalid or expired`,
            });
        }
    }

    private extractTokenFromHeader(request: any): string | null {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            this.logger.error('Authorization header is missing');
            return null;
        }

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

    private async validateToken(
        token: string,
        expectedTokenType: 'access' | 'refresh',
    ): Promise<JWTClaims> {
        try {
            // Get the appropriate secret based on token type
            const secret =
                expectedTokenType === 'refresh'
                    ? this.configService.get<string>('JWT_REFRESH_SECRET')
                    : this.configService.get<string>('JWT_SECRET');

            if (!secret) {
                throw new Error(
                    `JWT_${expectedTokenType.toUpperCase()}_SECRET is not configured`,
                );
            }

            const payload = await this.jwtService.verifyAsync(token, {
                secret,
            });

            if (payload.type !== expectedTokenType) {
                throw new Error(`Token is not a ${expectedTokenType} token`);
            }

            const claims: JWTClaims = {
                sub: payload.sub,
                firebaseUid: payload.firebaseUid,
                email: payload.email,
                type: payload.type,
                iat: payload.iat,
                exp: payload.exp,
            };

            // Perform additional validation based on token type
            await this.performTokenSpecificValidation(
                token,
                claims,
                expectedTokenType,
            );

            return claims;
        } catch (error) {
            this.logger.error(
                `${expectedTokenType} token validation failed:`,
                error,
            );
            throw new UnauthorizedException(
                `Invalid or expired ${expectedTokenType} token: ${error.message}`,
            );
        }
    }

    private async performTokenSpecificValidation(
        token: string,
        claims: JWTClaims,
        tokenType: 'access' | 'refresh',
    ): Promise<void> {
        if (tokenType === 'access') {
            const isValid = await this.redisTokenService.isAccessTokenValid(
                claims.sub,
                token,
            );
            if (!isValid) {
                throw new Error(
                    'Token has been revoked or not found in whitelist',
                );
            }
        } else if (tokenType === 'refresh') {
            const user = await this.userRepository.findOne({
                where: { external_uid: claims.firebaseUid },
            });

            if (!user) {
                throw new Error('User not found');
            }

            if (user.refresh_token !== token) {
                throw new Error(
                    'Provided refresh token does not match with the one in the database',
                );
            }
        }
    }
}
