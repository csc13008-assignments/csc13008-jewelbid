import { Injectable } from '@nestjs/common';
import { FiltersRepository } from './filters.repository';
import { FilterOption, FilterType } from './entities/filter-option.model';

export interface AllFiltersResponse {
    brands: FilterOption[];
    materials: FilterOption[];
    targetAudiences: FilterOption[];
    auctionStatuses: FilterOption[];
    eras: FilterOption[];
    finenesses: FilterOption[];
    conditions: FilterOption[];
}

@Injectable()
export class FiltersService {
    constructor(private readonly filtersRepository: FiltersRepository) {}

    async getBrands(): Promise<FilterOption[]> {
        return this.filtersRepository.findByType(FilterType.BRAND);
    }

    async getMaterials(): Promise<FilterOption[]> {
        return this.filtersRepository.findByType(FilterType.MATERIAL);
    }

    async getTargetAudiences(): Promise<FilterOption[]> {
        return this.filtersRepository.findByType(FilterType.TARGET_AUDIENCE);
    }

    async getAuctionStatuses(): Promise<FilterOption[]> {
        return this.filtersRepository.findByType(FilterType.AUCTION_STATUS);
    }

    async getEras(): Promise<FilterOption[]> {
        return this.filtersRepository.findByType(FilterType.ERA);
    }

    async getFineness(): Promise<FilterOption[]> {
        return this.filtersRepository.findByType(FilterType.FINENESS);
    }

    async getConditions(): Promise<FilterOption[]> {
        return this.filtersRepository.findByType(FilterType.CONDITION);
    }

    async getAllFilters(): Promise<AllFiltersResponse> {
        const [
            brands,
            materials,
            targetAudiences,
            auctionStatuses,
            eras,
            finenesses,
            conditions,
        ] = await Promise.all([
            this.getBrands(),
            this.getMaterials(),
            this.getTargetAudiences(),
            this.getAuctionStatuses(),
            this.getEras(),
            this.getFineness(),
            this.getConditions(),
        ]);

        return {
            brands,
            materials,
            targetAudiences,
            auctionStatuses,
            eras,
            finenesses,
            conditions,
        };
    }
}
