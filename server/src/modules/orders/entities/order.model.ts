import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';
import { User } from '../../users/entities/user.model';
import { Product } from '../../products/entities/product.model';

export enum OrderStatus {
    PENDING_PAYMENT_INFO = 'Pending Payment Info', // Step 1: Waiting for buyer to provide payment
    PENDING_SHIPMENT = 'Pending Shipment', // Step 2: Waiting for seller to confirm payment & ship
    PENDING_DELIVERY_CONFIRMATION = 'Pending Delivery Confirmation', // Step 3: Waiting for buyer to confirm delivery
    COMPLETED = 'Completed', // Step 4: Both parties can rate
    CANCELLED = 'Cancelled', // Seller cancelled the transaction
}

@Entity('orders')
export class Order extends BaseEntity {
    @ApiProperty({
        description: 'Product ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    productId: string;

    @ManyToOne(() => Product, { eager: false })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @ApiProperty({
        description: 'Seller ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    sellerId: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'sellerId' })
    seller: User;

    @ApiProperty({
        description: 'Buyer ID (winner of auction)',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    buyerId: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'buyerId' })
    buyer: User;

    @ApiProperty({
        description: 'Final auction price',
        example: 10000000,
    })
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: false,
    })
    finalPrice: number;

    @ApiProperty({
        description: 'Order status',
        enum: OrderStatus,
        example: OrderStatus.PENDING_PAYMENT_INFO,
    })
    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING_PAYMENT_INFO,
    })
    status: OrderStatus;

    @ApiProperty({
        description: 'Buyer payment proof/invoice',
        example: 'https://example.com/payment-proof.jpg',
        required: false,
    })
    @Column({
        type: 'varchar',
        nullable: true,
    })
    paymentProof?: string;

    @ApiProperty({
        description: 'Delivery address',
        example: '123 Main St, District 1, Ho Chi Minh City',
        required: false,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    deliveryAddress?: string;

    @ApiProperty({
        description: 'Shipping tracking number',
        example: 'VN123456789',
        required: false,
    })
    @Column({
        type: 'varchar',
        nullable: true,
    })
    trackingNumber?: string;

    @ApiProperty({
        description: 'Seller notes',
        example: 'Package shipped via VN Post',
        required: false,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    sellerNotes?: string;

    @ApiProperty({
        description: 'Buyer notes',
        example: 'Package received in good condition',
        required: false,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    buyerNotes?: string;

    @ApiProperty({
        description: 'Cancellation reason',
        example: 'Buyer did not pay within 24 hours',
        required: false,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    cancellationReason?: string;

    @ApiProperty({
        description: 'When payment info was submitted',
        required: false,
    })
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    paymentInfoSubmittedAt?: Date;

    @ApiProperty({
        description: 'When shipment was confirmed',
        required: false,
    })
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    shipmentConfirmedAt?: Date;

    @ApiProperty({
        description: 'When delivery was confirmed',
        required: false,
    })
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    deliveryConfirmedAt?: Date;

    @ApiProperty({
        description: 'When order was completed',
        required: false,
    })
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    completedAt?: Date;

    @ApiProperty({
        description: 'When order was cancelled',
        required: false,
    })
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    cancelledAt?: Date;
}
