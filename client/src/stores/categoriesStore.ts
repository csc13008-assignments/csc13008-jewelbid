import { create } from 'zustand';
import { categoriesApi, Category } from '../lib/api/categories';

interface FilterOption {
    label: string;
    value: string;
}

interface CategoriesState {
    // Categories data
    categories: Category[];
    categoryTree: Category[];
    topLevelCategories: Category[];

    // Filter options for UI
    categoryFilterOptions: FilterOption[];

    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCategories: () => Promise<void>;
    fetchCategoryTree: () => Promise<void>;
    fetchTopLevelCategories: () => Promise<void>;
    getCategoryBySlug: (slug: string) => Category | undefined;
}

// Map Category to FilterOption format
const mapCategoryToFilterOption = (category: Category): FilterOption => ({
    label: category.name,
    value: category.slug,
});

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
    categories: [],
    categoryTree: [],
    topLevelCategories: [],
    categoryFilterOptions: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const categories = await categoriesApi.getAll();
            set({
                categories,
                categoryFilterOptions: categories.map(
                    mapCategoryToFilterOption,
                ),
                isLoading: false,
            });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to fetch categories';
            set({ error: message, isLoading: false });
        }
    },

    fetchCategoryTree: async () => {
        set({ isLoading: true, error: null });
        try {
            const categoryTree = await categoriesApi.getTree();
            set({
                categoryTree,
                isLoading: false,
            });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to fetch category tree';
            set({ error: message, isLoading: false });
        }
    },

    fetchTopLevelCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const topLevelCategories = await categoriesApi.getTopLevel();
            set({
                topLevelCategories,
                isLoading: false,
            });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message ||
                'Failed to fetch top-level categories';
            set({ error: message, isLoading: false });
        }
    },

    getCategoryBySlug: (slug: string) => {
        return get().categories.find((cat) => cat.slug === slug);
    },
}));
