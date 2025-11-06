import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SignInDto {
    @ApiProperty({
        description: 'Phone number used for sign-in',
        example: '0123456789',
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        description: 'One-Time Password (OTP) for sign-in',
        example: '123456',
    })
    @IsString()
    @IsOptional()
    otp?: string;
}
