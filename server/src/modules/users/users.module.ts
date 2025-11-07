import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { AccessControlService } from '../ac/ac.service';
import { UsersRepository } from './users.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, AccessControlService],
    exports: [UsersService, UsersRepository],
})
export class UsersModule {}
