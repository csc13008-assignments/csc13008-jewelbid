import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    HttpCode,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
    SubmitPaymentInfoDto,
    ConfirmShipmentDto,
    ConfirmDeliveryDto,
    CancelOrderDto,
} from './dtos/order-workflow.dto';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { Order } from './entities/order.model';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiOperation({ summary: 'Get order details by product ID' })
    @ApiBearerAuth('access-token')
    @Get('product/:productId')
    @UseGuards(ATAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Order details fetched successfully',
        type: Order,
    })
    async getOrderByProduct(@Param('productId') productId: string) {
        return await this.ordersService.getOrderByProductId(productId);
    }

    @ApiOperation({ summary: 'Get my orders as buyer [BIDDER/SELLER]' })
    @ApiBearerAuth('access-token')
    @Get('buyer/my-orders')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Buyer orders fetched successfully',
        type: [Order],
    })
    async getMyBuyerOrders(@Request() req: any) {
        return await this.ordersService.getMyBuyerOrders(req.user.id);
    }

    @ApiOperation({ summary: 'Get my orders as seller [SELLER]' })
    @ApiBearerAuth('access-token')
    @Get('seller/my-orders')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Seller orders fetched successfully',
        type: [Order],
    })
    async getMySellerOrders(@Request() req: any) {
        return await this.ordersService.getMySellerOrders(req.user.id);
    }

    @ApiOperation({
        summary:
            'Get pending orders requiring my action as buyer [BIDDER/SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Get('buyer/pending')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Pending buyer orders fetched successfully',
        type: [Order],
    })
    async getPendingBuyerOrders(@Request() req: any) {
        return await this.ordersService.getPendingBuyerOrders(req.user.id);
    }

    @ApiOperation({
        summary: 'Get pending orders requiring my action as seller [SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Get('seller/pending')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @ApiResponse({
        status: 200,
        description: 'Pending seller orders fetched successfully',
        type: [Order],
    })
    async getPendingSellerOrders(@Request() req: any) {
        return await this.ordersService.getPendingSellerOrders(req.user.id);
    }

    @ApiOperation({
        summary:
            'Step 1: Submit payment info and delivery address [BIDDER/SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Post(':productId/submit-payment')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiBody({ type: SubmitPaymentInfoDto })
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Payment info submitted successfully',
        type: Order,
    })
    async submitPaymentInfo(
        @Param('productId') productId: string,
        @Body() dto: SubmitPaymentInfoDto,
        @Request() req: any,
    ) {
        return await this.ordersService.submitPaymentInfo(
            productId,
            req.user.id,
            dto,
        );
    }

    @ApiOperation({
        summary:
            'Step 2: Confirm payment received and provide tracking [SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Post(':productId/confirm-shipment')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @ApiBody({ type: ConfirmShipmentDto })
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Shipment confirmed successfully',
        type: Order,
    })
    async confirmShipment(
        @Param('productId') productId: string,
        @Body() dto: ConfirmShipmentDto,
        @Request() req: any,
    ) {
        return await this.ordersService.confirmShipment(
            productId,
            req.user.id,
            dto,
        );
    }

    @ApiOperation({
        summary: 'Step 3: Confirm delivery received [BIDDER/SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Post(':productId/confirm-delivery')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.BIDDER, Role.SELLER)
    @ApiBody({ type: ConfirmDeliveryDto })
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Delivery confirmed successfully',
        type: Order,
    })
    async confirmDelivery(
        @Param('productId') productId: string,
        @Body() dto: ConfirmDeliveryDto,
        @Request() req: any,
    ) {
        return await this.ordersService.confirmDelivery(
            productId,
            req.user.id,
            dto,
        );
    }

    @ApiOperation({
        summary: 'Cancel order and auto-rate buyer negatively [SELLER]',
    })
    @ApiBearerAuth('access-token')
    @Post(':productId/cancel')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @ApiBody({ type: CancelOrderDto })
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Order cancelled successfully',
        type: Order,
    })
    async cancelOrder(
        @Param('productId') productId: string,
        @Body() dto: CancelOrderDto,
        @Request() req: any,
    ) {
        return await this.ordersService.cancelOrder(
            productId,
            req.user.id,
            dto,
        );
    }
}
