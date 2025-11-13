import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PlaceBidDto {
    @ApiProperty({
        description: 'Bid amount',
        example: 6500000,
    })
    @IsNumber()
    @Min(0)
    bidAmount: number;
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
