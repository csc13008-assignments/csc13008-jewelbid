import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, MoreThan } from 'typeorm';
import { Product, ProductStatus } from './entities/product.model';
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
        filters?: {
            category?: string;
            brand?: string;
            material?: string;
            targetAudience?: string;
            auctionStatus?: string;
        },
        sortBy?: string,
        sortOrder?: 'ASC' | 'DESC',
    ): Promise<[Product[], number]> {
        try {
            const query = this.productRepository
                .createQueryBuilder('product')
                .where('product.status = :status', {
                    status: ProductStatus.ACTIVE,
                })
                .andWhere('product.endDate > :now', { now: new Date() })
                .leftJoinAndSelect('product.seller', 'seller')
                .leftJoinAndSelect('product.currentBidder', 'currentBidder')
                .leftJoinAndSelect('product.category', 'category');

            // Apply filters
            if (filters?.category) {
                // Filter by category slug or name (case-insensitive)
                query.andWhere(
                    '(LOWER(category.slug) = LOWER(:category) OR LOWER(category.name) = LOWER(:category))',
                    { category: filters.category },
                );
            }

            if (filters?.brand) {
                query.andWhere('LOWER(product.brand) = LOWER(:brand)', {
                    brand: filters.brand,
                });
            }

            if (filters?.material) {
                query.andWhere('LOWER(product.material) = LOWER(:material)', {
                    material: filters.material,
                });
            }

            if (filters?.targetAudience) {
                // Convert slug format (for-men) to display format (for men)
                const targetAudienceValue = filters.targetAudience.replace(
                    /-/g,
                    ' ',
                );
                query.andWhere(
                    'LOWER(product.targetAudience) = LOWER(:targetAudience)',
                    {
                        targetAudience: targetAudienceValue,
                    },
                );
            }

            if (filters?.auctionStatus) {
                if (filters.auctionStatus === 'ending-soon') {
                    // Ending within 24 hours
                    const next24Hours = new Date();
                    next24Hours.setHours(next24Hours.getHours() + 24);
                    query.andWhere('product.endDate <= :endingSoon', {
                        endingSoon: next24Hours,
                    });
                } else if (filters.auctionStatus === 'new-arrivals') {
                    // Created within 7 days
                    const last7Days = new Date();
                    last7Days.setDate(last7Days.getDate() - 7);
                    query.andWhere('product.created_at >= :newArrivals', {
                        newArrivals: last7Days,
                    });
                }
            }

            // Apply sorting BEFORE pagination
            if (sortBy) {
                const order = sortOrder || 'DESC';
                switch (sortBy) {
                    case 'newest':
                        query.orderBy('product.created_at', order);
                        break;
                    case 'oldest':
                        query.orderBy(
                            'product.created_at',
                            order === 'DESC' ? 'ASC' : 'DESC',
                        );
                        break;
                    case 'price-asc':
                        query.orderBy('product.currentPrice', 'ASC');
                        break;
                    case 'price-desc':
                        query.orderBy('product.currentPrice', 'DESC');
                        break;
                    case 'popular':
                        query.orderBy('product.bidCount', 'DESC');
                        break;
                    case 'ending-soon':
                        query.orderBy('product.endDate', 'ASC');
                        break;
                    default:
                        query.orderBy('product.created_at', 'DESC');
                }
            } else {
                query.orderBy('product.created_at', 'DESC');
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
                'Failed to fetch products:' + error,
            );
        }
    }

    // For admin panel - get all products including ended ones
    async findAllForAdmin(
        limit?: number,
        offset?: number,
    ): Promise<[Product[], number]> {
        try {
            const query = this.productRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.seller', 'seller')
                .leftJoinAndSelect('product.currentBidder', 'currentBidder')
                .orderBy('product.created_at', 'DESC');

            if (limit) {
                query.take(limit);
            }
            if (offset) {
                query.skip(offset);
            }

            return await query.getManyAndCount();
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch all products for admin:' + error,
            );
        }
    }

    async findByCategory(
        categoryId: string,
        limit?: number,
        offset?: number,
    ): Promise<[Product[], number]> {
        try {
            return await this.productRepository.findAndCount({
                where: {
                    categoryId,
                    status: ProductStatus.ACTIVE,
                    endDate: MoreThan(new Date()),
                },
                relations: ['seller', 'currentBidder', 'category'],
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
        category?: string,
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

            const sanitizedTerm = searchTerm
                .trim()
                .replace(/[^\w\s]/g, '') // Remove special characters
                .split(/\s+/)
                .filter((word) => word.length > 0)
                .map((word) => word + ':*')
                .join(' & ');

            if (sanitizedTerm) {
                query
                    .andWhere(
                        `product.search_vector @@ to_tsquery('english', :searchQuery)`,
                        { searchQuery: sanitizedTerm },
                    )
                    .addSelect(
                        `ts_rank(product.search_vector, to_tsquery('english', :searchQuery))`,
                        'search_rank',
                    )
                    .orderBy('search_rank', 'DESC');
            } else {
                throw new BadRequestException('Invalid search term');
            }

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
                relations: ['seller', 'currentBidder', 'category'],
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
        maxBid?: number,
    ): Promise<Bid> {
        try {
            const bid = this.bidRepository.create({
                productId,
                bidderId,
                bidAmount,
                maxBid: maxBid || bidAmount,
                created_at: new Date(),
            });

            return await this.bidRepository.save(bid);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to place bid:' + error,
            );
        }
    }

    async getCurrentWinningBid(productId: string): Promise<Bid | null> {
        try {
            const bids = await this.bidRepository.find({
                where: { productId, isRejected: false },
                order: { created_at: 'DESC' },
            });

            if (bids.length === 0) return null;

            // Find the bid with highest maxBid (or bidAmount if maxBid is null)
            return bids.reduce((highest, current) => {
                const highestMax = highest.maxBid || highest.bidAmount;
                const currentMax = current.maxBid || current.bidAmount;
                return currentMax > highestMax ? current : highest;
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to get current winning bid:' + error,
            );
        }
    }

    async updateBidAmount(bidId: string, newAmount: number): Promise<void> {
        try {
            await this.bidRepository.update(bidId, { bidAmount: newAmount });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to update bid amount:' + error,
            );
        }
    }

    async updateProductAfterBid(
        productId: string,
        bidderId: string,
        bidAmount: number,
    ): Promise<Product> {
        try {
            // Update product directly in database
            await this.productRepository.update(productId, {
                currentPrice: bidAmount,
                currentBidderId: bidderId,
            });

            // Increment bid count
            await this.productRepository.increment(
                { id: productId },
                'bidCount',
                1,
            );

            // Fresh query with relations to ensure we get updated data
            const updatedProduct = await this.productRepository.findOne({
                where: { id: productId },
                relations: ['seller', 'currentBidder'],
            });

            if (!updatedProduct) {
                throw new NotFoundException(
                    `Product with ID ${productId} not found`,
                );
            }

            return updatedProduct;
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to update product after bid:' + error,
            );
        }
    }

    async getBidHistory(productId: string): Promise<Bid[]> {
        try {
            // Use QueryBuilder to ensure proper numeric ordering for decimal columns
            return await this.bidRepository
                .createQueryBuilder('bid')
                .leftJoinAndSelect('bid.bidder', 'bidder')
                .where('bid.productId = :productId', { productId })
                .andWhere('bid.isRejected = :isRejected', { isRejected: false })
                // Sort by: 1) price DESC (highest first), 2) time ASC (earlier first)
                .orderBy('CAST(bid.bidAmount AS NUMERIC)', 'DESC')
                .addOrderBy('bid.created_at', 'ASC')
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch bid history:' + error,
            );
        }
    }

    async getUserMaxBid(
        productId: string,
        userId: string,
    ): Promise<number | null> {
        try {
            const userBids = await this.bidRepository.find({
                where: { productId, bidderId: userId, isRejected: false },
                order: { created_at: 'DESC' },
            });

            if (userBids.length === 0) return null;

            // Find the highest maxBid among user's bids
            const highestMaxBid = userBids.reduce((highest, current) => {
                const currentMax = current.maxBid || current.bidAmount;
                return currentMax > highest ? currentMax : highest;
            }, 0);

            return highestMaxBid;
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to get user max bid:' + error,
            );
        }
    }

    // Get unique bidders for a product (for notification purposes)
    async getUniqueBidders(
        productId: string,
    ): Promise<{ id: string; email: string; fullname: string }[]> {
        try {
            const bids = await this.bidRepository.find({
                where: { productId, isRejected: false },
                relations: ['bidder'],
            });

            const uniqueBidders = new Map<
                string,
                { id: string; email: string; fullname: string }
            >();
            bids.forEach((bid) => {
                if (bid.bidder && !uniqueBidders.has(bid.bidderId)) {
                    uniqueBidders.set(bid.bidderId, {
                        id: bid.bidder.id,
                        email: bid.bidder.email,
                        fullname: bid.bidder.fullname,
                    });
                }
            });

            return Array.from(uniqueBidders.values());
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch unique bidders:' + error,
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

            await this.watchlistRepository.save(watchlistItem);

            // Increment watchlist count
            await this.productRepository.increment(
                { id: productId },
                'watchlistCount',
                1,
            );

            return watchlistItem;
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

            // Decrement watchlist count
            await this.productRepository.decrement(
                { id: productId },
                'watchlistCount',
                1,
            );
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
        categoryId: string,
        excludeId: string,
        limit: number = 5,
    ): Promise<Product[]> {
        try {
            return await this.productRepository.find({
                where: {
                    categoryId,
                    status: ProductStatus.ACTIVE,
                    id: Not(excludeId),
                    endDate: MoreThan(new Date()),
                },
                relations: ['seller', 'currentBidder', 'category'],
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
            } else {
                // For completed products: status must be COMPLETED
                // OR (status is ACTIVE but endDate has passed)
                const now = new Date();
                const products = await this.productRepository.find({
                    where: { sellerId },
                    relations: ['currentBidder'],
                    order: { created_at: 'DESC' },
                });

                // Filter to only include completed/ended products
                return products.filter(
                    (p) =>
                        p.status === ProductStatus.COMPLETED ||
                        (p.status === ProductStatus.ACTIVE &&
                            new Date(p.endDate) < now),
                );
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

    async updateEndDate(productId: string, newEndDate: Date): Promise<void> {
        try {
            await this.productRepository.update(productId, {
                endDate: newEndDate,
            });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to update end date:' + error,
            );
        }
    }

    // Find active products that have passed their end date
    async findEndedActiveProducts(): Promise<Product[]> {
        try {
            return await this.productRepository
                .find({
                    where: {
                        status: ProductStatus.ACTIVE,
                    },
                    relations: ['seller', 'currentBidder'],
                })
                .then((products) =>
                    products.filter((p) => new Date(p.endDate) < new Date()),
                );
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to find ended active products:' + error,
            );
        }
    }

    // Update product status
    async updateProductStatus(
        productId: string,
        status: ProductStatus,
    ): Promise<void> {
        try {
            await this.productRepository.update(productId, { status });
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to update product status:' + error,
            );
        }
    }
}
