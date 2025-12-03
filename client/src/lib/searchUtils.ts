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

export const getFilterLabel = (filterType: string, value: string): string => {
    const labels: Record<string, Record<string, string>> = {
        category: {
            ring: 'Ring',
            necklace: 'Necklace',
            watch: 'Watch',
            earring: 'Earring',
            anklet: 'Anklet',
            pendant: 'Pendant',
            charm: 'Charm',
        },
        brand: {
            cartier: 'Cartier',
            tiffany: 'Tiffany & Co',
            pandora: 'Pandora',
            gucci: 'Gucci',
            dior: 'Dior',
            local: 'Local Artisan Brands',
        },
        material: {
            gold: 'Gold',
            silver: 'Silver',
            platinum: 'Platinum',
            diamond: 'Diamond',
            gemstone: 'Gemstone',
            leather: 'Leather',
        },
        targetAudience: {
            'for-men': 'For Men',
            'for-women': 'For Women',
            'for-couples': 'For Couples',
            'for-kids': 'For Kids',
            unisex: 'Unisex',
        },
        auctionStatus: {
            'ending-soon': 'Ending Soon',
            'most-bids': 'Most Bids',
            'highest-price': 'Highest Price',
            'newly-listed': 'Newly Listed',
        },
    };

    return labels[filterType]?.[value] || value;
};
