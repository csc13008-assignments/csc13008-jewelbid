import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddToWatchlistDto {
    @ApiProperty({
        description: 'Product ID to add to watchlist',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @IsUUID()
    productId: string;
}
