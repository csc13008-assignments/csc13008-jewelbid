import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, MoreThan } from 'typeorm';
import {
    Product,
    ProductStatus,
    JewelryCategory,
} from './entities/product.model';
import { Bid } from './entities/bid.model';
import { Watchlist } from './entities/watchlist.model';
import { Question } from './entities/question.model';
import { RejectedBidder } from './entities/rejected-bidder.model';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Bid)
        private readonly bidRepository: Repository<Bid>,
        @InjectRepository(Watchlist)
        private readonly watchlistRepository: Repository<Watchlist>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(RejectedBidder)
        private readonly rejectedBidderRepository: Repository<RejectedBidder>,
    ) {}

    async createProduct(
        createProductDto: CreateProductDto,
        sellerId: string,
    ): Promise<Product> {
        try {
            const product = this.productRepository.create({
                ...createProductDto,
                sellerId,
                currentPrice: createProductDto.startingPrice,
                endDate: new Date(createProductDto.endDate),
                status: ProductStatus.ACTIVE,
                bidCount: 0,
            });

            return await this.productRepository.save(product);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to create product:' + error,
            );
        }
    }

    async findAllActive(
        limit?: number,
        offset?: number,
    ): Promise<[Product[], number]> {
        try {
            const query = this.productRepository
                .createQueryBuilder('product')
                .where('product.status = :status', {
                    status: ProductStatus.ACTIVE,
                })
                .andWhere('product.endDate > :now', { now: new Date() })
                .leftJoinAndSelect('product.seller', 'seller')
                .leftJoinAndSelect('product.currentBidder', 'currentBidder');

            if (limit) {
                query.take(limit);
            }
            if (offset) {
                query.skip(offset);
            }

            return await query.getManyAndCount();
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch products:' + error,
            );
        }
    }

    async findByCategory(
        category: JewelryCategory,
        limit?: number,
        offset?: number,
    ): Promise<[Product[], number]> {
        try {
            return await this.productRepository.findAndCount({
                where: {
                    category,
                    status: ProductStatus.ACTIVE,
                    endDate: MoreThan(new Date()),
                },
                relations: ['seller', 'currentBidder'],
                take: limit,
                skip: offset,
                order: { created_at: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch products by category:' + error,
            );
        }
    }

    async findTopEndingSoon(limit: number = 5): Promise<Product[]> {
        try {
            return await this.productRepository.find({
                where: {
                    status: ProductStatus.ACTIVE,
                    endDate: MoreThan(new Date()),
                },
                relations: ['seller', 'currentBidder'],
                order: { endDate: 'ASC' },
                take: limit,
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch top ending soon products:' + error,
            );
        }
    }

    async findTopByBidCount(limit: number = 5): Promise<Product[]> {
        try {
            return await this.productRepository.find({
                where: {
                    status: ProductStatus.ACTIVE,
                    endDate: MoreThan(new Date()),
                },
                relations: ['seller', 'currentBidder'],
                order: { bidCount: 'DESC' },
                take: limit,
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch top bid count products:' + error,
            );
        }
    }

    async findTopByPrice(limit: number = 5): Promise<Product[]> {
        try {
            return await this.productRepository.find({
                where: {
                    status: ProductStatus.ACTIVE,
                    endDate: MoreThan(new Date()),
                },
                relations: ['seller', 'currentBidder'],
                order: { currentPrice: 'DESC' },
                take: limit,
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch top price products:' + error,
            );
        }
    }

    async findRecentProducts(minutes: number): Promise<Product[]> {
        try {
            const timeAgo = new Date();
            timeAgo.setMinutes(timeAgo.getMinutes() - minutes);

            return await this.productRepository.find({
                where: {
                    status: ProductStatus.ACTIVE,
                    created_at: MoreThan(timeAgo),
                },
                relations: ['seller', 'currentBidder'],
                order: { created_at: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch recent products:' + error,
            );
        }
    }

    async searchProducts(
        searchTerm: string,
        category?: JewelryCategory,
        limit?: number,
        offset?: number,
    ): Promise<[Product[], number]> {
        try {
            const query = this.productRepository
                .createQueryBuilder('product')
                .where('product.status = :status', {
                    status: ProductStatus.ACTIVE,
                })
                .andWhere('product.endDate > :now', { now: new Date() })
                .andWhere(
                    '(product.name ILIKE :searchTerm OR product.description ILIKE :searchTerm)',
                    { searchTerm: `%${searchTerm}%` },
                )
                .leftJoinAndSelect('product.seller', 'seller')
                .leftJoinAndSelect('product.currentBidder', 'currentBidder');

            if (category) {
                query.andWhere('product.category = :category', { category });
            }

            if (limit) {
                query.take(limit);
            }
            if (offset) {
                query.skip(offset);
            }

            return await query.getManyAndCount();
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to search products:' + error,
            );
        }
    }

    async findById(id: string): Promise<Product> {
        try {
            const product = await this.productRepository.findOne({
                where: { id },
                relations: ['seller', 'currentBidder'],
            });

            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }

            return product;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to fetch product:' + error,
            );
        }
    }

    async appendDescription(
        id: string,
        additionalDescription: string,
    ): Promise<Product> {
        try {
            const product = await this.findById(id);
            const timestamp = new Date().toLocaleDateString('en-GB');
            product.description = `${product.description}\n\n✏️ ${timestamp}\n\n${additionalDescription}`;
            return await this.productRepository.save(product);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to update product description:' + error,
            );
        }
    }

    async placeBid(
        productId: string,
        bidderId: string,
        bidAmount: number,
    ): Promise<Bid> {
        try {
            const bid = this.bidRepository.create({
                productId,
                bidderId,
                bidAmount,
            });

            return await this.bidRepository.save(bid);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to place bid:' + error,
            );
        }
    }

    async updateProductAfterBid(
        productId: string,
        bidderId: string,
        bidAmount: number,
    ): Promise<Product> {
        try {
            const product = await this.findById(productId);
            product.currentPrice = bidAmount;
            product.currentBidderId = bidderId;
            product.bidCount += 1;

            return await this.productRepository.save(product);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to update product after bid:' + error,
            );
        }
    }

    async getBidHistory(productId: string): Promise<Bid[]> {
        try {
            return await this.bidRepository.find({
                where: { productId, isRejected: false },
                relations: ['bidder'],
                order: { created_at: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch bid history:' + error,
            );
        }
    }

    async addToWatchlist(
        userId: string,
        productId: string,
    ): Promise<Watchlist> {
        try {
            const existing = await this.watchlistRepository.findOne({
                where: { userId, productId },
            });

            if (existing) {
                throw new BadRequestException('Product already in watchlist');
            }

            const watchlistItem = this.watchlistRepository.create({
                userId,
                productId,
            });

            return await this.watchlistRepository.save(watchlistItem);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to add to watchlist:' + error,
            );
        }
    }

    async removeFromWatchlist(
        userId: string,
        productId: string,
    ): Promise<void> {
        try {
            const result = await this.watchlistRepository.delete({
                userId,
                productId,
            });
            if (result.affected === 0) {
                throw new NotFoundException('Watchlist item not found');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to remove from watchlist:' + error,
            );
        }
    }

    async getWatchlist(userId: string): Promise<Product[]> {
        try {
            const watchlistItems = await this.watchlistRepository.find({
                where: { userId },
                relations: [
                    'product',
                    'product.seller',
                    'product.currentBidder',
                ],
                order: { created_at: 'DESC' },
            });

            return watchlistItems.map((item) => item.product);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch watchlist:' + error,
            );
        }
    }

    async getProductsUserIsBidding(userId: string): Promise<Product[]> {
        try {
            const bids = await this.bidRepository.find({
                where: { bidderId: userId, isRejected: false },
                relations: [
                    'product',
                    'product.seller',
                    'product.currentBidder',
                ],
                order: { created_at: 'DESC' },
            });

            const uniqueProducts = new Map<string, Product>();
            bids.forEach((bid) => {
                if (
                    bid.product.status === ProductStatus.ACTIVE &&
                    !uniqueProducts.has(bid.product.id)
                ) {
                    uniqueProducts.set(bid.product.id, bid.product);
                }
            });

            return Array.from(uniqueProducts.values());
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch products user is bidding on:' + error,
            );
        }
    }

    async getProductsUserWon(userId: string): Promise<Product[]> {
        try {
            return await this.productRepository.find({
                where: {
                    currentBidderId: userId,
                    status: ProductStatus.COMPLETED,
                },
                relations: ['seller'],
                order: { updated_at: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch products user won:' + error,
            );
        }
    }

    async askQuestion(
        productId: string,
        askerId: string,
        questionText: string,
    ): Promise<Question> {
        try {
            const question = this.questionRepository.create({
                productId,
                askerId,
                question: questionText,
            });

            return await this.questionRepository.save(question);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to ask question:' + error,
            );
        }
    }

    async answerQuestion(
        questionId: string,
        answerText: string,
    ): Promise<Question> {
        try {
            const question = await this.questionRepository.findOne({
                where: { id: questionId },
            });

            if (!question) {
                throw new NotFoundException('Question not found');
            }

            question.answer = answerText;
            question.answeredAt = new Date();

            return await this.questionRepository.save(question);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Failed to answer question:' + error,
            );
        }
    }

    async getProductQuestions(productId: string): Promise<Question[]> {
        try {
            return await this.questionRepository.find({
                where: { productId },
                relations: ['asker'],
                order: { created_at: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch questions:' + error,
            );
        }
    }

    async rejectBidder(productId: string, bidderId: string): Promise<void> {
        try {
            const rejectedBidder = this.rejectedBidderRepository.create({
                productId,
                bidderId,
            });

            await this.rejectedBidderRepository.save(rejectedBidder);

            await this.bidRepository.update(
                { productId, bidderId },
                { isRejected: true },
            );
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to reject bidder:' + error,
            );
        }
    }

    async isRejectedBidder(
        productId: string,
        bidderId: string,
    ): Promise<boolean> {
        try {
            const rejected = await this.rejectedBidderRepository.findOne({
                where: { productId, bidderId },
            });

            return !!rejected;
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to check rejected bidder status:' + error,
            );
        }
    }

    async getRelatedProducts(
        category: JewelryCategory,
        excludeId: string,
        limit: number = 5,
    ): Promise<Product[]> {
        try {
            return await this.productRepository.find({
                where: {
                    category,
                    status: ProductStatus.ACTIVE,
                    id: Not(excludeId),
                    endDate: MoreThan(new Date()),
                },
                relations: ['seller', 'currentBidder'],
                take: limit,
                order: { created_at: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch related products:' + error,
            );
        }
    }

    async getProductsBySeller(
        sellerId: string,
        includeCompleted: boolean = false,
    ): Promise<Product[]> {
        try {
            const where: any = { sellerId };

            if (!includeCompleted) {
                where.status = ProductStatus.ACTIVE;
            }

            return await this.productRepository.find({
                where,
                relations: ['currentBidder'],
                order: { created_at: 'DESC' },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch seller products:' + error,
            );
        }
    }

    async deleteProduct(id: string): Promise<void> {
        try {
            await this.productRepository.softDelete(id);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to delete product:' + error,
            );
        }
    }
}
