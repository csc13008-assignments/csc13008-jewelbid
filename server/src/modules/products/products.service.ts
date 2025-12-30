import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { UsersRepository } from '../users/users.repository';
import { Product, ProductStatus } from './entities/product.model';
import { CreateProductDto } from './dtos/create-product.dto';
import { PlaceBidDto, BidHistoryItemDto } from './dtos/bid.dto';
import { AskQuestionDto, AnswerQuestionDto } from './dtos/question.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly usersRepository: UsersRepository,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        private readonly ordersService: OrdersService,
    ) {}

    async createProduct(
        createProductDto: CreateProductDto,
        sellerId: string,
    ): Promise<Product> {
        if (!createProductDto.mainImage) {
            throw new BadRequestException('Main image is required');
        }

        if (
            !createProductDto.additionalImages ||
            createProductDto.additionalImages.length < 3
        ) {
            throw new BadRequestException(
                'At least 3 additional images are required',
            );
        }

        if (
            createProductDto.buyNowPrice &&
            createProductDto.buyNowPrice <= createProductDto.startingPrice
        ) {
            throw new BadRequestException(
                'Buy now price must be greater than starting price',
            );
        }

        return await this.productsRepository.createProduct(
            createProductDto,
            sellerId,
        );
    }

    async getAllProducts(
        page: number = 1,
        limit: number = 20,
        filters?: {
            category?: string;
            brand?: string;
            material?: string;
            targetAudience?: string;
            auctionStatus?: string;
        },
        sortBy?: string,
    ): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const offset = (page - 1) * limit;
        const [products, total] = await this.productsRepository.findAllActive(
            limit,
            offset,
            filters,
            sortBy,
        );

        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    // For admin panel - get all products including ended ones
    async getAllProductsForAdmin(
        page: number = 1,
        limit: number = 100,
    ): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const offset = (page - 1) * limit;
        const [products, total] = await this.productsRepository.findAllForAdmin(
            limit,
            offset,
        );

        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getProductsByCategory(
        categoryId: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const offset = (page - 1) * limit;
        const [products, total] = await this.productsRepository.findByCategory(
            categoryId,
            limit,
            offset,
        );

        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getHomePageProducts(): Promise<{
        topEndingSoon: Product[];
        topBidCount: Product[];
        topPrice: Product[];
    }> {
        const [topEndingSoon, topBidCount, topPrice] = await Promise.all([
            this.productsRepository.findTopEndingSoon(5),
            this.productsRepository.findTopByBidCount(5),
            this.productsRepository.findTopByPrice(5),
        ]);

        return {
            topEndingSoon,
            topBidCount,
            topPrice,
        };
    }

    async searchProducts(
        searchTerm: string,
        category?: string,
        sortBy: 'endDate' | 'price' = 'endDate',
        page: number = 1,
        limit: number = 20,
    ): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const offset = (page - 1) * limit;
        const [products, total] = await this.productsRepository.searchProducts(
            searchTerm,
            category,
            limit,
            offset,
        );

        if (sortBy === 'endDate') {
            products.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
        } else if (sortBy === 'price') {
            products.sort(
                (a, b) => Number(a.currentPrice) - Number(b.currentPrice),
            );
        }

        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getProductDetails(productId: string): Promise<{
        product: Product;
        relatedProducts: Product[];
        questions: any[];
    }> {
        const product = await this.productsRepository.findById(productId);
        const relatedProducts =
            await this.productsRepository.getRelatedProducts(
                product.categoryId,
                productId,
                5,
            );
        const questions =
            await this.productsRepository.getProductQuestions(productId);

        return {
            product,
            relatedProducts,
            questions,
        };
    }

    async placeBid(
        productId: string,
        userId: string,
        placeBidDto: PlaceBidDto,
    ): Promise<Product> {
        const product = await this.productsRepository.findById(productId);

        if (product.status !== ProductStatus.ACTIVE) {
            throw new BadRequestException(
                'Product is not available for bidding',
            );
        }

        if (product.endDate < new Date()) {
            throw new BadRequestException('Auction has ended');
        }

        if (product.sellerId === userId) {
            throw new BadRequestException(
                'Seller cannot bid on their own product',
            );
        }

        const isRejected = await this.productsRepository.isRejectedBidder(
            productId,
            userId,
        );
        if (isRejected) {
            throw new ForbiddenException(
                'You have been rejected from bidding on this product',
            );
        }

        const user = await this.usersRepository.findOneById(userId);

        if (!user.isEmailVerified) {
            throw new ForbiddenException(
                'Email verification required to bid on this product',
            );
        }
        const totalRatings = user.positiveRatings + user.negativeRatings;

        if (totalRatings > 0) {
            const ratingScore = user.positiveRatings / totalRatings;
            if (ratingScore < 0.8) {
                throw new ForbiddenException(
                    'Your rating score is too low to bid on this product (min 80%)',
                );
            }
        } else {
            if (!product.allowNewBidders) {
                throw new ForbiddenException(
                    'This product does not accept bids from users with no rating history',
                );
            }
        }

        const minBidAmount =
            Number(product.currentPrice) + Number(product.stepPrice);

        return await this.handleAutoBid(
            product,
            userId,
            user.fullname,
            placeBidDto.maxBid,
            minBidAmount,
        );
    }

    async buyNow(productId: string, userId: string): Promise<Product> {
        const product = await this.productsRepository.findById(productId);

        if (product.status !== ProductStatus.ACTIVE) {
            throw new BadRequestException(
                'Product is not available for purchase',
            );
        }

        if (product.endDate < new Date()) {
            throw new BadRequestException('Auction has ended');
        }

        if (!product.buyNowPrice) {
            throw new BadRequestException(
                'Buy Now is not available for this product',
            );
        }

        if (product.sellerId === userId) {
            throw new BadRequestException(
                'Seller cannot buy their own product',
            );
        }

        // Close auction
        await this.productsRepository.updateEndDate(productId, new Date());
        // Might need to update status to SOLD or similar if supported?
        // Logic seems to rely on End Date + Winning Bid.
        // If Buy Now -> Create a winning bid at buyNowPrice?
        // Or directly create Order?
        // If we create Order, the product is effectively sold.
        // Let's create a "winning bid" first so system consistency is maintained?
        // Step 869 handleAutoBid creates bids.
        // If I create a bid at buyNowPrice, handleAutoBid throws error "Use buy now feature".
        // So I should manually insert the winning bid.

        // 1. Place winning bid
        await this.productsRepository.placeBid(
            productId,
            userId,
            Number(product.buyNowPrice),
            Number(product.buyNowPrice),
        );

        const updatedProduct =
            await this.productsRepository.updateProductAfterBid(
                productId,
                userId,
                Number(product.buyNowPrice),
            );

        // 2. Create Order
        await this.ordersService.createOrderFromAuction(
            productId,
            product.sellerId,
            userId,
            Number(product.buyNowPrice),
        );

        return updatedProduct;
    }

    private async handleAutoBid(
        product: Product,
        userId: string,
        userFullname: string,
        maxBid: number,
        minBidAmount: number,
    ): Promise<Product> {
        // Validate maxBid >= minimum
        if (maxBid < minBidAmount) {
            throw new BadRequestException(
                `Your maximum bid (${maxBid}) must be at least ${minBidAmount}`,
            );
        }

        if (product.buyNowPrice && maxBid >= Number(product.buyNowPrice)) {
            throw new BadRequestException('Use buy now feature for this price');
        }

        // Get current winning bid (if any)
        const currentWinningBid =
            await this.productsRepository.getCurrentWinningBid(product.id);

        // Case 1: No existing bids - start at starting price
        if (!currentWinningBid) {
            const bidAmount = Number(product.startingPrice);
            await this.productsRepository.placeBid(
                product.id,
                userId,
                bidAmount,
                maxBid,
            );
            const updatedProduct =
                await this.productsRepository.updateProductAfterBid(
                    product.id,
                    userId,
                    bidAmount,
                );

            await this.sendBidNotifications(updatedProduct, userFullname, null);
            await this.handleAutoRenewal(updatedProduct, product.id);

            return updatedProduct;
        }

        // Case 2: Same user trying to increase their maxBid
        if (currentWinningBid.bidderId === userId) {
            if (
                maxBid <=
                (currentWinningBid.maxBid || currentWinningBid.bidAmount)
            ) {
                throw new BadRequestException(
                    'Your new max bid must be higher than your current max bid',
                );
            }

            // Just update the maxBid, keep same bidAmount
            await this.productsRepository.placeBid(
                product.id,
                userId,
                currentWinningBid.bidAmount,
                maxBid,
            );

            return product; // No change in winning price
        }

        // Case 3: Tie-breaking - same maxBid as current winner
        if (
            maxBid === (currentWinningBid.maxBid || currentWinningBid.bidAmount)
        ) {
            throw new BadRequestException(
                'Another bidder has the same maximum bid and bid earlier. You need to bid higher.',
            );
        }

        // Case 4: New bidder maxBid < current winner's maxBid
        if (
            maxBid < (currentWinningBid.maxBid || currentWinningBid.bidAmount)
        ) {
            // Current winner still wins, but price goes up to new bidder's maxBid
            const newPrice = maxBid;

            // Record new bidder's bid
            await this.productsRepository.placeBid(
                product.id,
                userId,
                maxBid,
                maxBid,
            );

            // Update current winner's displayed bid amount
            await this.productsRepository.updateBidAmount(
                currentWinningBid.id,
                newPrice,
            );

            const updatedProduct =
                await this.productsRepository.updateProductAfterBid(
                    product.id,
                    currentWinningBid.bidderId,
                    newPrice,
                );

            await this.sendBidNotifications(
                updatedProduct,
                userFullname,
                currentWinningBid.bidderId,
            );
            await this.handleAutoRenewal(updatedProduct, product.id);

            return updatedProduct;
        }

        // Case 5: New bidder maxBid > current winner's maxBid (new bidder wins!)
        const newPrice = Math.min(
            (currentWinningBid.maxBid || currentWinningBid.bidAmount) +
                Number(product.stepPrice),
            maxBid,
        );

        await this.productsRepository.placeBid(
            product.id,
            userId,
            newPrice,
            maxBid,
        );

        const updatedProduct =
            await this.productsRepository.updateProductAfterBid(
                product.id,
                userId,
                newPrice,
            );

        await this.sendBidNotifications(
            updatedProduct,
            userFullname,
            currentWinningBid.bidderId,
        );
        await this.handleAutoRenewal(updatedProduct, product.id);

        return updatedProduct;
    }

    private async handleAutoRenewal(
        product: Product,
        productId: string,
    ): Promise<void> {
        if (!product.autoRenewal) return;

        // Get configurable settings from admin (will be implemented via SettingsService)
        // For now, use hardcoded values: 5 minutes trigger, 10 minutes extension
        const triggerMinutes = 5;
        const extensionMinutes = 10;

        const timeUntilEnd = product.endDate.getTime() - new Date().getTime();
        const triggerThreshold = triggerMinutes * 60 * 1000;

        if (timeUntilEnd < triggerThreshold) {
            const newEndDate = new Date(
                product.endDate.getTime() + extensionMinutes * 60 * 1000,
            );
            await this.productsRepository.updateEndDate(productId, newEndDate);
        }
    }

    private async sendBidNotifications(
        product: Product,
        bidderName: string,
        previousBidderId?: string,
    ): Promise<void> {
        try {
            const seller = await this.usersRepository.findOneById(
                product.sellerId,
            );
            await this.mailerService.sendMail({
                to: seller.email,
                subject: `New bid on your product: ${product.name}`,
                text: `A new bid of ${product.currentPrice} has been placed on your product "${product.name}" by ${bidderName}.`,
            });

            if (previousBidderId) {
                const previousBidder =
                    await this.usersRepository.findOneById(previousBidderId);
                await this.mailerService.sendMail({
                    to: previousBidder.email,
                    subject: `You have been outbid on: ${product.name}`,
                    text: `Your bid on "${product.name}" has been outbid. Current price is ${product.currentPrice}.`,
                });
            }
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to send bid notifications:' + error,
            );
        }
    }

    async getBidHistory(productId: string): Promise<BidHistoryItemDto[]> {
        const bids = await this.productsRepository.getBidHistory(productId);

        return bids.map((bid) => ({
            bidderId: bid.bidderId,
            bidderName: this.maskName(bid.bidder.fullname),
            bidAmount: Number(bid.bidAmount),
            bidTime: bid.created_at,
        }));
    }

    private maskName(fullname: string): string {
        const parts = fullname.split(' ');
        if (parts.length === 1) {
            return '****' + fullname.slice(-2);
        }
        const lastName = parts[parts.length - 1];
        return '****' + lastName;
    }

    async checkRejection(productId: string, userId: string): Promise<boolean> {
        return await this.productsRepository.isRejectedBidder(
            productId,
            userId,
        );
    }

    async addToWatchlist(
        userId: string,
        productId: string,
    ): Promise<{ message: string }> {
        await this.productsRepository.addToWatchlist(userId, productId);
        return { message: 'Product added to watchlist' };
    }

    async removeFromWatchlist(
        userId: string,
        productId: string,
    ): Promise<{ message: string }> {
        await this.productsRepository.removeFromWatchlist(userId, productId);
        return { message: 'Product removed from watchlist' };
    }

    async getWatchlist(userId: string): Promise<Product[]> {
        return await this.productsRepository.getWatchlist(userId);
    }

    async getProductsUserIsBidding(userId: string): Promise<Product[]> {
        return await this.productsRepository.getProductsUserIsBidding(userId);
    }

    async getProductsUserWon(userId: string): Promise<Product[]> {
        return await this.productsRepository.getProductsUserWon(userId);
    }

    async askQuestion(
        askQuestionDto: AskQuestionDto,
        userId: string,
    ): Promise<{ message: string }> {
        const product = await this.productsRepository.findById(
            askQuestionDto.productId,
        );

        const seller = await this.usersRepository.findOneById(product.sellerId);
        const asker = await this.usersRepository.findOneById(userId);

        // Save question to database
        await this.productsRepository.askQuestion(
            askQuestionDto.productId,
            userId,
            askQuestionDto.question,
        );

        // Send email to seller
        await this.mailerService.sendMail({
            to: seller.email,
            subject: `New question on your product: ${product.name}`,
            text: `${asker.fullname} asked: ${askQuestionDto.question}\n\nView and answer: ${this.configService.get('FRONTEND_URL')}/products/${product.id}`,
        });

        return { message: 'Question submitted successfully' };
    }

    async answerQuestion(
        questionId: string,
        answerDto: AnswerQuestionDto,
        sellerId: string,
    ): Promise<{ message: string }> {
        const question = await this.productsRepository.answerQuestion(
            questionId,
            answerDto.answer,
        );
        const product = await this.productsRepository.findById(
            question.productId,
        );

        if (product.sellerId !== sellerId) {
            throw new ForbiddenException(
                'Only the seller can answer questions',
            );
        }

        const asker = await this.usersRepository.findOneById(question.askerId);
        await this.mailerService.sendMail({
            to: asker.email,
            subject: `Your question has been answered: ${product.name}`,
            text: `Question: ${question.question}\n\nAnswer: ${answerDto.answer}`,
        });

        return { message: 'Answer submitted successfully' };
    }

    async appendDescription(
        productId: string,
        additionalDescription: string,
        sellerId: string,
    ): Promise<Product> {
        const product = await this.productsRepository.findById(productId);

        if (product.sellerId !== sellerId) {
            throw new ForbiddenException(
                'Only the seller can update product description',
            );
        }

        return await this.productsRepository.appendDescription(
            productId,
            additionalDescription,
        );
    }

    async rejectBidder(
        productId: string,
        bidderId: string,
        sellerId: string,
    ): Promise<{ message: string }> {
        const product = await this.productsRepository.findById(productId);

        if (product.sellerId !== sellerId) {
            throw new ForbiddenException('Only the seller can reject bidders');
        }

        await this.productsRepository.rejectBidder(productId, bidderId);

        if (product.currentBidderId === bidderId) {
            const bids = await this.productsRepository.getBidHistory(productId);
            const validBids = bids.filter((bid) => bid.bidderId !== bidderId);

            if (validBids.length > 0) {
                const nextHighestBid = validBids[0];
                await this.productsRepository.updateProductAfterBid(
                    productId,
                    nextHighestBid.bidderId,
                    Number(nextHighestBid.bidAmount),
                );
            } else {
                await this.productsRepository.updateProductAfterBid(
                    productId,
                    null,
                    Number(product.startingPrice),
                );
            }
        }

        const bidder = await this.usersRepository.findOneById(bidderId);
        await this.mailerService.sendMail({
            to: bidder.email,
            subject: `You have been rejected from bidding: ${product.name}`,
            text: `You are no longer able to bid on the product "${product.name}".`,
        });

        return { message: 'Bidder rejected successfully' };
    }

    async getSellerProducts(sellerId: string): Promise<Product[]> {
        return await this.productsRepository.getProductsBySeller(
            sellerId,
            false,
        );
    }

    async getSellerCompletedProducts(sellerId: string): Promise<Product[]> {
        return await this.productsRepository.getProductsBySeller(
            sellerId,
            true,
        );
    }

    async deleteProduct(
        productId: string,
        userId: string,
        userRole: string,
    ): Promise<{ message: string }> {
        const product = await this.productsRepository.findById(productId);

        // Admin can delete any product, seller can only delete their own
        if (userRole.toLowerCase() !== 'admin' && product.sellerId !== userId) {
            throw new ForbiddenException(
                'Only the seller or admin can delete this product',
            );
        }

        await this.productsRepository.deleteProduct(productId);
        return { message: 'Product deleted successfully' };
    }
}
