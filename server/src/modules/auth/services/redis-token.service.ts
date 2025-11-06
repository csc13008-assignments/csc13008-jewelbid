import { Injectable, Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { RedisConfigService } from './redis-config.service';

@Injectable()
export class RedisTokenService {
    private readonly logger = new Logger(RedisTokenService.name);
    private readonly ACCESS_TOKEN_PREFIX = 'access_token:';
    private readonly ACCESS_TOKEN_TTL = 3600; // 1 hour in seconds

    constructor(private readonly redisConfigService: RedisConfigService) {}

    private get redis(): RedisClientType {
        return this.redisConfigService.getClient();
    }

    async storeAccessToken(userId: string, accessToken: string): Promise<void> {
        try {
            const key = this.getAccessTokenKey(userId);
            await this.redis.setEx(key, this.ACCESS_TOKEN_TTL, accessToken);
            this.logger.log(`Stored access token for user: ${userId}`);
        } catch (error) {
            this.logger.error(
                `Failed to store access token for user ${userId}:`,
                error,
            );
            throw error;
        }
    }

    async getAccessToken(userId: string): Promise<string | null> {
        try {
            const key = this.getAccessTokenKey(userId);
            const token = await this.redis.get(key);

            if (token && typeof token === 'string') {
                this.logger.log(`Retrieved access token for user: ${userId}`);
                return token;
            } else {
                this.logger.log(`No access token found for user: ${userId}`);
                return null;
            }
        } catch (error) {
            this.logger.error(
                `Failed to retrieve access token for user ${userId}:`,
                error,
            );
            return null;
        }
    }

    async removeAccessToken(userId: string): Promise<void> {
        try {
            const key = this.getAccessTokenKey(userId);
            await this.redis.del([key]);
            this.logger.log(`Removed access token for user: ${userId}`);
        } catch (error) {
            this.logger.error(
                `Failed to remove access token for user ${userId}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Check if access token exists and is valid in Redis
     */
    async isAccessTokenValid(
        userId: string,
        accessToken: string,
    ): Promise<boolean> {
        try {
            const storedToken = await this.getAccessToken(userId);
            const isValid = storedToken === accessToken;

            this.logger.log(
                `Access token validation for user ${userId}: ${isValid}`,
            );
            return isValid;
        } catch (error) {
            this.logger.error(
                `Failed to validate access token for user ${userId}:`,
                error,
            );
            return false;
        }
    }

    /**
     * Update access token TTL (refresh the expiration)
     */
    async refreshAccessTokenTTL(userId: string): Promise<void> {
        try {
            const token = await this.getAccessToken(userId);
            if (token) {
                await this.storeAccessToken(userId, token);
                this.logger.log(
                    `Refreshed access token TTL for user: ${userId}`,
                );
            }
        } catch (error) {
            this.logger.error(
                `Failed to refresh access token TTL for user ${userId}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Get remaining TTL for access token
     */
    async getAccessTokenTTL(userId: string): Promise<number> {
        try {
            const key = this.getAccessTokenKey(userId);
            const ttl = await this.redis.ttl(key);
            this.logger.log(
                `Access token TTL for user ${userId}: ${ttl} seconds`,
            );
            return ttl;
        } catch (error) {
            this.logger.error(
                `Failed to get access token TTL for user ${userId}:`,
                error,
            );
            return -1;
        }
    }

    private getAccessTokenKey(userId: string): string {
        return `${this.ACCESS_TOKEN_PREFIX}${userId}`;
    }
}
