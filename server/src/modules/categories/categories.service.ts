import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './entities/category.model';

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        // Check if slug already exists
        const existing = await this.categoriesRepository.findBySlug(
            createCategoryDto.slug,
        );
        if (existing) {
            throw new ConflictException(
                `Category with slug '${createCategoryDto.slug}' already exists`,
            );
        }

        // If parentId is provided, validate it exists
        if (createCategoryDto.parentId) {
            const parent = await this.categoriesRepository.findOne({
                where: { id: createCategoryDto.parentId },
            });
            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }

            // Check if parent is already a child (enforce 2-level max)
            if (parent.parentId) {
                throw new BadRequestException(
                    'Cannot create category: Maximum 2 levels allowed. Parent category is already a child category.',
                );
            }
        }

        const category = this.categoriesRepository.create(createCategoryDto);
        return await this.categoriesRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return await this.categoriesRepository.findAllActive();
    }

    async findTree(): Promise<Category[]> {
        return await this.categoriesRepository.findCategoryTree();
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async findBySlug(slug: string): Promise<Category> {
        const category = await this.categoriesRepository.findBySlug(slug);

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async update(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        const category = await this.findOne(id);

        // If updating slug, check it doesn't conflict
        if (
            updateCategoryDto.slug &&
            updateCategoryDto.slug !== category.slug
        ) {
            const existing = await this.categoriesRepository.findBySlug(
                updateCategoryDto.slug,
            );
            if (existing) {
                throw new ConflictException(
                    `Category with slug '${updateCategoryDto.slug}' already exists`,
                );
            }
        }

        // If updating parentId, validate
        if (updateCategoryDto.parentId !== undefined) {
            if (updateCategoryDto.parentId === id) {
                throw new BadRequestException(
                    'Category cannot be its own parent',
                );
            }

            if (updateCategoryDto.parentId) {
                const parent = await this.categoriesRepository.findOne({
                    where: { id: updateCategoryDto.parentId },
                });
                if (!parent) {
                    throw new NotFoundException('Parent category not found');
                }

                // Check if parent is already a child (enforce 2-level max)
                if (parent.parentId) {
                    throw new BadRequestException(
                        'Cannot update category: Maximum 2 levels allowed. Parent category is already a child category.',
                    );
                }

                // Check if this category has children (can't become a child if it has children)
                const childrenCount =
                    await this.categoriesRepository.countByParentId(id);
                if (childrenCount > 0) {
                    throw new BadRequestException(
                        'Cannot update category: Category has children and cannot become a child category itself.',
                    );
                }
            }
        }

        Object.assign(category, updateCategoryDto);
        return await this.categoriesRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.categoriesRepository.findWithChildren(id);

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // Check if category has children
        if (category.children && category.children.length > 0) {
            throw new BadRequestException(
                'Cannot delete category with children. Delete child categories first.',
            );
        }

        // Check if category has products
        const productCount =
            await this.categoriesRepository.countProductsByCategoryId(id);
        if (productCount > 0) {
            throw new BadRequestException(
                `Cannot delete category. ${productCount} product(s) are using this category. Delete all products in this category first.`,
            );
        }

        await this.categoriesRepository.remove(category);
    }

    async getTopLevelCategories(): Promise<Category[]> {
        return await this.categoriesRepository.findTopLevelCategories();
    }
}
