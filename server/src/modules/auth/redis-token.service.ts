import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisTokenService {
    private readonly logger = new Logger(RedisTokenService.name);

    constructor(@InjectRedis() private readonly redisClient: Redis) {}

    async storeAccessToken(userId: string, accessToken: string): Promise<void> {
        try {
            const key = `access_token:${userId}`;
            // Store access token with 1 hour expiration (matching JWT expiration)
            await this.redisClient.setex(key, 3600, accessToken);
            this.logger.log(`Access token stored for user: ${userId}`);
        } catch (error) {
            this.logger.error(
                `Failed to store access token for user ${userId}:`,
                error,
            );
            throw error;
        }
    }

    async isAccessTokenValid(
        userId: string,
        accessToken: string,
    ): Promise<boolean> {
        try {
            const key = `access_token:${userId}`;
            const storedToken = await this.redisClient.get(key);
            return storedToken === accessToken;
        } catch (error) {
            this.logger.error(
                `Failed to validate access token for user ${userId}:`,
                error,
            );
            return false;
        }
    }

    async removeAccessToken(userId: string): Promise<void> {
        try {
            const key = `access_token:${userId}`;
            await this.redisClient.del(key);
            this.logger.log(`Access token removed for user: ${userId}`);
        } catch (error) {
            this.logger.error(
                `Failed to remove access token for user ${userId}:`,
                error,
            );
            throw error;
        }
    }

    async storeOtp(
        email: string,
        otp: string,
        expirationMinutes: number = 15,
    ): Promise<void> {
        try {
            const key = `otp:${email}`;
            const expirationSeconds = expirationMinutes * 60;
            await this.redisClient.setex(key, expirationSeconds, otp);
            this.logger.log(
                `OTP stored for email: ${email}, expires in ${expirationMinutes} minutes`,
            );
        } catch (error) {
            this.logger.error(`Failed to store OTP for email ${email}:`, error);
            throw error;
        }
    }

    async getOtp(email: string): Promise<string | null> {
        try {
            const key = `otp:${email}`;
            const otp = await this.redisClient.get(key);
            return otp;
        } catch (error) {
            this.logger.error(`Failed to get OTP for email ${email}:`, error);
            return null;
        }
    }

    async verifyOtp(email: string, providedOtp: string): Promise<boolean> {
        try {
            const storedOtp = await this.getOtp(email);
            if (!storedOtp) {
                this.logger.warn(`No OTP found for email: ${email}`);
                return false;
            }

            const isValid = storedOtp === providedOtp;
            if (isValid) {
                // Remove OTP after successful verification
                await this.removeOtp(email);
                this.logger.log(
                    `OTP verified successfully for email: ${email}`,
                );
            } else {
                this.logger.warn(`Invalid OTP provided for email: ${email}`);
            }

            return isValid;
        } catch (error) {
            this.logger.error(
                `Failed to verify OTP for email ${email}:`,
                error,
            );
            return false;
        }
    }

    async removeOtp(email: string): Promise<void> {
        try {
            const key = `otp:${email}`;
            await this.redisClient.del(key);
            this.logger.log(`OTP removed for email: ${email}`);
        } catch (error) {
            this.logger.error(
                `Failed to remove OTP for email ${email}:`,
                error,
            );
            throw error;
        }
    }

    async getOtpTtl(email: string): Promise<number> {
        try {
            const key = `otp:${email}`;
            const ttl = await this.redisClient.ttl(key);
            return ttl;
        } catch (error) {
            this.logger.error(
                `Failed to get OTP TTL for email ${email}:`,
                error,
            );
            return -1;
        }
    }
}
