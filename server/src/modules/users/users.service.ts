import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.model';
import { Role } from '../auth/enums/roles.enum';
import { UpdateEmployeeDto, UpdateProfileDto } from './dtos/update-user.dto';
import { FeedbackDto } from './dtos/feedback.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    async updateProfile(
        id: string,
        updateProfileDto: Partial<UpdateProfileDto>,
    ): Promise<User> {
        return this.usersRepository.updateProfile(id, updateProfileDto);
    }

    async updateEmployee(
        id: string,
        updateEmployeeDto: Partial<UpdateEmployeeDto>,
    ): Promise<User> {
        return this.usersRepository.updateEmployee(id, updateEmployeeDto);
    }

    async deleteEmployee(id: string): Promise<{ message: string }> {
        return this.usersRepository.deleteEmployee(id);
    }

    async getProfiles(role?: Role): Promise<
        {
            email: string;
            username: string;
            id: string;
            role: string;
            phone: string;
            address: string;
            birthdate: string;
            image: string;
        }[]
    > {
        try {
            const users = await this.usersRepository.findAllByRole(role);

            return users.map((user) => ({
                email: user.email,
                username: user.fullname,
                id: user.id,
                role: user.role,
                phone: user.phone,
                address: user.address,
                birthdate: user.birthdate.toISOString(),
                image: user.profileImage,
            }));
        } catch (error: any) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async getMyProfile(profileUser: User): Promise<{
        email: string;
        username: string;
        id: string;
        role: string;
        phone: string;
        address: string;
        image: string;
        birthdate: string;
    }> {
        try {
            const { id } = profileUser;
            const user = await this.usersRepository.findOneById(id);

            if (!user) {
                throw new BadRequestException('User not found');
            }

            const newUser = {
                email: user.email,
                username: user.fullname,
                id: user.id,
                role: user.role,
                phone: user.phone,
                address: user.address,
                image: user.profileImage,
                birthdate: user.birthdate.toISOString(),
            };
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error getting profile',
                error.message,
            );
        }
    }

    async sendFeedback(feedbackDto: FeedbackDto): Promise<{ message: string }> {
        try {
            const { name, email, message, phone } = feedbackDto;

            const adminEmail = this.configService.get('MAIL_FROM');
            await this.mailerService.sendMail({
                to: adminEmail,
                subject: `[Jewelbid] Customer Feedback From ${name}`,
                text: `
New feedback received from customer:

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}

This is an automated message from the Jewelbid.
                `,
            });

            // Send confirmation to the customer
            await this.mailerService.sendMail({
                to: email,
                subject: 'Thank you for your feedback - Jewelbid',
                text: `
Dear ${name},

Thank you for taking the time to provide us with your feedback. We greatly appreciate your input as it helps us improve our services.

Your feedback has been received and will be reviewed by our team. If necessary, we will contact you for further information.

Best regards,
The Jewelbid Team
                `,
            });

            return { message: 'Feedback sent successfully' };
        } catch (error) {
            console.log(error.message);
            throw new InternalServerErrorException(
                'Error sending feedback',
                error.message,
            );
        }
    }
}
