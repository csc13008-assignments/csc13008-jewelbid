import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';
import { User } from '../../users/entities/user.model';

export enum ProductStatus {
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

export enum JewelryCategory {
    NECKLACE = 'Necklace',
    RING = 'Ring',
    BRACELET = 'Bracelet',
    EARRING = 'Earring',
    BROOCH = 'Brooch',
    PENDANT = 'Pendant',
    WATCH = 'Watch',
    GEMSTONE = 'Gemstone',
    GOLD_BAR = 'Gold Bar',
    DIAMOND = 'Diamond',
}

@Entity('products')
export class Product extends BaseEntity {
    @ApiProperty({
        description: 'Product name',
        example: 'Cartier Love Bracelet 18K White Gold with Diamonds',
    })
    @Column({
        type: 'varchar',
        nullable: false,
    })
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Authentic Cartier Love bracelet crafted in 18K white gold...',
    })
    @Column({
        type: 'text',
        nullable: false,
    })
    description: string;

    @ApiProperty({
        description: 'Product category',
        enum: JewelryCategory,
        example: JewelryCategory.BRACELET,
    })
    @Column({
        type: 'enum',
        enum: JewelryCategory,
    })
    category: JewelryCategory;

    @ApiProperty({
        description: 'Product brand',
        example: 'Cartier',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    brand?: string;

    @ApiProperty({
        description: 'Product material',
        example: 'Gold',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    material?: string;

    @ApiProperty({
        description: 'Target audience',
        example: 'unisex',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    targetAudience?: string;

    @ApiProperty({
        description: 'Starting price',
        example: 5000000,
    })
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: false,
    })
    startingPrice: number;

    @ApiProperty({
        description: 'Current highest bid price',
        example: 6500000,
    })
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: false,
    })
    currentPrice: number;

    @ApiProperty({
        description: 'Step price for bidding',
        example: 100000,
    })
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: false,
    })
    stepPrice: number;

    @ApiProperty({
        description: 'Buy now price',
        example: 10000000,
        required: false,
    })
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    buyNowPrice?: number;

    @ApiProperty({
        description: 'Auction end date',
        example: '2025-12-31T23:59:59Z',
    })
    @Column({
        type: 'timestamp',
        nullable: false,
    })
    endDate: Date;

    @ApiProperty({
        description: 'Auto renewal enabled',
        example: true,
    })
    @Column({
        type: 'boolean',
        default: false,
    })
    autoRenewal: boolean;

    @ApiProperty({
        description: 'Product status',
        enum: ProductStatus,
        example: ProductStatus.ACTIVE,
    })
    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.ACTIVE,
    })
    status: ProductStatus;

    @ApiProperty({
        description: 'Number of bids',
        example: 12,
    })
    @Column({
        type: 'int',
        default: 0,
    })
    bidCount: number;

    @ApiProperty({
        description: 'Main product image URL',
        example: 'https://example.com/images/product1.jpg',
    })
    @Column({
        type: 'varchar',
        nullable: false,
    })
    mainImage: string;

    @ApiProperty({
        description: 'Additional product images (JSON array)',
        example: [
            'https://example.com/images/product1-2.jpg',
            'https://example.com/images/product1-3.jpg',
        ],
    })
    @Column({
        type: 'json',
        nullable: false,
    })
    additionalImages: string[];

    @ApiProperty({
        description: 'Allow bidders with no rating',
        example: true,
    })
    @Column({
        type: 'boolean',
        default: true,
    })
    allowNewBidders: boolean;

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
        description: 'Current highest bidder ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
        required: false,
    })
    @Column({
        type: 'uuid',
        nullable: true,
    })
    currentBidderId?: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'currentBidderId' })
    currentBidder?: User;
}
