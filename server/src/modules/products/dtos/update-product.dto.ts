import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({
        description: 'Additional description to append',
        example: 'Updated information about the product',
    })
    @IsString()
    additionalDescription: string;
}

export class UpdateProductStatusDto {
    @ApiProperty({
        description: 'Product status',
        example: 'Completed',
    })
    @IsString()
    status: string;
}
