import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.model';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { UserSignUpDto } from '../auth/dtos/user-signup.dto';
import { Role } from '../auth/enums/roles.enum';
import { CreateEmployeeDto } from './dtos/create-user.dto';
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
            const salt: string = await bcrypt.genSalt(
                parseInt(this.configService.get('SALT'), 10),
            );

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

    async updateLoyaltyPoints(
        phoneNumber: string,
        points: number,
    ): Promise<void> {
        await this.userRepository.update(
            { phone: phoneNumber },
            { loyaltyPoints: points },
        );
    }

    async createEmployee(CreateDto: CreateEmployeeDto): Promise<User> {
        const {
            username,
            email,
            phone,
            address,
            birthdate,
            salary,
            workStart,
            workEnd,
        } = CreateDto;

        const password =
            this.configService.get('DEFAULT_EMPLOYEE_PASSWORD') ||
            this.generateRandomPassword();

        await this.mailerService.sendMail({
            to: email,
            subject: '[Kafi - POS System] Welcome you to Kafi',
            text: `Welcome you to onboard. As your account is created, your password is: ${password} \n After logging in our Kafi POS System, please change your password to a more secure one. \n Please do not reply this message.`,
        });
        const hashedPassword = await this.hashPassword(password);

        const user = this.userRepository.create({
            username: username,
            email: email,
            phone: phone,
            address: address,
            birthdate: birthdate,
            salary: salary,
            password: hashedPassword,
            otp: null,
            otpExpiry: null,
            role: Role.EMPLOYEE,
            workStart: workStart,
            workEnd: workEnd,
        });

        const savedUser = await this.userRepository.save(user);

        if (!savedUser) {
            throw new InternalServerErrorException(
                'Error occurs when creating employee',
            );
        }
        return savedUser;
    }

    async createCustomer(CreateDto: UserSignUpDto): Promise<User> {
        const { username, email, password, phone } = CreateDto;
        const hashedPassword = await this.hashPassword(password);

        const user = this.userRepository.create({
            username: username,
            email: email,
            phone: phone,
            address: 'null',
            birthdate: new Date('1990-01-01'),
            password: hashedPassword,
            otp: null,
            otpExpiry: null,
            loyaltyPoints: 0,
            role: Role.GUEST,
        });

        const savedUser = await this.userRepository.save(user);
        if (!savedUser) {
            throw new InternalServerErrorException(
                'Error occurs when creating customer',
            );
        }
        return savedUser;
    }

    async findAllByRole(role: Role): Promise<User[]> {
        try {
            const users = await this.userRepository.find({
                where: { role },
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

    async findOneByUsername(username: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: { username },
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
        updateProfileDto: Partial<UpdateProfileDto>,
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

    async updateEmployee(
        id: string,
        updateEmployeeDto: Partial<CreateEmployeeDto>,
    ): Promise<User> {
        try {
            const updateResult = await this.userRepository.update(
                { id },
                updateEmployeeDto,
            );

            if (updateResult.affected === 0) {
                throw new NotFoundException(`Employee with id ${id} not found`);
            }

            const updatedUser = await this.userRepository.findOne({
                where: { id },
            });
            return updatedUser;
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async deleteEmployee(id: string): Promise<{ message: string }> {
        const employee = await this.userRepository.findOne({
            where: { id },
        });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }

        await this.userRepository.softDelete(id);
        return { message: 'Employee deleted successfully' };
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
                { password: password, otp: null, otpExpiry: null },
            );
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async updateOtp(
        email: string,
        otp: string,
        otpExpiry: Date,
    ): Promise<void> {
        try {
            await this.userRepository.update(
                { email: email },
                { otp: otp, otpExpiry: otpExpiry },
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

    async findOneByOtp(email: string, otp: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: { email, otp },
            });
            return user;
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findByOtpOnly(email: string, otp: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { email, otp },
        });
        if (!user) {
            throw new InternalServerErrorException(
                `User ${email} with the OTP not found`,
            );
        }
        return user;
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
}
