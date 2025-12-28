import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.model';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { UserSignUpDto } from '../auth/dtos/user-signup.dto';
import { Role } from '../auth/enums/roles.enum';
import { UpdateProfileDto } from './dtos/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
        @InjectRedis() private readonly redisClient: Redis,
    ) {}

    async validatePassword(password: string, user: User): Promise<boolean> {
        try {
            return await bcrypt.compare(password, user.password);
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async hashPassword(password: string): Promise<string> {
        try {
            const configSalt = this.configService.get('SALT');
            if (!configSalt) {
                throw new InternalServerErrorException('Salt not found');
            }
            const saltRounds = parseInt(configSalt);
            const salt: string = await bcrypt.genSalt(saltRounds);
            const hashedPassword: string = await bcrypt.hash(password, salt);

            return hashedPassword;
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findOneByPhoneNumber(phoneNumber: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { phone: phoneNumber },
        });
        return user;
    }

    async createUser(CreateDto: UserSignUpDto): Promise<User> {
        const { fullname, email, password, phone, address, birthdate } =
            CreateDto;
        const hashedPassword = await this.hashPassword(password);

        const user = this.userRepository.create({
            fullname: fullname,
            email: email,
            phone: phone,
            address: address,
            birthdate: new Date(birthdate),
            password: hashedPassword,
            isEmailVerified: false,
            role: Role.BIDDER,
        });

        const savedUser = await this.userRepository.save(user);
        if (!savedUser) {
            throw new InternalServerErrorException(
                'Error occurs when creating customer',
            );
        }
        return savedUser;
    }

    async findAllByRole(role?: Role): Promise<User[]> {
        try {
            const whereClause = role ? { role } : {};
            const users = await this.userRepository.find({
                where: whereClause,
            });
            return users;
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
            });

            return user;
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findOneByFullname(fullname: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: { fullname },
            });

            return user;
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findOneById(id: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
            });
            return user;
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async updateProfile(
        id: string,
        updateProfileDto: Partial<UpdateProfileDto> | Partial<User>,
    ): Promise<User> {
        try {
            const updateResult = await this.userRepository.update(
                { id },
                updateProfileDto,
            );

            if (updateResult.affected === 0) {
                throw new NotFoundException(
                    `The session user with id ${id} not found`,
                );
            }

            const updatedUser = await this.userRepository.findOne({
                where: { id },
            });
            return updatedUser;
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
        if (refreshToken !== 'null') {
            await this.redisClient.set(
                `refreshToken:${id}`,
                refreshToken,
                'EX',
                7 * 24 * 60 * 60,
            ); // 7 days expiration
        } else {
            await this.redisClient.del(`refreshToken:${id}`);
        }
    }

    async updatePassword(email: string, password: string): Promise<void> {
        try {
            await this.userRepository.update(
                { email: email },
                { password: password },
            );
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findOneByRefreshToken(userId: string): Promise<string> {
        const token = await this.redisClient.get(`refreshToken:${userId}`);
        if (!token) {
            throw new NotFoundException('Refresh token not found');
        }
        return token;
    }

    async deleteByRefreshToken(refreshToken: string): Promise<void> {
        await this.redisClient.del(`refreshToken:${refreshToken}`);
    }

    async updateProfileImage(id: string, imageUrl: string): Promise<void> {
        try {
            await this.userRepository.update(
                { id },
                { profileImage: imageUrl },
            );
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    private generateRandomPassword(): string {
        // Generate a random 6-digit number
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async countByRole(role: Role): Promise<number> {
        const count = await this.userRepository.count({
            where: { role },
        });
        return count;
    }

    async verifyEmail(email: string): Promise<void> {
        try {
            await this.userRepository.update(
                { email },
                { isEmailVerified: true },
            );
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async deleteUser(id: string): Promise<void> {
        try {
            const deleteResult = await this.userRepository.delete({ id });
            if (deleteResult.affected === 0) {
                throw new NotFoundException(`User with id ${id} not found`);
            }
            // Also clean up refresh token
            await this.redisClient.del(`refreshToken:${id}`);
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}
