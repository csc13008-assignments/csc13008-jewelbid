import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { UsersRepository } from '../users/users.repository';
import {
    Product,
    JewelryCategory,
    ProductStatus,
} from './entities/product.model';
import { CreateProductDto } from './dtos/create-product.dto';
import { PlaceBidDto, BidHistoryItemDto } from './dtos/bid.dto';
import { AskQuestionDto, AnswerQuestionDto } from './dtos/question.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly usersRepository: UsersRepository,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    async createProduct(
        createProductDto: CreateProductDto,
        sellerId: string,
    ): Promise<Product> {
        if (createProductDto.additionalImages.length < 3) {
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
        );

        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getProductsByCategory(
        category: JewelryCategory,
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
            category,
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
        category?: JewelryCategory,
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
                product.category,
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
        if (!user.isEmailVerified && !product.allowNewBidders) {
            throw new ForbiddenException(
                'Email verification required to bid on this product',
            );
        }

        const minBidAmount =
            Number(product.currentPrice) + Number(product.stepPrice);
        if (placeBidDto.bidAmount < minBidAmount) {
            throw new BadRequestException(
                `Minimum bid amount is ${minBidAmount}`,
            );
        }

        if (
            product.buyNowPrice &&
            placeBidDto.bidAmount >= Number(product.buyNowPrice)
        ) {
            throw new BadRequestException('Use buy now feature for this price');
        }

        await this.productsRepository.placeBid(
            productId,
            userId,
            placeBidDto.bidAmount,
        );
        const updatedProduct =
            await this.productsRepository.updateProductAfterBid(
                productId,
                userId,
                placeBidDto.bidAmount,
            );

        await this.sendBidNotifications(
            updatedProduct,
            user.fullname,
            product.currentBidderId,
        );

        const timeUntilEnd =
            updatedProduct.endDate.getTime() - new Date().getTime();
        const fiveMinutes = 5 * 60 * 1000;
        if (updatedProduct.autoRenewal && timeUntilEnd < fiveMinutes) {
            const newEndDate = new Date(
                updatedProduct.endDate.getTime() + 10 * 60 * 1000,
            );
            updatedProduct.endDate = newEndDate;
            await this.productsRepository.updateProductAfterBid(
                productId,
                userId,
                placeBidDto.bidAmount,
            );
        }

        return updatedProduct;
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
    ): Promise<{ message: string }> {
        const product = await this.productsRepository.findById(productId);

        if (product.sellerId !== userId) {
            throw new ForbiddenException(
                'Only the seller or admin can delete this product',
            );
        }

        await this.productsRepository.deleteProduct(productId);
        return { message: 'Product deleted successfully' };
    }
}
