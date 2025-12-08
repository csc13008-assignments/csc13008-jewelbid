import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { Message } from './entities/message.model';
import { SendMessageDto } from './dtos/send-message.dto';
import { OrdersRepository } from '../orders/orders.repository';

@Injectable()
export class ChatService {
    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly ordersRepository: OrdersRepository,
    ) {}

    async getMessages(orderId: string, userId: string): Promise<Message[]> {
        // Verify user is part of this order
        const order = await this.ordersRepository.findByProductId(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.buyerId !== userId && order.sellerId !== userId) {
            throw new ForbiddenException(
                'You are not authorized to view this conversation',
            );
        }

        return await this.chatRepository.findMessagesByOrder(orderId);
    }

    async sendMessage(userId: string, dto: SendMessageDto): Promise<Message> {
        // Verify user is part of this order
        const order = await this.ordersRepository.findByProductId(dto.orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.buyerId !== userId && order.sellerId !== userId) {
            throw new ForbiddenException(
                'You are not authorized to send messages in this conversation',
            );
        }

        const message = this.chatRepository.create({
            orderId: dto.orderId,
            senderId: userId,
            content: dto.content,
        });

        return await this.chatRepository.save(message);
    }

    async markAsRead(orderId: string, userId: string): Promise<void> {
        // Verify user is part of this order
        const order = await this.ordersRepository.findByProductId(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.buyerId !== userId && order.sellerId !== userId) {
            throw new ForbiddenException(
                'You are not authorized to access this conversation',
            );
        }

        await this.chatRepository.markMessagesAsRead(orderId);
    }
}
