import {
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { uuidv7 } from 'uuidv7';

export abstract class BaseEntity {
    @ApiProperty({
        description: 'Unique identifier (UUID v7 - time-ordered)',
        example: '01234567-89ab-cdef-0123-456789abcdef',
    })
    @PrimaryColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Record creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    @CreateDateColumn({
        type: 'timestamptz', // Use timestamp with time zone for proper UTC handling
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @ApiProperty({
        description: 'Record last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    @UpdateDateColumn({
        type: 'timestamptz', // Use timestamp with time zone for proper UTC handling
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;

    @ApiProperty({
        description: 'Soft delete timestamp',
        example: '2024-01-01T00:00:00.000Z',
        required: false,
    })
    @DeleteDateColumn({
        type: 'timestamptz', // Use timestamp with time zone for proper UTC handling
        nullable: true,
    })
    deleted_at?: Date;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = uuidv7();
        }
    }
}
