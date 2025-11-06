import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { RedisConfigService } from './redis-config.service';

@Injectable()
export class RedisAuthService {
    private readonly logger = new Logger(RedisAuthService.name);
    private readonly OTP_PREFIX = 'otp:';
    private readonly RATE_LIMIT_PREFIX = 'otp_rate_limit:';
    private readonly OTP_TTL = 120; // 2 minutes in seconds
    private readonly RATE_LIMIT_TTL = 3600 * 24; // 1 day in seconds
    private readonly MAX_OTP_ATTEMPTS = 4; // Maximum OTP requests per phone per day

    constructor(private readonly redisConfigService: RedisConfigService) {}

    private get redis(): RedisClientType {
        return this.redisConfigService.getClient();
    }

    async storeOtp(phoneNumber: string, otp: string): Promise<void> {
        try {
            const key = this.getOtpKey(phoneNumber);
            await this.redis.setEx(key, this.OTP_TTL, otp);
            this.logger.log(`Stored OTP for phone: ${phoneNumber}`);
        } catch (error) {
            this.logger.error(
                `Failed to store OTP for phone ${phoneNumber}:`,
                error,
            );
            throw error;
        }
    }

    async getOtp(phoneNumber: string): Promise<string | null> {
        try {
            const key = this.getOtpKey(phoneNumber);
            const otp = await this.redis.get(key);

            if (otp && typeof otp === 'string') {
                this.logger.log(`Retrieved OTP for phone: ${phoneNumber}`);
                return otp;
            } else {
                this.logger.log(`No OTP found for phone: ${phoneNumber}`);
                return null;
            }
        } catch (error) {
            this.logger.error(
                `Failed to retrieve OTP for phone ${phoneNumber}:`,
                error,
            );
            return null;
        }
    }

    async validateAndDeleteOtp(
        phoneNumber: string,
        inputOtp: string,
    ): Promise<boolean> {
        try {
            const storedOtp = await this.getOtp(phoneNumber);

            if (!storedOtp) {
                this.logger.log(`No OTP found for validation: ${phoneNumber}`);
                return false;
            }
            console.log('storedOtp', storedOtp);
            console.log('inputOtp', inputOtp);
            if (storedOtp === inputOtp) {
                // OTP is valid, delete it from Redis
                await this.deleteOtp(phoneNumber);
                this.logger.log(
                    `OTP validated and deleted for phone: ${phoneNumber}`,
                );
                return true;
            } else {
                this.logger.log(
                    `Invalid OTP provided for phone: ${phoneNumber}`,
                );
                return false;
            }
        } catch (error) {
            this.logger.error(
                `Failed to validate OTP for phone ${phoneNumber}:`,
                error,
            );
            return false;
        }
    }

    async deleteOtp(phoneNumber: string): Promise<void> {
        try {
            const key = this.getOtpKey(phoneNumber);
            await this.redis.del([key]);
            this.logger.log(`Deleted OTP for phone: ${phoneNumber}`);
        } catch (error) {
            this.logger.error(
                `Failed to delete OTP for phone ${phoneNumber}:`,
                error,
            );
            throw error;
        }
    }

    async isRateLimited(phoneNumber: string): Promise<boolean> {
        try {
            const key = this.getRateLimitKey(phoneNumber);
            const attempts = await this.redis.get(key);
            const currentAttempts =
                attempts && typeof attempts === 'string'
                    ? parseInt(attempts, 10)
                    : 0;

            const isLimited = currentAttempts >= this.MAX_OTP_ATTEMPTS;

            if (isLimited) {
                this.logger.warn(
                    `Rate limit exceeded for phone: ${phoneNumber}, attempts: ${currentAttempts}`,
                );
            }

            return isLimited;
        } catch (error) {
            this.logger.error(
                `Failed to check rate limit for phone ${phoneNumber}:`,
                error,
            );
            return false; // Allow request on error to avoid blocking users
        }
    }

    async incrementRateLimit(phoneNumber: string): Promise<number> {
        try {
            const key = this.getRateLimitKey(phoneNumber);
            const attempts = await this.redis.incr(key);

            // Set TTL only on first increment
            if (attempts === 1) {
                await this.redis.expire(key, this.RATE_LIMIT_TTL);
            }

            this.logger.log(
                `Incremented OTP attempts for phone: ${phoneNumber}, count: ${attempts}`,
            );
            return attempts;
        } catch (error) {
            this.logger.error(
                `Failed to increment rate limit for phone ${phoneNumber}:`,
                error,
            );
            throw error;
        }
    }

    async getRateLimitTTL(phoneNumber: string): Promise<number> {
        try {
            const key = this.getRateLimitKey(phoneNumber);
            const ttl = await this.redis.ttl(key);
            return ttl;
        } catch (error) {
            this.logger.error(
                `Failed to get rate limit TTL for phone ${phoneNumber}:`,
                error.message,
            );
            throw new HttpException(
                {
                    message: 'Failed to get rate limit TTL',
                    error: error.message,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private getOtpKey(phoneNumber: string): string {
        return `${this.OTP_PREFIX}${phoneNumber}`;
    }

    private getRateLimitKey(phoneNumber: string): string {
        return `${this.RATE_LIMIT_PREFIX}${phoneNumber}`;
    }
}
