import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.model';
import { AccessControlModule } from '../ac/ac.module';

@Module({
    imports: [TypeOrmModule.forFeature([Order]), AccessControlModule],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository],
    exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
