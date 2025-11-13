import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.model';
import { Bid } from './entities/bid.model';
import { Watchlist } from './entities/watchlist.model';
import { Question } from './entities/question.model';
import { RejectedBidder } from './entities/rejected-bidder.model';
import { UsersModule } from '../users/users.module';
import { AccessControlService } from '../ac/ac.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Product,
            Bid,
            Watchlist,
            Question,
            RejectedBidder,
        ]),
        ConfigModule,
        UsersModule,
    ],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsRepository, AccessControlService],
    exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
