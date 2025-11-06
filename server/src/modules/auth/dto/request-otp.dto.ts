import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestOtpDto {
    @ApiProperty({
        description: 'Phone number to receive the OTP',
        example: '0123456789',
    })
    @IsString()
    phone: string;
}
