import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsUUID,
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'User ID from auth service',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiPropertyOptional({
        description: 'User profile picture URL',
        example: 'https://example.com/avatar.jpg',
        maxLength: 500,
    })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    picture?: string;
}
