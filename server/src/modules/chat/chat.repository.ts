import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Message } from './entities/message.model';

@Injectable()
export class ChatRepository extends Repository<Message> {
    constructor(private dataSource: DataSource) {
        super(Message, dataSource.createEntityManager());
    }

    async findMessagesByOrder(orderId: string): Promise<Message[]> {
        return this.find({
            where: { orderId },
            relations: ['sender'],
            order: { created_at: 'ASC' },
        });
    }

    async markMessagesAsRead(orderId: string): Promise<void> {
        await this.update(
            {
                orderId,
                isRead: false,
            },
            { isRead: true },
        );
    }
}
