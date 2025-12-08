import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateSettingDto {
    @ApiProperty({
        description: 'Setting key',
        example: 'auto_renewal_trigger_minutes',
    })
    @IsString()
    key: string;

    @ApiProperty({
        description: 'Setting value',
        example: '5',
    })
    @IsString()
    value: string;

    @ApiProperty({
        description: 'Setting description',
        example: 'Minutes before end time to trigger auto-renewal',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Value type',
        example: 'number',
        enum: ['string', 'number', 'boolean'],
    })
    @IsString()
    @IsIn(['string', 'number', 'boolean'])
    valueType: string;
}

export class UpdateSettingDto {
    @ApiProperty({
        description: 'Setting value',
        example: '10',
    })
    @IsString()
    value: string;

    @ApiProperty({
        description: 'Setting description',
        example: 'Updated description',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
}
