import { apiClient } from './client';

// Types matching backend Product entity
export interface BackendProduct {
    id: string;
    name: string;
    description: string;
    category?: {
        id: string;
        name: string;
    } | null;
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
    // Product detail fields - Filter option relations (UUID-based)
    brandOption?: { name: string; slug: string } | null;
    materialOption?: { name: string; slug: string } | null;
    targetAudienceOption?: { name: string; slug: string } | null;
    eraOption?: { name: string; slug: string } | null;
    finenessOption?: { name: string; slug: string } | null;
    conditionOption?: { name: string; slug: string } | null;
    // Other product detail fields
    totalWeight?: string;
    size?: string;
    mainStoneCaratWeight?: string;
    surroundingStonesCaratWeight?: string;
    origin?: string;
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
    createdAt?: string;
    created_at?: string;
}

export interface BidHistoryItem {
    bidderId: string;
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
    categoryId?: string;
    startingPrice: number;
    stepPrice: number;
    buyNowPrice?: number;
    endDate: string;
    autoRenewal?: boolean;
    mainImage: File | string;
    additionalImages: (File | string)[];
    allowNewBidders?: boolean;
    brand?: string;
    material?: string;
    targetAudience?: string;
    era?: string;
    fineness?: string;
    condition?: string;
    totalWeight?: string;
    size?: string;
    mainStoneCaratWeight?: string;
    surroundingStonesCaratWeight?: string;
    origin?: string;
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

    // POST /products/:productId/reject/:bidderId - Reject a bidder from auction [SELLER]
    rejectBidder: async (
        productId: string,
        bidderId: string,
    ): Promise<BackendProduct> => {
        const response = await apiClient.post(
            `/products/${productId}/reject/${bidderId}`,
        );
        return response.data;
    },

    // GET /products/:id/check-rejection - Check if current user is rejected
    checkRejection: async (
        productId: string,
    ): Promise<{ isRejected: boolean }> => {
        const response = await apiClient.get(
            `/products/${productId}/check-rejection`,
        );
        return response.data;
    },

    // GET /products/:id/my-max-bid - Get current user's max bid on a product
    getMyMaxBid: async (
        productId: string,
    ): Promise<{ maxBid: number | null }> => {
        const response = await apiClient.get(
            `/products/${productId}/my-max-bid`,
        );
        return response.data;
    },

    // GET /products with pagination and filters
    getAllProducts: async (
        page: number = 1,
        limit: number = 20,
        filters?: {
            category?: string;
            brand?: string;
            material?: string;
            targetAudience?: string;
            auctionStatus?: string;
        },
        sortBy?: string,
    ): Promise<{
        products: BackendProduct[];
        total: number;
        page: number;
        limit: number;
    }> => {
        const response = await apiClient.get('/products', {
            params: {
                page,
                limit,
                sortBy,
                ...filters,
            },
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
    // POST /products [SELLER] - create a new product
    createProduct: async (
        productData: CreateProductRequest,
    ): Promise<BackendProduct> => {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        if (productData.categoryId) {
            formData.append('categoryId', productData.categoryId);
        }
        formData.append('startingPrice', productData.startingPrice.toString());
        formData.append('stepPrice', productData.stepPrice.toString());
        formData.append('endDate', productData.endDate);

        if (productData.buyNowPrice) {
            formData.append('buyNowPrice', productData.buyNowPrice.toString());
        }
        if (productData.autoRenewal !== undefined) {
            formData.append('autoRenewal', productData.autoRenewal.toString());
        }
        if (productData.allowNewBidders !== undefined) {
            formData.append(
                'allowNewBidders',
                productData.allowNewBidders.toString(),
            );
        }

        // Optional fields
        if (productData.brand) formData.append('brand', productData.brand);
        if (productData.material)
            formData.append('material', productData.material);
        if (productData.targetAudience)
            formData.append('targetAudience', productData.targetAudience);
        if (productData.era) formData.append('era', productData.era);
        if (productData.fineness)
            formData.append('fineness', productData.fineness);
        if (productData.condition)
            formData.append('condition', productData.condition);
        if (productData.totalWeight)
            formData.append('totalWeight', productData.totalWeight);
        if (productData.size) formData.append('size', productData.size);
        if (productData.mainStoneCaratWeight)
            formData.append(
                'mainStoneCaratWeight',
                productData.mainStoneCaratWeight,
            );
        if (productData.surroundingStonesCaratWeight)
            formData.append(
                'surroundingStonesCaratWeight',
                productData.surroundingStonesCaratWeight,
            );
        if (productData.origin) formData.append('origin', productData.origin);

        // Images
        if (productData.mainImage instanceof File) {
            formData.append('mainImage', productData.mainImage);
        } else if (typeof productData.mainImage === 'string') {
            formData.append('mainImage', productData.mainImage);
        }

        if (Array.isArray(productData.additionalImages)) {
            productData.additionalImages.forEach((image) => {
                if (image instanceof File) {
                    formData.append('additionalImages', image);
                } else if (typeof image === 'string') {
                    formData.append('additionalImages', image);
                }
            });
        }

        const response = await apiClient.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
