import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums/roles.enum';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('accounts')
export class User extends BaseEntity {
    // Basic info
    @ApiProperty({
        description: 'Full name of the user',
        example: 'John Doe',
    })
    @Column({
        type: 'varchar',
        nullable: false,
    })
    fullname: string;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'john.doe@example.com',
    })
    @Column({
        type: 'varchar',
        unique: true,
        nullable: false,
    })
    email: string;

    @ApiProperty({
        description: 'Hashed password of the user',
        example: '$2b$10$...',
    })
    @Column({
        type: 'varchar',
        nullable: false,
    })
    password: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: '+1234567890',
    })
    @Column({
        type: 'varchar',
        unique: true,
        nullable: false,
    })
    phone: string;

    @ApiProperty({
        description: 'Address of the user',
        example: '123 Main St, City, Country',
    })
    @Column({
        type: 'varchar',
        nullable: false,
    })
    address: string;

    @ApiProperty({
        description: 'Birth date of the user',
        example: '1990-01-01',
    })
    @Column({
        type: 'date',
        nullable: false,
    })
    birthdate: Date;

    @ApiProperty({
        description: 'One-time password for authentication',
        example: '123456',
        required: false,
    })
    @Column({
        type: 'varchar',
        nullable: true,
    })
    otp?: string;

    @ApiProperty({
        description: 'OTP expiry timestamp',
        example: '2024-01-01T00:05:00.000Z',
        required: false,
    })
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    otpExpiry?: Date;

    @ApiProperty({
        description: 'Email verification status',
        example: false,
        default: false,
    })
    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    isEmailVerified: boolean;

    @ApiProperty({
        description: 'User role in the system',
        enum: Role,
        example: Role.GUEST,
    })
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.GUEST,
    })
    role: Role;

    // For employee
    @ApiProperty({
        description: 'Employee salary (for employee role)',
        example: 50000,
        default: 0,
    })
    @Column({
        type: 'int',
        nullable: false,
        default: 0,
    })
    salary: number;

    @ApiProperty({
        description: 'Work start time (for employee role)',
        example: '09:00:00',
        required: false,
    })
    @Column({
        type: 'time',
        nullable: true,
    })
    workStart?: string;

    @ApiProperty({
        description: 'Work end time (for employee role)',
        example: '17:00:00',
        required: false,
    })
    @Column({
        type: 'time',
        nullable: true,
    })
    workEnd?: string;

    // For customer
    @ApiProperty({
        description: 'Customer loyalty points',
        example: 1500,
        default: 0,
    })
    @Column({
        type: 'int',
        nullable: false,
        default: 0,
    })
    loyaltyPoints: number;

    @ApiProperty({
        description: 'Profile image URL',
        example: 'https://example.com/profile.jpg',
        required: false,
    })
    @Column({
        type: 'varchar',
        nullable: true,
        default: process.env.DEFAULT_PROFILE_IMAGE || null,
    })
    profileImage?: string;
}
