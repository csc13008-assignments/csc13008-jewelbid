import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';
import { User } from '../../users/entities/user.model';
import { Product } from './product.model';

@Entity('questions')
export class Question extends BaseEntity {
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
        description: 'Asker ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    askerId: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'askerId' })
    asker: User;

    @ApiProperty({
        description: 'Question content',
        example: 'Is this product authentic?',
    })
    @Column({
        type: 'text',
        nullable: false,
    })
    question: string;

    @ApiProperty({
        description: 'Answer content',
        example: 'Yes, this product is 100% authentic.',
        required: false,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    answer?: string;

    @ApiProperty({
        description: 'Answer timestamp',
        required: false,
    })
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    answeredAt?: Date;
}
