import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    IsOptional,
    IsEnum,
    IsBoolean,
    IsPhoneNumber,
    MinLength,
    MaxLength,
    IsObject,
} from 'class-validator';
import {
    UserRole,
    AuthType,
    AuthProvider,
} from '../../../common/enums/auth.enum';

export class RegisterDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password (required for standard auth)',
        example: 'SecurePassword123!',
        minLength: 8,
        maxLength: 128,
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password?: string;

    @ApiProperty({
        description: 'User phone number',
        example: '+1234567890',
        required: false,
    })
    @IsOptional()
    @IsPhoneNumber()
    phone_number?: string;

    @ApiProperty({
        description: 'User role',
        enum: UserRole,
        example: UserRole.USER,
        required: false,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty({
        description: 'Authentication type',
        enum: AuthType,
        example: AuthType.STD_AUTH,
        required: false,
    })
    @IsOptional()
    @IsEnum(AuthType)
    auth_type?: AuthType;

    @ApiProperty({
        description: 'Authentication provider',
        enum: AuthProvider,
        example: AuthProvider.LOCAL,
        required: false,
    })
    @IsOptional()
    @IsEnum(AuthProvider)
    provider?: AuthProvider;

    @ApiProperty({
        description: 'Custom claims and additional data',
        example: { firebase_uid: 'abc123' },
        required: false,
    })
    @IsOptional()
    @IsObject()
    custom_claims?: Record<string, any>;
}

export class LoginDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'SecurePassword123!',
    })
    @IsString()
    password: string;
}

export class FirebaseAuthDto {
    @ApiProperty({
        description: 'Firebase ID token',
        example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...',
    })
    @IsString()
    firebase_token: string;

    @ApiProperty({
        description: 'User role (optional, defaults to USER)',
        enum: UserRole,
        example: UserRole.USER,
        required: false,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty({
        description: 'Additional custom claims',
        example: { subscription_plan: 'premium' },
        required: false,
    })
    @IsOptional()
    @IsObject()
    custom_claims?: Record<string, any>;
}

export class UpdateUserDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        required: false,
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        description: 'User phone number',
        example: '+1234567890',
        required: false,
    })
    @IsOptional()
    @IsPhoneNumber()
    phone_number?: string;

    @ApiProperty({
        description: 'Email verification status',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    email_verified?: boolean;

    @ApiProperty({
        description: 'User role',
        enum: UserRole,
        example: UserRole.USER,
        required: false,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty({
        description: 'Custom claims and additional data',
        example: { subscription_plan: 'premium' },
        required: false,
    })
    @IsOptional()
    @IsObject()
    custom_claims?: Record<string, any>;
}

export class AuthResponseDto {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    access_token: string;

    @ApiProperty({
        description: 'JWT refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        required: false,
    })
    refresh_token?: string;

    @ApiProperty({
        description: 'Token type',
        example: 'Bearer',
    })
    token_type: string;

    @ApiProperty({
        description: 'Token expiration time in seconds',
        example: 86400,
    })
    expires_in: number;

    @ApiProperty({
        description: 'User information',
    })
    user: UserResponseDto;
}

export class UserResponseDto {
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: 'External UID',
        example: '123e4567-e89b-12d3-a456-426614174001',
    })
    external_uid?: string;

    @ApiProperty({
        description: 'User email',
        example: 'user@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'Email verification status',
        example: true,
    })
    email_verified: boolean;

    @ApiProperty({
        description: 'User phone number',
        example: '+1234567890',
    })
    phone_number?: string;

    @ApiProperty({
        description: 'User role',
        enum: UserRole,
        example: UserRole.USER,
    })
    role: UserRole;

    @ApiProperty({
        description: 'Authentication type',
        enum: AuthType,
        example: AuthType.OAUTH,
    })
    auth_type: AuthType;

    @ApiProperty({
        description: 'Authentication provider',
        enum: AuthProvider,
        example: AuthProvider.GOOGLE,
    })
    provider: AuthProvider;

    @ApiProperty({
        description: 'Custom claims',
        example: { firebase_uid: 'abc123' },
    })
    custom_claims?: Record<string, any>;

    @ApiProperty({
        description: 'Last login timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    last_login_at?: Date;

    @ApiProperty({
        description: 'Account creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    created_at: Date;

    @ApiProperty({
        description: 'Account last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    updated_at: Date;
}

export class ChangePasswordDto {
    @ApiProperty({
        description: 'Current password',
        example: 'OldPassword123!',
    })
    @IsString()
    current_password: string;

    @ApiProperty({
        description: 'New password',
        example: 'NewPassword123!',
        minLength: 8,
        maxLength: 128,
    })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    new_password: string;
}

export class ResetPasswordDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;
}

export class ConfirmResetPasswordDto {
    @ApiProperty({
        description: 'Reset token',
        example: 'abc123def456',
    })
    @IsString()
    token: string;

    @ApiProperty({
        description: 'New password',
        example: 'NewPassword123!',
        minLength: 8,
        maxLength: 128,
    })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    new_password: string;
}
