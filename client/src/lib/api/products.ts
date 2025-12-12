import { apiClient } from './client';

// Types matching backend Product entity
export interface BackendProduct {
    id: string;
    name: string;
    description: string;
    category: string;
    startingPrice: number;
    currentPrice: number;
    stepPrice: number;
    buyNowPrice: number | null;
    endDate: string;
    status: string;
    bidCount: number;
    mainImage: string;
    additionalImages: string[];
    seller: {
        id: string;
        fullname: string;
        profileImage: string;
        positiveRatings: number;
        negativeRatings: number;
    };
    currentBidder: {
        id: string;
        fullname: string;
    } | null;
}

export interface HomepageProductsResponse {
    topEndingSoon: BackendProduct[];
    topBidCount: BackendProduct[];
    topPrice: BackendProduct[];
}

export const productsApi = {
    // GET /products/homepage
    getHomepageProducts: async (): Promise<HomepageProductsResponse> => {
        const response = await apiClient.get('/products/homepage');
        return response.data;
    },

    // GET /products/:id
    getProductById: async (id: string): Promise<BackendProduct> => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    // GET /products with pagination
    getAllProducts: async (
        page: number = 1,
        limit: number = 20,
    ): Promise<{
        products: BackendProduct[];
        total: number;
        page: number;
        limit: number;
    }> => {
        const response = await apiClient.get('/products', {
            params: { page, limit },
        });
        return response.data;
    },

    // GET /products/search
    searchProducts: async (params: {
        q?: string;
        category?: string;
        sortBy?: 'endDate' | 'price';
        page?: number;
        limit?: number;
    }): Promise<{
        products: BackendProduct[];
        total: number;
        page: number;
        limit: number;
    }> => {
        const response = await apiClient.get('/products/search', { params });
        return response.data;
    },

    // GET /products/category/:category
    getProductsByCategory: async (
        category: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{
        products: BackendProduct[];
        total: number;
        page: number;
        limit: number;
    }> => {
        const response = await apiClient.get(`/products/category/${category}`, {
            params: { page, limit },
        });
        return response.data;
    },
};
