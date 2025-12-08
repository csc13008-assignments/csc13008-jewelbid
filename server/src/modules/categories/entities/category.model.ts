import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.model';

@Entity('categories')
export class Category extends BaseEntity {
    @ApiProperty({
        description: 'Category name',
        example: 'Electronics',
    })
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    name: string;

    @ApiProperty({
        description: 'Category description',
        example: 'Electronic devices and gadgets',
        required: false,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string;

    @ApiProperty({
        description: 'Category slug for URLs',
        example: 'electronics',
    })
    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: false,
    })
    slug: string;

    @ApiProperty({
        description: 'Parent category ID for 2-level hierarchy',
        example: '01234567-89ab-cdef-0123-456789abcdef',
        required: false,
    })
    @Column({
        type: 'uuid',
        nullable: true,
    })
    parentId?: string;

    @ManyToOne(() => Category, (category) => category.children, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'parentId' })
    parent?: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children?: Category[];

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
        description: 'Is category active',
        example: true,
    })
    @Column({
        type: 'boolean',
        default: true,
    })
    isActive: boolean;
}
