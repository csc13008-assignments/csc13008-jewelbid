import { Injectable } from '@nestjs/common';
import { DataSource, Repository, IsNull } from 'typeorm';
import { Category } from './entities/category.model';

@Injectable()
export class CategoriesRepository extends Repository<Category> {
    constructor(private dataSource: DataSource) {
        super(Category, dataSource.createEntityManager());
    }

    async findAllActive(): Promise<Category[]> {
        return this.find({
            where: { isActive: true },
            order: { order: 'ASC', name: 'ASC' },
        });
    }

    async findTopLevelCategories(): Promise<Category[]> {
        return this.find({
            where: { parentId: IsNull(), isActive: true },
            relations: ['children'],
            order: { order: 'ASC', name: 'ASC' },
        });
    }

    async findCategoryTree(): Promise<Category[]> {
        const categories = await this.createQueryBuilder('category')
            .leftJoinAndSelect('category.children', 'children')
            .where('category.parentId IS NULL')
            .andWhere('category.isActive = :isActive', { isActive: true })
            .orderBy('category.order', 'ASC')
            .addOrderBy('category.name', 'ASC')
            .addOrderBy('children.order', 'ASC')
            .addOrderBy('children.name', 'ASC')
            .getMany();

        return categories;
    }

    async findBySlug(slug: string): Promise<Category | null> {
        return this.findOne({
            where: { slug },
            relations: ['parent', 'children'],
        });
    }

    async findWithChildren(id: string): Promise<Category | null> {
        return this.findOne({
            where: { id },
            relations: ['children'],
        });
    }

    async hasProducts(): Promise<boolean> {
        // Will be implemented when we migrate products to use categories
        // For now, return false to allow deletion
        return false;
    }

    async countByParentId(parentId: string | null): Promise<number> {
        return this.count({
            where: { parentId: parentId || IsNull() },
        });
    }
}
