import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
    FiltersService,
    AllFiltersResponse,
    SanitizedFilter,
} from './filters.service';

@ApiTags('Filters')
@Controller('filters')
export class FiltersController {
    constructor(private readonly filtersService: FiltersService) {}

    @ApiOperation({ summary: 'Get all filter options grouped by type' })
    @Get()
    @ApiResponse({
        status: 200,
        description: 'All filter options fetched successfully',
    })
    async getAllFilters(): Promise<AllFiltersResponse> {
        return this.filtersService.getAllFilters();
    }

    @ApiOperation({ summary: 'Get all brand options' })
    @Get('brands')
    @ApiResponse({
        status: 200,
        description: 'Brand options fetched successfully',
    })
    async getBrands(): Promise<SanitizedFilter[]> {
        return this.filtersService.getBrands();
    }

    @ApiOperation({ summary: 'Get all material options' })
    @Get('materials')
    @ApiResponse({
        status: 200,
        description: 'Material options fetched successfully',
    })
    async getMaterials(): Promise<SanitizedFilter[]> {
        return this.filtersService.getMaterials();
    }

    @ApiOperation({ summary: 'Get all target audience options' })
    @Get('target-audiences')
    @ApiResponse({
        status: 200,
        description: 'Target audience options fetched successfully',
    })
    async getTargetAudiences(): Promise<SanitizedFilter[]> {
        return this.filtersService.getTargetAudiences();
    }

    @ApiOperation({ summary: 'Get all auction status options' })
    @Get('auction-statuses')
    @ApiResponse({
        status: 200,
        description: 'Auction status options fetched successfully',
    })
    async getAuctionStatuses(): Promise<SanitizedFilter[]> {
        return this.filtersService.getAuctionStatuses();
    }

    @ApiOperation({ summary: 'Get all era options' })
    @Get('eras')
    @ApiResponse({
        status: 200,
        description: 'Era options fetched successfully',
    })
    async getEras(): Promise<SanitizedFilter[]> {
        return this.filtersService.getEras();
    }

    @ApiOperation({ summary: 'Get all fineness options' })
    @Get('finenesses')
    @ApiResponse({
        status: 200,
        description: 'Fineness options fetched successfully',
    })
    async getFineness(): Promise<SanitizedFilter[]> {
        return this.filtersService.getFineness();
    }

    @ApiOperation({ summary: 'Get all condition options' })
    @Get('conditions')
    @ApiResponse({
        status: 200,
        description: 'Condition options fetched successfully',
    })
    async getConditions(): Promise<SanitizedFilter[]> {
        return this.filtersService.getConditions();
    }
}
