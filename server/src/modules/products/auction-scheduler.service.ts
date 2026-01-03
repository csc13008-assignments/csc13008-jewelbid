import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductsRepository } from './products.repository';
import { OrdersService } from '../orders/orders.service';
import { ProductStatus } from './entities/product.model';

@Injectable()
export class AuctionSchedulerService {
    private readonly logger = new Logger(AuctionSchedulerService.name);

    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly ordersService: OrdersService,
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
