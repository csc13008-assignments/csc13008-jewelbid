import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { JwtTokenService } from './services/jwt-token.service';
import { RedisTokenService } from './services/redis-token.service';
import { RedisAuthService } from './services/redis-auth.service';
import { RedisConfigService } from './services/redis-config.service';
import { UserRepository } from './repositories/user.repository';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ZaloAuthService } from './services/zalo-auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        FirebaseAuthService,
        JwtTokenService,
        RedisTokenService,
        RedisAuthService,
        RedisConfigService,
        UserRepository,
        FirebaseAuthGuard,
        JwtAuthGuard,
        ZaloAuthService,
    ],
    exports: [
        AuthService,
        FirebaseAuthService,
        JwtTokenService,
        RedisTokenService,
        RedisAuthService,
        RedisConfigService,
        UserRepository,
        FirebaseAuthGuard,
        JwtAuthGuard,
        ZaloAuthService,
    ],
})
export class AuthModule {}
