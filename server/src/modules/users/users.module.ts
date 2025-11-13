import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.model';
import { Rating } from './entities/rating.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { AccessControlService } from '../ac/ac.service';
import { UsersRepository } from './users.repository';
import { UsersRatingRepository } from './users-rating.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([User, Rating]), ConfigModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        UsersRepository,
        UsersRatingRepository,
        AccessControlService,
    ],
    exports: [UsersService, UsersRepository, UsersRatingRepository],
})
export class UsersModule {}
