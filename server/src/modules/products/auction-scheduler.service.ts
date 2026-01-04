import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductsRepository } from './products.repository';
import { OrdersService } from '../orders/orders.service';
import { ProductStatus } from './entities/product.model';
import { UsersRepository } from '../users/users.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuctionSchedulerService {
    private readonly logger = new Logger(AuctionSchedulerService.name);

    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly ordersService: OrdersService,
        private readonly usersRepository: UsersRepository,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    // Run every minute to check for ended auctions
    @Cron(CronExpression.EVERY_MINUTE)
    async handleEndedAuctions(): Promise<void> {
        this.logger.debug('Checking for ended auctions...');

        try {
            // Find all active products that have ended
            const endedProducts =
                await this.productsRepository.findEndedActiveProducts();

            for (const product of endedProducts) {
                try {
                    // Skip products with no bids - they have no winner
                    if (!product.currentBidderId) {
                        this.logger.log(
                            `Auction ${product.id} ended with no bids - marking as completed`,
                        );
                        await this.productsRepository.updateProductStatus(
                            product.id,
                            ProductStatus.COMPLETED,
                        );

                        // Notify seller about no bids
                        try {
                            const seller =
                                await this.usersRepository.findOneById(
                                    product.sellerId,
                                );
                            await this.mailerService.sendMail({
                                to: seller.email,
                                subject: `Auction ended with no bids: ${product.name}`,
                                text: `Dear ${seller.fullname},\n\nYour auction for "${product.name}" has ended without any bids.\n\nYou may consider relisting the product with a lower starting price.\n\nBest regards,\nThe Jewelbid Team`,
                            });
                        } catch (emailError) {
                            this.logger.error(
                                `Failed to send no-bids notification: ${emailError}`,
                            );
                        }
                        continue;
                    }

                    // Create order for the winner
                    this.logger.log(
                        `Creating order for ended auction ${product.id} - Winner: ${product.currentBidderId}`,
                    );

                    await this.ordersService.createOrderFromAuction(
                        product.id,
                        product.sellerId,
                        product.currentBidderId,
                        Number(product.currentPrice),
                    );

                    // Mark product as completed
                    await this.productsRepository.updateProductStatus(
                        product.id,
                        ProductStatus.COMPLETED,
                    );

                    // Send email notifications to winner and seller
                    try {
                        const winner = await this.usersRepository.findOneById(
                            product.currentBidderId,
                        );
                        const seller = await this.usersRepository.findOneById(
                            product.sellerId,
                        );
                        const formattedPrice = new Intl.NumberFormat(
                            'vi-VN',
                        ).format(Number(product.currentPrice));

                        // Email to winner
                        await this.mailerService.sendMail({
                            to: winner.email,
                            subject: `Congratulations! You won: ${product.name}`,
                            text: `Dear ${winner.fullname},\n\nCongratulations! You have won the auction for "${product.name}" with the final price of ${formattedPrice} VND.\n\nPlease proceed to complete your order.\n\nView your order: ${this.configService.get('FRONTEND_URL')}/order/${product.id}\n\nBest regards,\nThe Jewelbid Team`,
                        });

                        // Email to seller
                        await this.mailerService.sendMail({
                            to: seller.email,
                            subject: `Auction ended: ${product.name}`,
                            text: `Dear ${seller.fullname},\n\nYour auction for "${product.name}" has ended successfully.\n\nWinner: ${winner.fullname}\nFinal Price: ${formattedPrice} VND\n\nPlease wait for the buyer to complete the payment process.\n\nBest regards,\nThe Jewelbid Team`,
                        });

                        // Email to other bidders (not the winner)
                        const allBidders =
                            await this.productsRepository.getUniqueBidders(
                                product.id,
                            );
                        const otherBidders = allBidders.filter(
                            (b) => b.id !== product.currentBidderId,
                        );

                        for (const bidder of otherBidders) {
                            await this.mailerService.sendMail({
                                to: bidder.email,
                                subject: `Auction ended: ${product.name}`,
                                text: `Dear ${bidder.fullname},\n\nThe auction for "${product.name}" has ended.\n\nUnfortunately, another bidder has won this auction with the final price of ${formattedPrice} VND.\n\nThank you for participating! Check out other auctions on our platform.\n\nBrowse auctions: ${this.configService.get('FRONTEND_URL')}/auctions\n\nBest regards,\nThe Jewelbid Team`,
                            });
                        }

                        this.logger.log(
                            `Auction end notifications sent for product ${product.id}`,
                        );
                    } catch (emailError) {
                        this.logger.error(
                            `Failed to send auction end notifications: ${emailError}`,
                        );
                        // Don't throw - order was created successfully
                    }

                    this.logger.log(
                        `Order created successfully for product ${product.id}`,
                    );
                } catch (error) {
                    this.logger.error(
                        `Failed to process ended auction ${product.id}: ${error}`,
                    );
                }
            }
        } catch (error) {
            this.logger.error(`Error checking ended auctions: ${error}`);
        }
    }
}
