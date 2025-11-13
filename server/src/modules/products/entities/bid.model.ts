import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';
import { User } from '../../users/entities/user.model';
import { Product } from './product.model';

@Entity('bids')
export class Bid extends BaseEntity {
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
        description: 'Bidder ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    bidderId: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'bidderId' })
    bidder: User;

    @ApiProperty({
        description: 'Bid amount',
        example: 6500000,
    })
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: false,
    })
    bidAmount: number;

    @ApiProperty({
        description: 'Is this bid rejected by seller',
        example: false,
    })
    @Column({
        type: 'boolean',
        default: false,
    })
    isRejected: boolean;
}
