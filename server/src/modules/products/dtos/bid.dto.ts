import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class PlaceBidDto {
    @ApiProperty({
        description:
            '[DEPRECATED] Bid amount for manual bidding. Use maxBid for auto-bidding instead.',
        example: 6500000,
        required: false,
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    bidAmount?: number;

    @ApiProperty({
        description:
            'Maximum bid amount for auto-bidding. System will automatically outbid others up to this amount.',
        example: 7000000,
        required: false,
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    maxBid?: number;
}

export class BidHistoryItemDto {
    @ApiProperty({
        description: 'Bidder name (masked)',
        example: '****Khoa',
    })
    bidderName: string;

    @ApiProperty({
        description: 'Bid amount',
        example: 6500000,
    })
    bidAmount: number;

    @ApiProperty({
        description: 'Bid timestamp',
        example: '2025-11-13T10:43:00Z',
    })
    bidTime: Date;
}
