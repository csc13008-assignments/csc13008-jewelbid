import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsOptional,
    IsDateString,
    IsBoolean,
    IsArray,
    MinLength,
    Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product name',
        example: 'Cartier Love Bracelet 18K White Gold with Diamonds',
    })
    @IsString()
    @MinLength(5)
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Authentic Cartier Love bracelet crafted in 18K white gold...',
    })
    @IsString()
    @MinLength(5)
    description: string;

    @ApiProperty({
        description: 'Category ID',
        example: 'c0000001-0000-0000-0000-000000000001',
    })
    @IsString()
    categoryId: string;

    @ApiProperty({
        description: 'Product brand',
        example: 'Cartier',
        required: false,
    })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiProperty({
        description: 'Product material',
        example: 'Gold',
        required: false,
    })
    @IsOptional()
    @IsString()
    material?: string;

    @ApiProperty({
        description: 'Target audience/gender',
        example: 'Women',
        required: false,
    })
    @IsOptional()
    @IsString()
    targetAudience?: string;

    @ApiProperty({
        description: 'Product era/period',
        example: 'Art Deco',
        required: false,
    })
    @IsOptional()
    @IsString()
    era?: string;

    @ApiProperty({
        description: 'Metal fineness/purity',
        example: '18K',
        required: false,
    })
    @IsOptional()
    @IsString()
    fineness?: string;

    @ApiProperty({
        description: 'Product condition',
        example: 'Like New',
        required: false,
    })
    @IsOptional()
    @IsString()
    condition?: string;

    @ApiProperty({
        description: 'Total weight',
        example: '15.5g',
        required: false,
    })
    @IsOptional()
    @IsString()
    totalWeight?: string;

    @ApiProperty({
        description: 'Size specifications',
        example: 'Ring size 7',
        required: false,
    })
    @IsOptional()
    @IsString()
    size?: string;

    @ApiProperty({
        description: 'Main stone carat weight',
        example: '2.5ct',
        required: false,
    })
    @IsOptional()
    @IsString()
    mainStoneCaratWeight?: string;

    @ApiProperty({
        description: 'Surrounding stones carat weight',
        example: '0.75ct',
        required: false,
    })
    @IsOptional()
    @IsString()
    surroundingStonesCaratWeight?: string;

    @ApiProperty({
        description: 'Product origin/country',
        example: 'Vietnam',
        required: false,
    })
    @IsOptional()
    @IsString()
    origin?: string;

    @ApiProperty({
        description: 'Starting price',
        example: 5000000,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    startingPrice: number;

    @ApiProperty({
        description: 'Step price for bidding',
        example: 100000,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stepPrice: number;

    @ApiProperty({
        description: 'Buy now price',
        example: 10000000,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    buyNowPrice?: number;

    @ApiProperty({
        description: 'Auction end date',
        example: '2025-12-31T23:59:59Z',
    })
    @IsDateString()
    endDate: string;

    @ApiProperty({
        description: 'Auto renewal enabled',
        example: true,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    autoRenewal?: boolean;

    @ApiProperty({
        description: 'Main product image URL',
        example: 'https://example.com/images/product1.jpg',
        required: false,
    })
    @IsOptional()
    @IsString()
    mainImage: string;

    @ApiProperty({
        description: 'Additional product images (at least 3)',
        example: [
            'https://example.com/images/product1-2.jpg',
            'https://example.com/images/product1-3.jpg',
            'https://example.com/images/product1-4.jpg',
        ],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    additionalImages: string[];

    @ApiProperty({
        description: 'Allow bidders with no rating',
        example: true,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    allowNewBidders?: boolean;
}
