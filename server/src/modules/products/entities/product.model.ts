import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';
import { User } from '../../users/entities/user.model';
import { Category } from '../../categories/entities/category.model';
import { FilterOption } from '../../filters/entities/filter-option.model';

export enum ProductStatus {
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
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
        description: 'Category ID',
        example: 'c0000001-0000-0000-0000-000000000001',
        required: false,
    })
    @Column({
        type: 'uuid',
        nullable: true,
    })
    categoryId?: string;

    @ManyToOne(() => Category, { eager: false, nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category?: Category;

    @ApiProperty({
        description: 'Brand filter option ID',
        example: 'a1b2c3d4-1111-4aaa-8888-111111111111',
        required: false,
    })
    @Column({ type: 'uuid', nullable: true })
    brandId?: string;

    @ManyToOne(() => FilterOption, { eager: false, nullable: true })
    @JoinColumn({ name: 'brandId' })
    brandOption?: FilterOption;

    @ApiProperty({
        description: 'Material filter option ID',
        example: 'b2c3d4e5-2222-4bbb-9999-222222222221',
        required: false,
    })
    @Column({ type: 'uuid', nullable: true })
    materialId?: string;

    @ManyToOne(() => FilterOption, { eager: false, nullable: true })
    @JoinColumn({ name: 'materialId' })
    materialOption?: FilterOption;

    @ApiProperty({
        description: 'Target audience filter option ID',
        example: 'c3d4e5f6-3333-4ccc-aaaa-333333333335',
        required: false,
    })
    @Column({ type: 'uuid', nullable: true })
    targetAudienceId?: string;

    @ManyToOne(() => FilterOption, { eager: false, nullable: true })
    @JoinColumn({ name: 'targetAudienceId' })
    targetAudienceOption?: FilterOption;

    @ApiProperty({
        description: 'Era filter option ID',
        example: 'e5f6a7b8-5555-4eee-cccc-555555555554',
        required: false,
    })
    @Column({ type: 'uuid', nullable: true })
    eraId?: string;

    @ManyToOne(() => FilterOption, { eager: false, nullable: true })
    @JoinColumn({ name: 'eraId' })
    eraOption?: FilterOption;

    @ApiProperty({
        description: 'Fineness filter option ID',
        example: 'f6a7b8c9-6666-4fff-dddd-666666666663',
        required: false,
    })
    @Column({ type: 'uuid', nullable: true })
    finenessId?: string;

    @ManyToOne(() => FilterOption, { eager: false, nullable: true })
    @JoinColumn({ name: 'finenessId' })
    finenessOption?: FilterOption;

    @ApiProperty({
        description: 'Condition filter option ID',
        example: 'a7b8c9d0-7777-4aaa-eeee-777777777771',
        required: false,
    })
    @Column({ type: 'uuid', nullable: true })
    conditionId?: string;

    @ManyToOne(() => FilterOption, { eager: false, nullable: true })
    @JoinColumn({ name: 'conditionId' })
    conditionOption?: FilterOption;

    @ApiProperty({
        description: 'Total weight',
        example: '15.5g',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    totalWeight?: string;

    @ApiProperty({
        description: 'Size specifications',
        example: 'Ring size 7, 18mm width',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    size?: string;

    @ApiProperty({
        description: 'Main stone carat weight',
        example: '2.5ct',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    mainStoneCaratWeight?: string;

    @ApiProperty({
        description: 'Surrounding stones carat weight',
        example: '0.75ct',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    surroundingStonesCaratWeight?: string;

    @ApiProperty({
        description: 'Product origin/country',
        example: 'Vietnam',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    origin?: string;

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
        description: 'Number of users who added this product to watchlist',
        example: 5,
    })
    @Column({
        type: 'int',
        default: 0,
    })
    watchlistCount: number;

    @Column({
        type: 'tsvector',
        nullable: true,
        select: false, // Don't include in normal queries
    })
    search_vector?: string;

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
