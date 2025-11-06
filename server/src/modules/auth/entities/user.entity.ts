import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../../common/entities/base.entity';
import {
    UserRole,
    AuthType,
    AuthProvider,
} from '../../../common/enums/auth.enum';

@Entity('users')
@Index(['phone_number'], { unique: true })
@Index(['external_uid'], { unique: true })
@Index(['email'], { unique: true })
export class User extends BaseEntity {
    @ApiProperty({
        description: 'External UID from Firebase or other OAuth providers',
        example: 'I60OoGMx1FVaKwdDbFLFZ8SJXUl1',
    })
    @Column({
        type: 'varchar',
        length: 128,
        unique: true,
        nullable: true,
    })
    external_uid?: string;

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: true,
    })
    email?: string;

    @ApiProperty({
        description: 'Email verification status',
        example: true,
    })
    @Column({
        type: 'boolean',
        default: false,
    })
    email_verified: boolean;

    @Column({
        type: 'boolean',
        default: false,
    })
    phone_verified: boolean;

    @ApiProperty({
        description: 'User phone number',
        example: '+1234567890',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 20,
        nullable: true,
        unique: true,
    })
    phone_number?: string;

    @ApiProperty({
        description: 'Hashed password for standard authentication',
        required: false,
    })
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    @Exclude()
    password?: string;

    @ApiProperty({
        description: 'Firebase ID token',
        required: true,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    @Exclude()
    id_token?: string;

    @ApiProperty({
        description: 'Firebase refresh token',
        required: false,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    @Exclude()
    refresh_token?: string;

    @ApiProperty({
        description: 'User role in the system',
        enum: UserRole,
        example: UserRole.USER,
    })
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @ApiProperty({
        description: 'Authentication type used',
        enum: AuthType,
        example: AuthType.OAUTH,
    })
    @Column({
        type: 'enum',
        enum: AuthType,
        default: AuthType.STD_AUTH,
    })
    auth_type: AuthType;

    @ApiProperty({
        description: 'Custom claims and additional user data',
        example: {
            firebase_uid: 'abc123',
            picture: 'https://example.com/photo.jpg',
        },
    })
    @Column({
        type: 'jsonb',
        nullable: true,
    })
    custom_claims?: Record<string, any>;

    @ApiProperty({
        description: 'OAuth provider used for authentication',
        enum: AuthProvider,
        example: AuthProvider.GOOGLE,
    })
    @Column({
        type: 'enum',
        enum: AuthProvider,
        default: AuthProvider.LOCAL,
    })
    provider: AuthProvider;

    @ApiProperty({
        description: 'Last login timestamp',
        example: '2024-01-01T00:00:00.000Z',
        required: false,
    })
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    last_login_at?: Date;

    // Hash password before saving
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && this.auth_type === AuthType.STD_AUTH) {
            const saltRounds = 12;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
    }

    // Helper method to validate password
    async validatePassword(plainTextPassword: string): Promise<boolean> {
        if (!this.password) return false;
        return await bcrypt.compare(plainTextPassword, this.password);
    }

    // Helper method to update last login
    updateLastLogin() {
        this.last_login_at = new Date();
    }

    // Helper method to check if user is OAuth user
    isOAuthUser(): boolean {
        return this.auth_type === AuthType.OAUTH;
    }

    // Helper method to check if user is admin
    isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }

    // Helper method to check if user is business
    isBusiness(): boolean {
        return this.role === UserRole.BUSINESS;
    }

    // Helper method to update tokens
    updateTokens(idToken?: string, refreshToken?: string) {
        if (idToken) {
            this.id_token = idToken;
        }
        if (refreshToken) {
            this.refresh_token = refreshToken;
        }
    }
}
