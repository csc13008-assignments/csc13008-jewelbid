import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersRatingRepository } from './users-rating.repository';
import { User } from './entities/user.model';
import { Rating } from './entities/rating.model';
import { Role } from '../auth/enums/roles.enum';
import { UpdateProfileDto } from './dtos/update-user.dto';
import { FeedbackDto } from './dtos/feedback.dto';
import { CreateRatingDto, UpdateRatingDto } from './dtos/rating.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly usersRatingRepository: UsersRatingRepository,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    async updateProfile(
        id: string,
        updateProfileDto: Partial<UpdateProfileDto>,
    ): Promise<User> {
        return this.usersRepository.updateProfile(id, updateProfileDto);
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

    async createRating(
        createRatingDto: CreateRatingDto,
        fromUserId: string,
    ): Promise<Rating> {
        return await this.usersRatingRepository.createRating(
            createRatingDto,
            fromUserId,
        );
    }

    async updateRating(
        ratingId: string,
        fromUserId: string,
        updateRatingDto: UpdateRatingDto,
    ): Promise<Rating> {
        return await this.usersRatingRepository.updateRating(
            ratingId,
            fromUserId,
            updateRatingDto.ratingType,
            updateRatingDto.comment,
        );
    }

    async deleteRating(
        ratingId: string,
        fromUserId: string,
    ): Promise<{ message: string }> {
        await this.usersRatingRepository.deleteRating(ratingId, fromUserId);
        return { message: 'Rating deleted successfully' };
    }

    async getRatingsForUser(userId: string): Promise<Rating[]> {
        return await this.usersRatingRepository.getRatingsForUser(userId);
    }

    async getRatingsByUser(userId: string): Promise<Rating[]> {
        return await this.usersRatingRepository.getRatingsByUser(userId);
    }

    async getUserRatingStats(
        userId: string,
    ): Promise<{ positive: number; negative: number; percentage: number }> {
        return await this.usersRatingRepository.getUserRatingStats(userId);
    }

    async requestUpgrade(userId: string): Promise<{ message: string }> {
        const user = await this.usersRepository.findOneById(userId);

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (user.role !== Role.BIDDER) {
            throw new BadRequestException('Only bidders can request upgrade');
        }

        if (user.upgradeRequested) {
            throw new BadRequestException('Upgrade request already submitted');
        }

        await this.usersRepository.updateProfile(userId, {
            upgradeRequested: true,
            upgradeRequestedAt: new Date().toISOString(),
        });

        return { message: 'Upgrade request submitted successfully' };
    }

    async getUpgradeRequests(): Promise<User[]> {
        const users = await this.usersRepository.findAllByRole(Role.BIDDER);
        return users.filter((user) => user.upgradeRequested);
    }

    async approveUpgradeRequest(userId: string): Promise<{ message: string }> {
        const user = await this.usersRepository.findOneById(userId);

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (!user.upgradeRequested) {
            throw new BadRequestException(
                'No upgrade request found for this user',
            );
        }

        await this.usersRepository.updateProfile(userId, {
            role: Role.SELLER,
            upgradeRequested: false,
            upgradeRequestedAt: null,
        });

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Upgrade Request Approved - Jewelbid',
            text: `Dear ${user.fullname},\n\nYour request to upgrade to Seller has been approved! You can now start listing products for auction.\n\nBest regards,\nThe Jewelbid Team`,
        });

        return { message: 'Upgrade request approved successfully' };
    }

    async rejectUpgradeRequest(userId: string): Promise<{ message: string }> {
        const user = await this.usersRepository.findOneById(userId);

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (!user.upgradeRequested) {
            throw new BadRequestException(
                'No upgrade request found for this user',
            );
        }

        await this.usersRepository.updateProfile(userId, {
            upgradeRequested: false,
            upgradeRequestedAt: null,
        });

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Upgrade Request Status - Jewelbid',
            text: `Dear ${user.fullname},\n\nThank you for your interest in becoming a Seller. Unfortunately, your upgrade request has not been approved at this time. You may reapply after 7 days.\n\nBest regards,\nThe Jewelbid Team`,
        });

        return { message: 'Upgrade request rejected' };
    }
}
