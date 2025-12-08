import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { Message } from './entities/message.model';
import { AccessControlModule } from '../ac/ac.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        AccessControlModule,
        OrdersModule,
    ],
    controllers: [ChatController],
    providers: [ChatService, ChatRepository],
    exports: [ChatService, ChatRepository],
})
export class ChatModule {}
