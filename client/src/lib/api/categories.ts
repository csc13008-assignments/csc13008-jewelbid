import { apiClient } from './client';

// Types matching backend Category entity
export interface Category {
    id: string;
    name: string;
    description?: string;
    slug: string;
    parentId?: string;
    parent?: Category;
    children?: Category[];
    order: number;
    isActive: boolean;
    created_at: string;
    updated_at: string;
}

export const categoriesApi = {
    // GET /categories - Get all active categories (flat list)
    getAll: async (): Promise<Category[]> => {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    // GET /categories/tree - Get category tree (2-level hierarchy)
    getTree: async (): Promise<Category[]> => {
        const response = await apiClient.get('/categories/tree');
        return response.data;
    },

    // GET /categories/top-level - Get top-level categories only
    getTopLevel: async (): Promise<Category[]> => {
        const response = await apiClient.get('/categories/top-level');
        return response.data;
    },

    // GET /categories/:id - Get category by ID
    getById: async (id: string): Promise<Category> => {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    },

    // GET /categories/slug/:slug - Get category by slug
    getBySlug: async (slug: string): Promise<Category> => {
        const response = await apiClient.get(`/categories/slug/${slug}`);
        return response.data;
    },
};
