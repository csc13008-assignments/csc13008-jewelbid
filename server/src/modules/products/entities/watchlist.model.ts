import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';
import { User } from '../../users/entities/user.model';
import { Product } from './product.model';

@Entity('watchlist')
@Unique(['userId', 'productId'])
export class Watchlist extends BaseEntity {
    @ApiProperty({
        description: 'User ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    userId: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: User;

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
}
