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
    watchlistCount: number;
    mainImage: string;
    additionalImages: string[];
    seller: {
        id: string;
        fullname: string;
        profileImage: string;
        positiveRatings: number;
        negativeRatings: number;
    };
    currentBidderId?: string | null;
    currentBidder?: {
        id: string;
        fullname: string;
        profileImage?: string;
        positiveRatings?: number;
        negativeRatings?: number;
    } | null;
}

export interface BidHistoryItem {
    bidderName: string;
    bidAmount: number;
    bidTime: string;
}

export interface Question {
    id: string;
    productId: string;
    askerId: string;
    asker?: {
        id: string;
        fullname: string;
        profileImage?: string;
    };
    question: string;
    answer?: string;
    answeredAt?: string;
    created_at: string;
}

export interface ProductDetailsResponse {
    product: BackendProduct;
    relatedProducts: BackendProduct[];
    questions: Question[];
}

export interface HomepageProductsResponse {
    topEndingSoon: BackendProduct[];
    topBidCount: BackendProduct[];
    topPrice: BackendProduct[];
}

export interface CreateProductRequest {
    name: string;
    description: string;
    category: string;
    startingPrice: number;
    stepPrice: number;
    buyNowPrice?: number;
    endDate: string;
    autoRenewal?: boolean;
    mainImage: string;
    additionalImages: string[];
    allowNewBidders?: boolean;
}

export const productsApi = {
    // GET /products/homepage
    getHomepageProducts: async (): Promise<HomepageProductsResponse> => {
        const response = await apiClient.get('/products/homepage');
        return response.data;
    },

    // GET /products/:id - Get product details with related products and Q&A
    getProductById: async (id: string): Promise<ProductDetailsResponse> => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    // GET /products/:id/bids - Get bid history
    getBidHistory: async (id: string): Promise<BidHistoryItem[]> => {
        const response = await apiClient.get(`/products/${id}/bids`);
        return response.data;
    },

    // POST /products/:id/bid - Place a bid [BIDDER]
    placeBid: async (id: string, maxBid: number): Promise<BackendProduct> => {
        const response = await apiClient.post(`/products/${id}/bid`, {
            maxBid,
        });
        return response.data;
    },

    // POST /products/:id/buy-now - Buy product immediately [BIDDER]
    buyNow: async (id: string): Promise<BackendProduct> => {
        const response = await apiClient.post(`/products/${id}/buy-now`, {});
        return response.data;
    },

    // POST /products/watchlist - Add to watchlist [BIDDER]
    addToWatchlist: async (productId: string): Promise<{ message: string }> => {
        const response = await apiClient.post('/products/watchlist', {
            productId,
        });
        return response.data;
    },

    // DELETE /products/watchlist/:id - Remove from watchlist [BIDDER]
    removeFromWatchlist: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`/products/watchlist/${id}`);
        return response.data;
    },

    // POST /products/questions - Ask a question [BIDDER]
    askQuestion: async (
        productId: string,
        question: string,
    ): Promise<{ message: string }> => {
        const response = await apiClient.post('/products/questions', {
            productId,
            question,
        });
        return response.data;
    },

    // PATCH /products/questions/:id/answer - Answer a question [SELLER]
    answerQuestion: async (
        questionId: string,
        answer: string,
    ): Promise<{ message: string }> => {
        const response = await apiClient.patch(
            `/products/questions/${questionId}/answer`,
            { answer },
        );
        return response.data;
    },

    // PATCH /products/:id/description - Append description [SELLER]
    appendDescription: async (
        id: string,
        additionalDescription: string,
    ): Promise<BackendProduct> => {
        const response = await apiClient.patch(`/products/${id}/description`, {
            additionalDescription,
        });
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

    // GET /products/user/watchlist [BIDDER, SELLER] - requires auth
    getWatchlist: async (): Promise<BackendProduct[]> => {
        const response = await apiClient.get('/products/user/watchlist');
        return response.data;
    },

    // GET /products/user/bidding [BIDDER] - products user is bidding on
    getProductsUserIsBidding: async (): Promise<BackendProduct[]> => {
        const response = await apiClient.get('/products/user/bidding');
        return response.data;
    },

    // GET /products/user/won [BIDDER] - products user won
    getProductsUserWon: async (): Promise<BackendProduct[]> => {
        const response = await apiClient.get('/products/user/won');
        return response.data;
    },

    // GET /products/seller/active [SELLER] - seller's active products
    getSellerProducts: async (): Promise<BackendProduct[]> => {
        const response = await apiClient.get('/products/seller/active');
        return response.data;
    },

    // GET /products/seller/completed [SELLER] - seller's completed auctions
    getSellerCompletedProducts: async (): Promise<BackendProduct[]> => {
        const response = await apiClient.get('/products/seller/completed');
        return response.data;
    },

    // POST /products [SELLER] - create a new product
    createProduct: async (
        productData: CreateProductRequest,
    ): Promise<BackendProduct> => {
        const response = await apiClient.post('/products', productData);
        return response.data;
    },
};
