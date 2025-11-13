import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';
import { User } from './user.model';
import { Product } from '../../products/entities/product.model';

export enum RatingType {
    POSITIVE = 'Positive',
    NEGATIVE = 'Negative',
}

@Entity('ratings')
export class Rating extends BaseEntity {
    @ApiProperty({
        description: 'User who gives the rating',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    fromUserId: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'fromUserId' })
    fromUser: User;

    @ApiProperty({
        description: 'User who receives the rating',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    toUserId: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'toUserId' })
    toUser: User;

    @ApiProperty({
        description: 'Product related to this rating',
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
        description: 'Type of rating',
        enum: RatingType,
        example: RatingType.POSITIVE,
    })
    @Column({
        type: 'enum',
        enum: RatingType,
    })
    ratingType: RatingType;

    @ApiProperty({
        description: 'Comment for the rating',
        example: 'Great seller, fast shipping!',
        required: false,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    comment?: string;
}
