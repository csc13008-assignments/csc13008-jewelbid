import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FilterOption, FilterType } from './entities/filter-option.model';

@Injectable()
export class FiltersRepository extends Repository<FilterOption> {
    constructor(private dataSource: DataSource) {
        super(FilterOption, dataSource.createEntityManager());
    }

    async findByType(filterType: FilterType): Promise<FilterOption[]> {
        return this.find({
            where: { filterType, isActive: true },
            order: { order: 'ASC', name: 'ASC' },
        });
    }

    async findAllActive(): Promise<FilterOption[]> {
        return this.find({
            where: { isActive: true },
            order: { filterType: 'ASC', order: 'ASC', name: 'ASC' },
        });
    }

    async findBySlug(
        slug: string,
        filterType: FilterType,
    ): Promise<FilterOption | null> {
        return this.findOne({
            where: { slug, filterType },
        });
    }

    async findByName(
        name: string,
        filterType: FilterType,
    ): Promise<FilterOption | null> {
        return this.findOne({
            where: { name, filterType, isActive: true },
        });
    }
}
