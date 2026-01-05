import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { ImageKitService } from '../upload/imagekit.service';
import { Product } from '../products/entities/product.model';
import { Order } from '../orders/entities/order.model';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly usersRatingRepository: UsersRatingRepository,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        private readonly imageKitService: ImageKitService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {}

    async updateProfile(
        id: string,
        updateProfileDto: Partial<UpdateProfileDto>,
        file?: Express.Multer.File,
    ): Promise<User> {
        // Create a copy to avoid mutating the original DTO
        const updateData: Partial<User> = {};

        // Map DTO fields to entity fields
        if (updateProfileDto.fullname)
            updateData.fullname = updateProfileDto.fullname;
        if (updateProfileDto.email) updateData.email = updateProfileDto.email;
        if (updateProfileDto.phone) updateData.phone = updateProfileDto.phone;
        if (updateProfileDto.address)
            updateData.address = updateProfileDto.address;
        if (updateProfileDto.birthdate)
            updateData.birthdate = new Date(updateProfileDto.birthdate);

        // Handle file upload
        if (file) {
            const imageUrl = await this.imageKitService.uploadImage(
                file,
                'accounts',
            );
            updateData.profileImage = imageUrl;
        }

        return this.usersRepository.updateProfile(id, updateData);
    }

    async getProfiles(role?: Role): Promise<
        {
            email: string;
            fullname: string;
            id: string;
            role: string;
            phone: string;
            address: string;
            profileImage: string;
            positiveRatings: number;
            negativeRatings: number;
            created_at: Date;
        }[]
    > {
        try {
            const users = await this.usersRepository.findAllByRole(role);

            return users.map((user) => ({
                email: user.email,
                fullname: user.fullname,
                id: user.id,
                role: user.role,
                phone: user.phone,
                address: user.address,
                profileImage: user.profileImage,
                positiveRatings: user.positiveRatings || 0,
                negativeRatings: user.negativeRatings || 0,
                created_at: user.created_at,
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
        // birthdate: string;
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

    async getPublicProfile(userId: string): Promise<{
        id: string;
        fullname: string;
        profileImage: string | null;
        positiveRatings: number;
        negativeRatings: number;
    }> {
        const user = await this.usersRepository.findOneById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            fullname: user.fullname,
            profileImage: user.profileImage || null,
            positiveRatings: user.positiveRatings || 0,
            negativeRatings: user.negativeRatings || 0,
        };
    }

    async getRatingByUserAndProduct(
        fromUserId: string,
        productId: string,
    ): Promise<Rating | null> {
        return await this.usersRatingRepository.getRatingByUserAndProduct(
            fromUserId,
            productId,
        );
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
            upgradeRequestedAt: new Date(),
        });

        return { message: 'Upgrade request submitted successfully' };
    }

    async getUpgradeRequests(): Promise<any[]> {
        const users = await this.usersRepository.findAllByRole(Role.BIDDER);
        const pendingUsers = users.filter((user) => user.upgradeRequested);

        // Map to expected frontend format
        return pendingUsers.map((user) => ({
            id: user.id,
            userId: user.id,
            user: {
                fullname: user.fullname,
                email: user.email,
                profileImage: user.profileImage,
            },
            status: 'Pending',
            createdAt:
                user.upgradeRequestedAt?.toISOString() || user.created_at,
            updatedAt: user.updated_at,
        }));
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

    async updateUserRole(
        userId: string,
        newRole: Role,
    ): Promise<{ message: string }> {
        const user = await this.usersRepository.findOneById(userId);
        if (!user) throw new NotFoundException('User not found');
        if (user.role === newRole)
            throw new BadRequestException(`User already has ${newRole} role`);
        await this.usersRepository.updateProfile(userId, { role: newRole });
        return { message: `User role updated to ${newRole} successfully` };
    }

    async deleteUser(userId: string): Promise<{ message: string }> {
        const user = await this.usersRepository.findOneById(userId);
        if (!user) throw new NotFoundException('User not found');
        if (user.role === Role.ADMIN)
            throw new BadRequestException('Cannot delete admin user');

        // Check if user has any products (as seller or current bidder)
        const productAsSellerCount = await this.productRepository.count({
            where: { sellerId: userId },
        });

        if (productAsSellerCount > 0) {
            throw new BadRequestException(
                `Cannot delete user. This user owns ${productAsSellerCount} product(s). Please delete or transfer their products first.`,
            );
        }

        const productAsBidderCount = await this.productRepository.count({
            where: { currentBidderId: userId },
        });

        if (productAsBidderCount > 0) {
            throw new BadRequestException(
                `Cannot delete user. This user is the current highest bidder on ${productAsBidderCount} product(s). Please wait until these auctions end or their bids are outbid.`,
            );
        }

        // Check if user has any orders (as seller or buyer)
        const orderCount = await this.orderRepository.count({
            where: [{ sellerId: userId }, { buyerId: userId }],
        });

        if (orderCount > 0) {
            throw new BadRequestException(
                `Cannot delete user. This user has ${orderCount} order(s) associated. Please complete or cancel related orders first.`,
            );
        }

        await this.usersRepository.deleteUser(userId);
        return { message: 'User deleted successfully' };
    }
}
