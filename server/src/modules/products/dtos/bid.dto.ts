import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PlaceBidDto {
    @ApiProperty({
        description:
            'Maximum bid amount for auto-bidding. System will automatically outbid others up to this amount.',
        example: 7000000,
    })
    @IsNumber()
    @Min(0)
    maxBid: number;
}

export class BidHistoryItemDto {
    @ApiProperty({
        description: 'Bidder ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    bidderId: string;

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
