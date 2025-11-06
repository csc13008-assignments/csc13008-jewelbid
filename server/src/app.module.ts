import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            // envFilePath: '.env',
        }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                autoLoadEntities: true,
                synchronize: configService.get('NODE_ENV') === 'development',
                logging: ['query', 'error', 'schema', 'warn', 'info', 'log'],
                ssl: {
                    rejectUnauthorized: false,
                },
            }),
            inject: [ConfigService],
        }),
        AuthModule,
    ],
})
export class AppModule {}
