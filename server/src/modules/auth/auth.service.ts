import { Injectable } from '@nestjs/common';
import { TokensDto } from './dtos/tokens.dto';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserLoginDto } from './dtos/user-signin.dto';
import {
    UnauthorizedException,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import { User } from '../users/entities/user.model';
import { UserSignUpDto } from './dtos/user-signup.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { Role } from './enums/roles.enum';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) {}

    public async validateUser(
        username: string,
        password: string,
    ): Promise<User> {
        const user = await this.usersRepository.findOneByEmail(username);
        if (!user) {
            return null;
        }

        if (!user.isEmailVerified) {
            throw new UnauthorizedException(
                'Please verify your email before signing in',
            );
        }

        const isValidPassword: boolean =
            await this.usersRepository.validatePassword(password, user);

        if (!isValidPassword) {
            return null;
        }

        return user;
    }

    public async signIn(user: UserLoginDto): Promise<TokensDto> {
        try {
            const payloadAccessToken = {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                role: user.role,
            };

            const accessToken = await this.jwtService.signAsync(
                payloadAccessToken,
                {
                    expiresIn: '1h',
                    secret: this.configService.get('AT_SECRET'),
                },
            );

            const payloadRefreshToken = {
                id: user.id,
                email: user.email,
                role: user.role,
            };

            const refreshToken = await this.jwtService.signAsync(
                payloadRefreshToken,
                {
                    expiresIn: '7d',
                    secret: this.configService.get('RT_SECRET'),
                },
            );

            await this.usersRepository.updateRefreshToken(
                user.id,
                refreshToken,
            );
            await this.usersRepository.updateOtp(user.id, null, null);

            return { accessToken, refreshToken };
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    public async signUp(
        user: UserSignUpDto,
    ): Promise<{ message: string; email: string }> {
        const foundUser = await this.usersRepository.findOneByEmail(user.email);
        if (foundUser) {
            throw new BadRequestException('User already exists');
        }

        if (user.recaptchaToken) {
            const isValidRecaptcha = await this.verifyRecaptcha(
                user.recaptchaToken,
            );
            if (!isValidRecaptcha) {
                throw new BadRequestException('Invalid reCAPTCHA');
            }
        }

        try {
            const newUser = await this.usersRepository.createCustomer(user);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

            await this.usersRepository.updateOtp(newUser.email, otp, otpExpiry);

            await this.mailerService.sendMail({
                to: newUser.email,
                subject: '[Auction Platform] Email Verification',
                text: `Welcome to our auction platform! Please verify your email with this OTP: ${otp}. This OTP will expire in 15 minutes.`,
            });

            return {
                message:
                    'Registration successful. Please check your email for verification code.',
                email: newUser.email,
            };
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    public async signOut(user: UserLoginDto): Promise<void> {
        try {
            await this.usersRepository.updateRefreshToken(user.id, 'null');
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    public async getNewTokens(refreshToken: string): Promise<TokensDto> {
        try {
            const decodedRT = this.jwtService.decode(refreshToken);
            const id: string = decodedRT['id'];
            const RTRecord =
                await this.usersRepository.findOneByRefreshToken(id);
            if (!RTRecord) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            if (RTRecord !== refreshToken) {
                throw new UnauthorizedException(
                    'Your refresh token has been expired. Please log in again',
                );
            }

            const payload = this.jwtService.verify<{
                id: string;
                email: string;
                role: Role;
            }>(refreshToken, {
                secret: this.configService.get('RT_SECRET'),
            });

            const user = await this.usersRepository.findOneByEmail(
                payload.email,
            );

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const payloadAccessToken = {
                id: payload.id,
                fullname: user.fullname,
                role: payload.role,
            };

            const newAT = await this.jwtService.signAsync(payloadAccessToken, {
                expiresIn: '1h',
                secret: this.configService.get('AT_SECRET'),
            });

            return { accessToken: newAT, refreshToken: refreshToken };
        } catch (error: any) {
            await this.usersRepository.deleteByRefreshToken(refreshToken);
            throw new UnauthorizedException(
                (error as Error).message ||
                    'Refresh token expired. Please log in again',
            );
        }
    }

    public async forgotPassword(email: string): Promise<void> {
        try {
            const user = await this.usersRepository.findOneByEmail(email);
            if (!user) throw new NotFoundException('User not found');

            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

            await this.usersRepository.updateOtp(email, otp, otpExpiry);

            await this.mailerService.sendMail({
                to: email,
                subject: '[Kafi - POS System] Reset Password OTP',
                text: `Please do not reply this message. \n Your OTP is: ${otp}`,
            });

            return;
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async changePassword(
        id: string,
        oldPassword: string,
        newPassword: string,
        confirmPassword: string,
    ): Promise<void> {
        const user = await this.usersRepository.findOneById(id);
        if (!user) throw new NotFoundException('User not found');
        const isValidPassword = await this.usersRepository.validatePassword(
            oldPassword,
            user,
        );

        if (!isValidPassword) {
            throw new BadRequestException('Invalid old password');
        }

        if (newPassword !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        try {
            const hashedPassword =
                await this.usersRepository.hashPassword(newPassword);
            await this.usersRepository.updatePassword(
                user.email,
                hashedPassword,
            );
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async resetPassword(
        email: string,
        otp: string,
        newPassword: string,
        confirmPassword: string,
    ): Promise<void> {
        try {
            const user = await this.usersRepository.findByOtpOnly(email, otp);

            if (!user) throw new BadRequestException('Invalid OTP');

            if (newPassword !== confirmPassword) {
                throw new BadRequestException('Passwords do not match');
            }

            const currentTime = new Date();
            if (currentTime > user.otpExpiry) {
                throw new BadRequestException('OTP expired');
            }

            const hashedPassword =
                await this.usersRepository.hashPassword(newPassword);
            await this.usersRepository.updatePassword(email, hashedPassword);
            return;
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async verifyEmail(
        verifyEmailDto: VerifyEmailDto,
    ): Promise<{ message: string }> {
        try {
            const { email, otp } = verifyEmailDto;
            const user = await this.usersRepository.findOneByOtp(email, otp);

            if (!user) {
                throw new BadRequestException('Invalid OTP or email');
            }

            const currentTime = new Date();
            if (currentTime > user.otpExpiry) {
                throw new BadRequestException('OTP expired');
            }

            if (user.isEmailVerified) {
                throw new BadRequestException('Email already verified');
            }

            await this.usersRepository.verifyEmail(email);

            return { message: 'Email verified successfully' };
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async resendVerificationOtp(email: string): Promise<{ message: string }> {
        try {
            const user = await this.usersRepository.findOneByEmail(email);
            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (user.isEmailVerified) {
                throw new BadRequestException('Email already verified');
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

            await this.usersRepository.updateOtp(email, otp, otpExpiry);

            await this.mailerService.sendMail({
                to: email,
                subject: '[Jewelbid] Email Verification - Resend',
                text: `Your new verification OTP is: ${otp}. This OTP will expire in 15 minutes.`,
            });

            return { message: 'Verification OTP resent successfully' };
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    private async verifyRecaptcha(token: string): Promise<boolean> {
        try {
            const secretKey = this.configService.get('RECAPTCHA_SECRET_KEY');
            if (!secretKey) {
                return true;
            }
            const response = await axios.post(
                'https://www.google.com/recaptcha/api/siteverify',
                null,
                {
                    params: {
                        secret: secretKey,
                        response: token,
                    },
                },
            );

            return response.data.success;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
