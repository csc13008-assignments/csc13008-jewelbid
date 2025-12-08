import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class SubmitPaymentInfoDto {
    @ApiProperty({
        description: 'Payment proof image URL',
        example: 'https://example.com/payment-proof.jpg',
    })
    @IsUrl()
    paymentProof: string;

    @ApiProperty({
        description: 'Delivery address',
        example: '123 Main St, District 1, Ho Chi Minh City',
    })
    @IsString()
    deliveryAddress: string;

    @ApiProperty({
        description: 'Buyer notes',
        example: 'Please deliver between 9AM-5PM',
        required: false,
    })
    @IsString()
    @IsOptional()
    buyerNotes?: string;
}

export class ConfirmShipmentDto {
    @ApiProperty({
        description: 'Shipping tracking number',
        example: 'VN123456789',
    })
    @IsString()
    trackingNumber: string;

    @ApiProperty({
        description: 'Seller notes',
        example: 'Package shipped via VN Post',
        required: false,
    })
    @IsString()
    @IsOptional()
    sellerNotes?: string;
}

export class ConfirmDeliveryDto {
    @ApiProperty({
        description: 'Buyer confirmation notes',
        example: 'Package received in good condition',
        required: false,
    })
    @IsString()
    @IsOptional()
    buyerNotes?: string;
}

export class CancelOrderDto {
    @ApiProperty({
        description: 'Cancellation reason',
        example: 'Buyer did not pay within 24 hours',
    })
    @IsString()
    reason: string;
}
