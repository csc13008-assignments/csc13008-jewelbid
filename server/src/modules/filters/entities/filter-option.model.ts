import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';

export enum FilterType {
    BRAND = 'brand',
    MATERIAL = 'material',
    TARGET_AUDIENCE = 'target_audience',
    AUCTION_STATUS = 'auction_status',
}

@Entity('filter_options')
export class FilterOption extends BaseEntity {
    @ApiProperty({
        description: 'Filter option name',
        example: 'Cartier',
    })
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    name: string;

    @ApiProperty({
        description: 'Filter option slug for URLs',
        example: 'cartier',
    })
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    slug: string;

    @ApiProperty({
        description: 'Type of filter',
        enum: FilterType,
        example: FilterType.BRAND,
    })
    @Column({
        type: 'enum',
        enum: FilterType,
        nullable: false,
    })
    filterType: FilterType;

    @ApiProperty({
        description: 'Display order',
        example: 1,
    })
    @Column({
        type: 'int',
        default: 0,
    })
    order: number;

    @ApiProperty({
        description: 'Is filter option active',
        example: true,
    })
    @Column({
        type: 'boolean',
        default: true,
    })
    isActive: boolean;
}
