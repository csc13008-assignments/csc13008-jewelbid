import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';
import { User } from '../../users/entities/user.model';
import { Product } from './product.model';

@Entity('rejected_bidders')
@Unique(['productId', 'bidderId'])
export class RejectedBidder extends BaseEntity {
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
        description: 'Rejected Bidder ID',
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
}
