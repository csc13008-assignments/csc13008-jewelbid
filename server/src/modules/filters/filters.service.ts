import { Injectable } from '@nestjs/common';
import { FiltersRepository } from './filters.repository';
import { FilterType } from './entities/filter-option.model';
import { sanitizeFilters } from '../../common/utils/sanitize.util';

export interface SanitizedFilter {
    name: string;
    slug: string;
}

export interface AllFiltersResponse {
    brands: SanitizedFilter[];
    materials: SanitizedFilter[];
    targetAudiences: SanitizedFilter[];
    auctionStatuses: SanitizedFilter[];
    eras: SanitizedFilter[];
    finenesses: SanitizedFilter[];
    conditions: SanitizedFilter[];
}

@Injectable()
export class FiltersService {
    constructor(private readonly filtersRepository: FiltersRepository) {}

    async getBrands(): Promise<SanitizedFilter[]> {
        const filters = await this.filtersRepository.findByType(
            FilterType.BRAND,
        );
        return sanitizeFilters(filters) as SanitizedFilter[];
    }

    async getMaterials(): Promise<SanitizedFilter[]> {
        const filters = await this.filtersRepository.findByType(
            FilterType.MATERIAL,
        );
        return sanitizeFilters(filters) as SanitizedFilter[];
    }

    async getTargetAudiences(): Promise<SanitizedFilter[]> {
        const filters = await this.filtersRepository.findByType(
            FilterType.TARGET_AUDIENCE,
        );
        return sanitizeFilters(filters) as SanitizedFilter[];
    }

    async getAuctionStatuses(): Promise<SanitizedFilter[]> {
        const filters = await this.filtersRepository.findByType(
            FilterType.AUCTION_STATUS,
        );
        return sanitizeFilters(filters) as SanitizedFilter[];
    }

    async getEras(): Promise<SanitizedFilter[]> {
        const filters = await this.filtersRepository.findByType(FilterType.ERA);
        return sanitizeFilters(filters) as SanitizedFilter[];
    }

    async getFineness(): Promise<SanitizedFilter[]> {
        const filters = await this.filtersRepository.findByType(
            FilterType.FINENESS,
        );
        return sanitizeFilters(filters) as SanitizedFilter[];
    }

    async getConditions(): Promise<SanitizedFilter[]> {
        const filters = await this.filtersRepository.findByType(
            FilterType.CONDITION,
        );
        return sanitizeFilters(filters) as SanitizedFilter[];
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
