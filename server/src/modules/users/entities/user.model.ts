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
        example: Role.BIDDER,
    })
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.BIDDER,
    })
    role: Role;

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
