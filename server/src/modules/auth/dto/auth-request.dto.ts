import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty({
        description: 'Success status',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'Response message',
        example: 'User created successfully',
    })
    message: string;

    @ApiProperty({
        description: 'User data',
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            uid: 'firebase-uid-123',
            email: 'user@example.com',
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
            emailVerified: true,
            role: 'user',
            provider: 'google',
            createdAt: '2024-01-01T00:00:00.000Z',
        },
    })
    data: any;
}

export class TokenValidationResponseDto {
    @ApiProperty({
        description: 'Token validity status',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'Validation message',
        example: 'Token is valid',
    })
    message: string;

    @ApiProperty({
        description: 'Token validation data',
        example: {
            uid: 'firebase-uid-123',
            email: 'user@example.com',
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
            emailVerified: true,
            phoneNumber: '+1234567890',
            provider: 'google.com',
            userExists: true,
            userId: '123e4567-e89b-12d3-a456-426614174000',
            role: 'user',
            issuedAt: '2024-01-01T00:00:00.000Z',
            expiresAt: '2024-01-01T01:00:00.000Z',
        },
        nullable: true,
    })
    data: any;
}

export class SignInResponseDto {
    @ApiProperty({
        description: 'JWT access token (expires in 1 hour)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'JWT refresh token (expires in 7 days)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    refreshToken: string;
}
