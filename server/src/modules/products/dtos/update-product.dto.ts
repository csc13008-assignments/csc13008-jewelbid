import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({
        description: 'Additional description to append',
        example: 'Product has been professionally cleaned and certified.',
    })
    @IsString()
    @MinLength(10)
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
