import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ChatModule } from './modules/chat/chat.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                autoLoadEntities: true,
                synchronize: configService.get('NODE_ENV') === 'development',
                ssl: {
                    rejectUnauthorized: false,
                },
                logging: ['query', 'error', 'schema', 'warn', 'info', 'log'],
            }),
            inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'single',
                url: `redis://${configService.get('REDIS_USERNAME')}:${configService.get('REDIS_PASSWORD')}@${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
            }),
            inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('MAIL_HOST'),
                    port: configService.get('MAIL_PORT'),
                    secure: false,
                    auth: {
                        user: configService.get('MAIL_USER'),
                        pass: configService.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: configService.get('MAIL_FROM'),
                },
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
        ProductsModule,
        CategoriesModule,
        OrdersModule,
        ChatModule,
    ],
})
export class AppModule {}
