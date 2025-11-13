import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { RatingType } from '../entities/rating.model';

export class CreateRatingDto {
    @ApiProperty({
        description: 'Product ID',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @IsUUID()
    productId: string;

    @ApiProperty({
        description: 'User to rate',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @IsUUID()
    toUserId: string;

    @ApiProperty({
        description: 'Type of rating',
        enum: RatingType,
        example: RatingType.POSITIVE,
    })
    @IsEnum(RatingType)
    ratingType: RatingType;

    @ApiProperty({
        description: 'Comment for the rating',
        example: 'Excellent transaction, highly recommended!',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    comment?: string;
}

export class UpdateRatingDto {
    @ApiProperty({
        description: 'Type of rating',
        enum: RatingType,
        example: RatingType.POSITIVE,
        required: false,
    })
    @IsOptional()
    @IsEnum(RatingType)
    ratingType?: RatingType;

    @ApiProperty({
        description: 'Comment for the rating',
        example: 'Updated comment',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    comment?: string;
}

export class RatingResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fromUserId: string;

    @ApiProperty()
    fromUserName: string;

    @ApiProperty()
    toUserId: string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    productName: string;

    @ApiProperty({ enum: RatingType })
    ratingType: RatingType;

    @ApiProperty()
    comment: string;

    @ApiProperty()
    createdAt: Date;
}
