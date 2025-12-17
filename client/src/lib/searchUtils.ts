import { SearchFilters } from '@/types';

export const buildSearchUrl = (filters: SearchFilters): string => {
    const params = new URLSearchParams();

    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.material) params.set('material', filters.material);
    if (filters.targetAudience) params.set('target', filters.targetAudience);
    if (filters.auctionStatus) params.set('status', filters.auctionStatus);

    const queryString = params.toString();
    return `/search-result${queryString ? `?${queryString}` : ''}`;
};
