import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating, RatingType } from './entities/rating.model';
import { User } from './entities/user.model';
import { CreateRatingDto } from './dtos/rating.dto';

@Injectable()
export class UsersRatingRepository {
    constructor(
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createRating(
        createRatingDto: CreateRatingDto,
        fromUserId: string,
    ): Promise<Rating> {
        try {
            const existingRating = await this.ratingRepository.findOne({
                where: {
                    fromUserId,
                    toUserId: createRatingDto.toUserId,
                    productId: createRatingDto.productId,
                },
            });

            if (existingRating) {
                throw new BadRequestException(
                    'You have already rated this user for this product',
                );
            }

            const rating = this.ratingRepository.create({
                ...createRatingDto,
                fromUserId,
            });

            const savedRating = await this.ratingRepository.save(rating);

            await this.updateUserRatingCounts(
                createRatingDto.toUserId,
                createRatingDto.ratingType,
                'add',
            );

            return savedRating;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to create rating:' + error,
            );
        }
    }

    async updateRating(
        ratingId: string,
        fromUserId: string,
        ratingType?: RatingType,
        comment?: string,
    ): Promise<Rating> {
        try {
            const rating = await this.ratingRepository.findOne({
                where: { id: ratingId, fromUserId },
            });

            if (!rating) {
                throw new NotFoundException(
                    'Rating not found or you do not have permission to update it',
                );
            }

            const oldRatingType = rating.ratingType;

            if (ratingType && ratingType !== oldRatingType) {
                await this.updateUserRatingCounts(
                    rating.toUserId,
                    oldRatingType,
                    'remove',
                );
                await this.updateUserRatingCounts(
                    rating.toUserId,
                    ratingType,
                    'add',
                );
                rating.ratingType = ratingType;
            }

            if (comment !== undefined) {
                rating.comment = comment;
            }

            return await this.ratingRepository.save(rating);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to update rating:' + error,
            );
        }
    }

    async getRatingsForUser(userId: string): Promise<Rating[]> {
        try {
            return await this.ratingRepository.find({
                where: { toUserId: userId },
                relations: ['fromUser', 'toUser', 'product'],
                order: { created_at: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch user ratings:' + error,
            );
        }
    }

    async getRatingsByUser(userId: string): Promise<Rating[]> {
        try {
            return await this.ratingRepository.find({
                where: { fromUserId: userId },
                relations: ['toUser', 'product'],
                order: { created_at: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch ratings given by user:' + error,
            );
        }
    }

    async getRatingByUserAndProduct(
        fromUserId: string,
        productId: string,
    ): Promise<Rating | null> {
        try {
            return await this.ratingRepository.findOne({
                where: { fromUserId, productId },
                relations: ['toUser', 'product'],
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch rating:' + error,
            );
        }
    }

    async getUserRatingStats(
        userId: string,
    ): Promise<{ positive: number; negative: number; percentage: number }> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const total = user.positiveRatings + user.negativeRatings;
            const percentage =
                total > 0 ? (user.positiveRatings / total) * 100 : 0;

            return {
                positive: user.positiveRatings,
                negative: user.negativeRatings,
                percentage: Math.round(percentage * 100) / 100,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to get rating stats:' + error,
            );
        }
    }

    private async updateUserRatingCounts(
        userId: string,
        ratingType: RatingType,
        action: 'add' | 'remove',
    ): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const increment = action === 'add' ? 1 : -1;

        if (ratingType === RatingType.POSITIVE) {
            user.positiveRatings += increment;
        } else {
            user.negativeRatings += increment;
        }

        user.positiveRatings = Math.max(0, user.positiveRatings);
        user.negativeRatings = Math.max(0, user.negativeRatings);

        await this.userRepository.save(user);
    }

    async deleteRating(ratingId: string, fromUserId: string): Promise<void> {
        try {
            const rating = await this.ratingRepository.findOne({
                where: { id: ratingId, fromUserId },
            });

            if (!rating) {
                throw new NotFoundException(
                    'Rating not found or you do not have permission to delete it',
                );
            }

            await this.updateUserRatingCounts(
                rating.toUserId,
                rating.ratingType,
                'remove',
            );
            await this.ratingRepository.softDelete(ratingId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to delete rating:' + error,
            );
        }
    }
}
