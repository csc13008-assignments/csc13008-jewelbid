import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';

@Entity('system_settings')
export class SystemSettings extends BaseEntity {
    @ApiProperty({
        description: 'Setting key',
        example: 'auto_renewal_trigger_minutes',
    })
    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: false,
    })
    key: string;

    @ApiProperty({
        description: 'Setting value',
        example: '5',
    })
    @Column({
        type: 'varchar',
        length: 500,
        nullable: false,
    })
    value: string;

    @ApiProperty({
        description: 'Setting description',
        example: 'Minutes before end time to trigger auto-renewal',
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string;

    @ApiProperty({
        description: 'Value type for validation',
        example: 'number',
    })
    @Column({
        type: 'varchar',
        length: 50,
        default: 'string',
    })
    valueType: string; // 'string', 'number', 'boolean'
}
