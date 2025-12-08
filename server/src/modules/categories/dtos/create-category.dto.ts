import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsUUID,
    IsInt,
    IsBoolean,
} from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Category name',
        example: 'Electronics',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Category description',
        example: 'Electronic devices and gadgets',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Category slug',
        example: 'electronics',
    })
    @IsString()
    slug: string;

    @ApiProperty({
        description: 'Parent category ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    parentId?: string;

    @ApiProperty({
        description: 'Display order',
        example: 1,
        required: false,
    })
    @IsInt()
    @IsOptional()
    order?: number;

    @ApiProperty({
        description: 'Is category active',
        example: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
