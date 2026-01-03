import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Inject,
    forwardRef,
    Logger,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order, OrderStatus } from './entities/order.model';
import {
    SubmitPaymentInfoDto,
    ConfirmShipmentDto,
    ConfirmDeliveryDto,
    CancelOrderDto,
} from './dtos/order-workflow.dto';
import { UsersRatingRepository } from '../users/users-rating.repository';
import { RatingType } from '../users/entities/rating.model';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private readonly ordersRepository: OrdersRepository,
        @Inject(forwardRef(() => UsersRatingRepository))
        private readonly usersRatingRepository: UsersRatingRepository,
    ) {}

    async getOrderByProductId(productId: string): Promise<Order> {
        const order = await this.ordersRepository.findByProductId(productId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    async getMyBuyerOrders(buyerId: string): Promise<Order[]> {
        return await this.ordersRepository.findByBuyerId(buyerId);
    }

    async getMySellerOrders(sellerId: string): Promise<Order[]> {
        return await this.ordersRepository.findBySellerId(sellerId);
    }

    async getPendingBuyerOrders(buyerId: string): Promise<Order[]> {
        return await this.ordersRepository.findPendingOrdersForBuyer(buyerId);
    }

    async getPendingSellerOrders(sellerId: string): Promise<Order[]> {
        return await this.ordersRepository.findPendingOrdersForSeller(sellerId);
    }

    // Step 1: Buyer submits payment info + delivery address
    async submitPaymentInfo(
        productId: string,
        buyerId: string,
        dto: SubmitPaymentInfoDto,
    ): Promise<Order> {
        const order = await this.getOrderByProductId(productId);

        // Verify buyer ownership
        if (order.buyerId !== buyerId) {
            throw new ForbiddenException('You are not the buyer of this order');
        }

        // Verify order status
        if (order.status !== OrderStatus.PENDING_PAYMENT_INFO) {
            throw new BadRequestException(
                `Cannot submit payment info. Current status: ${order.status}`,
            );
        }

        order.paymentProof = dto.paymentProof;
        order.deliveryAddress = dto.deliveryAddress;
        if (dto.buyerNotes) {
            order.buyerNotes = dto.buyerNotes;
        }
        order.status = OrderStatus.PENDING_SHIPMENT;
        order.paymentInfoSubmittedAt = new Date();

        return await this.ordersRepository.save(order);
    }

    // Step 2: Seller confirms payment received + provides tracking
    async confirmShipment(
        productId: string,
        sellerId: string,
        dto: ConfirmShipmentDto,
    ): Promise<Order> {
        const order = await this.getOrderByProductId(productId);

        // Verify seller ownership
        if (order.sellerId !== sellerId) {
            throw new ForbiddenException(
                'You are not the seller of this order',
            );
        }

        // Verify order status
        if (order.status !== OrderStatus.PENDING_SHIPMENT) {
            throw new BadRequestException(
                `Cannot confirm shipment. Current status: ${order.status}`,
            );
        }

        order.trackingNumber = dto.trackingNumber;
        if (dto.sellerNotes) {
            order.sellerNotes = dto.sellerNotes;
        }
        order.status = OrderStatus.PENDING_DELIVERY_CONFIRMATION;
        order.shipmentConfirmedAt = new Date();

        return await this.ordersRepository.save(order);
    }

    // Step 3: Buyer confirms delivery received
    async confirmDelivery(
        productId: string,
        buyerId: string,
        dto: ConfirmDeliveryDto,
    ): Promise<Order> {
        const order = await this.getOrderByProductId(productId);

        // Verify buyer ownership
        if (order.buyerId !== buyerId) {
            throw new ForbiddenException('You are not the buyer of this order');
        }

        // Verify order status
        if (order.status !== OrderStatus.PENDING_DELIVERY_CONFIRMATION) {
            throw new BadRequestException(
                `Cannot confirm delivery. Current status: ${order.status}`,
            );
        }

        if (dto.buyerNotes) {
            order.buyerNotes = dto.buyerNotes;
        }
        order.status = OrderStatus.COMPLETED;
        order.deliveryConfirmedAt = new Date();
        order.completedAt = new Date();

        return await this.ordersRepository.save(order);
    }

    // Seller can cancel order at any time
    async cancelOrder(
        productId: string,
        sellerId: string,
        dto: CancelOrderDto,
    ): Promise<Order> {
        const order = await this.getOrderByProductId(productId);

        // Verify seller ownership
        if (order.sellerId !== sellerId) {
            throw new ForbiddenException(
                'You are not the seller of this order',
            );
        }

        // Cannot cancel already completed/cancelled orders
        if (
            order.status === OrderStatus.COMPLETED ||
            order.status === OrderStatus.CANCELLED
        ) {
            throw new BadRequestException(
                `Cannot cancel order. Current status: ${order.status}`,
            );
        }

        order.status = OrderStatus.CANCELLED;
        order.cancellationReason = dto.reason;
        order.cancelledAt = new Date();

        // Automatically create negative rating for buyer when seller cancels
        try {
            await this.usersRatingRepository.createRating(
                {
                    toUserId: order.buyerId,
                    productId: order.productId,
                    ratingType: RatingType.NEGATIVE,
                    comment: `Order cancelled by seller. Reason: ${dto.reason}`,
                },
                sellerId,
            );
            this.logger.log(
                `Created negative rating for buyer ${order.buyerId} due to order cancellation`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to create negative rating for buyer: ${error}`,
            );
            // Don't fail the cancellation if rating creation fails
        }

        return await this.ordersRepository.save(order);
    }

    // Create order when auction ends (called by Products module)
    async createOrderFromAuction(
        productId: string,
        sellerId: string,
        buyerId: string,
        finalPrice: number,
    ): Promise<Order> {
        // Check if order already exists
        const existing = await this.ordersRepository.findByProductId(productId);
        if (existing) {
            return existing;
        }

        const order = this.ordersRepository.create({
            productId,
            sellerId,
            buyerId,
            finalPrice,
            status: OrderStatus.PENDING_PAYMENT_INFO,
        });

        return await this.ordersRepository.save(order);
    }
}
