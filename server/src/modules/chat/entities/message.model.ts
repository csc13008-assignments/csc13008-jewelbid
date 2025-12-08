import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';
import { User } from '../../users/entities/user.model';
import { Order } from '../../orders/entities/order.model';

@Entity('messages')
export class Message extends BaseEntity {
    @ApiProperty({
        description: 'Order ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    orderId: string;

    @ManyToOne(() => Order, { eager: false })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @ApiProperty({
        description: 'Sender ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    senderId: string;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ApiProperty({
        description: 'Message content',
        example: 'When can you ship the product?',
    })
    @Column({
        type: 'text',
        nullable: false,
    })
    content: string;

    @ApiProperty({
        description: 'Is message read',
        example: false,
    })
    @Column({
        type: 'boolean',
        default: false,
    })
    isRead: boolean;
}
