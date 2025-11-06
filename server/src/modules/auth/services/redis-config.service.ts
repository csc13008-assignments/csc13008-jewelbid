import {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisConfigService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisConfigService.name);
    private client: RedisClientType;

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {
        try {
            this.client = createClient({
                username: this.configService.get<string>('REDIS_USERNAME'),
                password: this.configService.get<string>('REDIS_PASSWORD'),
                socket: {
                    host: this.configService.get<string>('REDIS_HOST'),
                    port: Number(this.configService.get<string>('REDIS_PORT')),
                },
            });

            this.client.on('error', (err) => {
                this.logger.error('Redis Client Error', err);
            });

            this.client.on('connect', () => {
                this.logger.log('Redis Client Connected');
            });

            this.client.on('ready', () => {
                this.logger.log('Redis Client Ready');
            });

            this.client.on('end', () => {
                this.logger.log('Redis Client Connection Ended');
            });

            await this.client.connect();
            this.logger.log('Redis client initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize Redis client:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
            this.logger.log('Redis client disconnected');
        }
    }

    getClient(): RedisClientType {
        if (!this.client) {
            throw new Error('Redis client not initialized');
        }
        return this.client;
    }

    async isConnected(): Promise<boolean> {
        try {
            if (!this.client) {
                return false;
            }
            const result = await this.client.ping();
            return result === 'PONG';
        } catch (error) {
            this.logger.error('Redis connection check failed:', error);
            return false;
        }
    }
}
