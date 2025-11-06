import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import axios from 'axios';
import { RedisClientType } from 'redis';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { RedisConfigService } from './redis-config.service';
import * as http from 'http';
import * as https from 'https';

export interface ZaloToken {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expire_at: number;
}

@Injectable()
export class ZaloAuthService {
    private readonly logger = new Logger(ZaloAuthService.name);
    private readonly tokenFile = path.join(process.cwd(), 'zalo-token.json');
    private readonly appId: string;
    private readonly appSecret: string;

    private readonly httpAgent = new http.Agent({ family: 4 });
    private readonly httpsAgent = new https.Agent({ family: 4 });

    constructor(
        private readonly configService: ConfigService,
        private readonly redisConfigService: RedisConfigService,
    ) {
        this.appId = this.configService.get<string>('ZALO_APP_ID');
        this.appSecret = this.configService.get<string>('ZALO_APP_SECRET');
    }

    private get redis(): RedisClientType {
        return this.redisConfigService.getClient();
    }

    private async getValidToken(): Promise<ZaloToken> {
        try {
            const data: ZaloToken = JSON.parse(
                fs.readFileSync(this.tokenFile, 'utf-8'),
            );

            //expire_at is in milliseconds
            /* if (data.expire_at && data.expire_at > Date.now()) {
                return data;
            } */

            return this.refreshToken(data.refresh_token);
        } catch {
            this.logger.warn('Token not found or invalid.');
            throw new UnauthorizedException('No valid token available');
        }
    }

    async sendOtp(phone: string): Promise<string> {
        const data = await this.getValidToken();

        const valid_phone = phone.replace(/^0/, '84');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        try {
            const res = await axios.post(
                'https://business.openapi.zalo.me/message/template',
                {
                    phone: valid_phone,
                    template_id: '487517',
                    template_data: {
                        otp: otp,
                    },
                    tracking_id: 'tracking_id',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        access_token: data.access_token,
                    },
                    httpAgent: this.httpAgent,
                    httpsAgent: this.httpsAgent,
                },
            );

            this.logger.log('Res: ', res.data);
            if (res.data.error < 0) {
                this.logger.error(
                    `Error sending OTP ${res.data.error}`,
                    res.data,
                );
                throw new Error(res.data.message);
            }
            this.logger.log(`OTP sent successfully to ${phone}`);
            return otp;
        } catch (error) {
            this.logger.error('Error sending OTP', error);
            throw new Error('Failed to send OTP');
        }
    }

    async validateOtp(phone: string, otp: string) {
        const storedOtp = await this.redis.get(`otp:${phone}`);

        if (storedOtp && typeof storedOtp === 'string' && storedOtp === otp) {
            await this.redis.del([`otp:${phone}`]);
            return true;
        }
        return false;
    }

    async refreshToken(refreshToken: string): Promise<ZaloToken> {
        try {
            this.logger.log('Refreshing Zalo token');
            this.logger.log('App ID: ', this.appId);
            this.logger.log('Refresh Token: ', refreshToken);
            this.logger.log('App Secret: ', this.appSecret);

            const res = await axios.post(
                'https://oauth.zaloapp.com/v4/oa/access_token',
                {
                    app_id: this.appId,
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token',
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        secret_key: this.appSecret,
                    },
                    httpAgent: this.httpAgent,
                    httpsAgent: this.httpsAgent,
                },
            );

            const tokenData = res.data as {
                access_token: string;
                refresh_token: string;
                expires_in: number;
            };
            const expire_at = Date.now() + tokenData.expires_in * 1000;
            const finalData: ZaloToken = { ...tokenData, expire_at };
            this.saveTokenToFile(finalData);
            this.logger.log('Zalo OA token refreshed and saved to file');
            return finalData;
        } catch (err) {
            this.logger.error('Failed to refresh Zalo token', err);
            throw new UnauthorizedException('Failed to refresh Zalo token');
        }
    }
    private saveTokenToFile(token: ZaloToken) {
        fs.writeFileSync(this.tokenFile, JSON.stringify(token, null, 2));
    }
}
