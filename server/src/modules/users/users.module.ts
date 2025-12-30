import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.model';
import { Rating } from './entities/rating.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersRatingRepository } from './users-rating.repository';
import { ConfigModule } from '@nestjs/config';

import { UploadModule } from '../upload/upload.module';
import { AccessControlModule } from '../ac/ac.module';
import { Product } from '../products/entities/product.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Rating, Product]),
        ConfigModule,
        UploadModule,
        AccessControlModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, UsersRatingRepository],
    exports: [UsersService, UsersRepository],
})
export class UsersModule {}
