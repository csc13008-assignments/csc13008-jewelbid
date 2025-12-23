import { create } from 'zustand';
import {
    filtersApi,
    FilterOption,
    AllFiltersResponse,
} from '../lib/api/filters';
import { useCategoriesStore } from './categoriesStore';

interface FilterOptionForUI {
    label: string;
    value: string;
}

interface FiltersState {
    // Raw filter data from API
    brands: FilterOption[];
    materials: FilterOption[];
    targetAudiences: FilterOption[];
    auctionStatuses: FilterOption[];

    // Transformed filter options for UI
    brandOptions: FilterOptionForUI[];
    materialOptions: FilterOptionForUI[];
    targetAudienceOptions: FilterOptionForUI[];
    auctionStatusOptions: FilterOptionForUI[];

    // Label lookup maps for getFilterLabel
    brandLabels: Record<string, string>;
    materialLabels: Record<string, string>;
    targetAudienceLabels: Record<string, string>;
    auctionStatusLabels: Record<string, string>;

    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;

    // Actions
    fetchAllFilters: () => Promise<void>;
    getFilterLabel: (filterType: string, slug: string) => string;
}

// Transform FilterOption to UI format
const toFilterOptionUI = (opt: FilterOption): FilterOptionForUI => ({
    label: opt.name,
    value: opt.slug,
});

// Create label lookup map
const toLabelMap = (options: FilterOption[]): Record<string, string> => {
    return options.reduce(
        (acc, opt) => {
            acc[opt.slug] = opt.name;
            return acc;
        },
        {} as Record<string, string>,
    );
};

export const useFiltersStore = create<FiltersState>((set, get) => ({
    brands: [],
    materials: [],
    targetAudiences: [],
    auctionStatuses: [],
    brandOptions: [],
    materialOptions: [],
    targetAudienceOptions: [],
    auctionStatusOptions: [],
    brandLabels: {},
    materialLabels: {},
    targetAudienceLabels: {},
    auctionStatusLabels: {},
    isLoading: false,
    error: null,
    isInitialized: false,

    fetchAllFilters: async () => {
        // Skip if already initialized
        if (get().isInitialized) return;

        set({ isLoading: true, error: null });
        try {
            const data: AllFiltersResponse = await filtersApi.getAll();

            set({
                brands: data.brands,
                materials: data.materials,
                targetAudiences: data.targetAudiences,
                auctionStatuses: data.auctionStatuses,
                brandOptions: data.brands.map(toFilterOptionUI),
                materialOptions: data.materials.map(toFilterOptionUI),
                targetAudienceOptions:
                    data.targetAudiences.map(toFilterOptionUI),
                auctionStatusOptions:
                    data.auctionStatuses.map(toFilterOptionUI),
                brandLabels: toLabelMap(data.brands),
                materialLabels: toLabelMap(data.materials),
                targetAudienceLabels: toLabelMap(data.targetAudiences),
                auctionStatusLabels: toLabelMap(data.auctionStatuses),
                isLoading: false,
                isInitialized: true,
            });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to fetch filters';
            set({ error: message, isLoading: false });
        }
    },

    getFilterLabel: (filterType: string, slug: string) => {
        const state = get();

        switch (filterType) {
            case 'category': {
                // Use categoriesStore for category labels
                const category = useCategoriesStore
                    .getState()
                    .getCategoryBySlug(slug);
                // Capitalize fallback to avoid hydration mismatch
                return (
                    category?.name ||
                    (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : slug)
                );
            }
            case 'brand':
                return state.brandLabels[slug] || slug;
            case 'material':
                return state.materialLabels[slug] || slug;
            case 'targetAudience':
                return state.targetAudienceLabels[slug] || slug;
            case 'auctionStatus':
                return state.auctionStatusLabels[slug] || slug;
            default:
                return slug;
        }
    },
}));
