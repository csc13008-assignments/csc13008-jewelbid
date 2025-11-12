import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    IsDateString,
    IsOptional,
} from 'class-validator';

export class UserSignUpDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Full name cannot be empty' })
    @IsString()
    fullname: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Phone cannot be empty' })
    @IsPhoneNumber('VN', { message: 'Invalid phone number' })
    phone: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address cannot be empty' })
    @IsString()
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Birth date cannot be empty' })
    @IsDateString({}, { message: 'Invalid birth date format' })
    birthdate: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    recaptchaToken?: string;
}
