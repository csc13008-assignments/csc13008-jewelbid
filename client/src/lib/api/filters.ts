import { apiClient } from './client';

// Types matching backend FilterOption entity
export interface FilterOption {
    id: string;
    name: string;
    slug: string;
    filterType:
        | 'brand'
        | 'material'
        | 'target_audience'
        | 'auction_status'
        | 'era'
        | 'fineness'
        | 'condition';
    order: number;
    isActive: boolean;
    created_at: string;
    updated_at: string;
}

export interface AllFiltersResponse {
    brands: FilterOption[];
    materials: FilterOption[];
    targetAudiences: FilterOption[];
    auctionStatuses: FilterOption[];
    eras: FilterOption[];
    finenesses: FilterOption[];
    conditions: FilterOption[];
}

export const filtersApi = {
    // GET /filters - Get all filter options grouped
    getAll: async (): Promise<AllFiltersResponse> => {
        const response = await apiClient.get('/filters');
        return response.data;
    },

    // GET /filters/brands - Get all brand options
    getBrands: async (): Promise<FilterOption[]> => {
        const response = await apiClient.get('/filters/brands');
        return response.data;
    },

    // GET /filters/materials - Get all material options
    getMaterials: async (): Promise<FilterOption[]> => {
        const response = await apiClient.get('/filters/materials');
        return response.data;
    },

    // GET /filters/target-audiences - Get all target audience options
    getTargetAudiences: async (): Promise<FilterOption[]> => {
        const response = await apiClient.get('/filters/target-audiences');
        return response.data;
    },

    // GET /filters/auction-statuses - Get all auction status options
    getAuctionStatuses: async (): Promise<FilterOption[]> => {
        const response = await apiClient.get('/filters/auction-statuses');
        return response.data;
    },

    // GET /filters/eras - Get all era options
    getEras: async (): Promise<FilterOption[]> => {
        const response = await apiClient.get('/filters/eras');
        return response.data;
    },

    // GET /filters/finenesses - Get all fineness options
    getFinenesses: async (): Promise<FilterOption[]> => {
        const response = await apiClient.get('/filters/finenesses');
        return response.data;
    },

    // GET /filters/conditions - Get all condition options
    getConditions: async (): Promise<FilterOption[]> => {
        const response = await apiClient.get('/filters/conditions');
        return response.data;
    },
};
