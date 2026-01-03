import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.model';

@Injectable()
export class OrdersRepository extends Repository<Order> {
    constructor(private dataSource: DataSource) {
        super(Order, dataSource.createEntityManager());
    }

    async findById(orderId: string): Promise<Order | null> {
        return this.findOne({
            where: { id: orderId },
            relations: ['product', 'seller', 'buyer'],
        });
    }

    async findByProductId(productId: string): Promise<Order | null> {
        return this.findOne({
            where: { productId },
            relations: ['product', 'seller', 'buyer'],
        });
    }

    async findByBuyerId(buyerId: string): Promise<Order[]> {
        return this.find({
            where: { buyerId },
            relations: ['product', 'seller'],
            order: { created_at: 'DESC' },
        });
    }

    async findBySellerId(sellerId: string): Promise<Order[]> {
        return this.find({
            where: { sellerId },
            relations: ['product', 'buyer'],
            order: { created_at: 'DESC' },
        });
    }

    async findByStatus(status: OrderStatus): Promise<Order[]> {
        return this.find({
            where: { status },
            relations: ['product', 'seller', 'buyer'],
            order: { created_at: 'DESC' },
        });
    }

    async findPendingOrdersForBuyer(buyerId: string): Promise<Order[]> {
        return this.find({
            where: [
                { buyerId, status: OrderStatus.PENDING_PAYMENT_INFO },
                { buyerId, status: OrderStatus.PENDING_DELIVERY_CONFIRMATION },
            ],
            relations: ['product', 'seller'],
            order: { created_at: 'DESC' },
        });
    }

    async findPendingOrdersForSeller(sellerId: string): Promise<Order[]> {
        return this.find({
            where: { sellerId, status: OrderStatus.PENDING_SHIPMENT },
            relations: ['product', 'buyer'],
            order: { created_at: 'DESC' },
        });
    }
}
