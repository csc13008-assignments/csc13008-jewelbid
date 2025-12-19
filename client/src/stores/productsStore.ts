import { create } from 'zustand';
import { productsApi, BackendProduct } from '../lib/api/products';
import { Auction } from '@/types';
import { useWatchlistStore } from './watchlistStore';

interface ProductsState {
    // Homepage data
    endingSoon: Auction[];
    mostBids: Auction[];
    highestPrice: Auction[];

    // Search/listing data
    searchResults: Auction[];
    searchTotal: number;
    searchPage: number;
    searchLimit: number;

    isLoading: boolean;
    error: string | null;

    // Actions
    fetchHomepageProducts: () => Promise<void>;
    fetchProducts: (page?: number, limit?: number) => Promise<void>;
    searchProducts: (params: {
        q?: string;
        category?: string;
        sortBy?: 'endDate' | 'price';
        page?: number;
        limit?: number;
    }) => Promise<void>;
    fetchProductsByCategory: (
        category: string,
        page?: number,
        limit?: number,
    ) => Promise<void>;
    clearSearch: () => void;
}

// Map backend Product to frontend Auction type
export const mapProductToAuction = (
    product: BackendProduct,
    isInWatchlist: (id: string) => boolean = () => false,
): Auction => {
    // Create bids array from currentBidder if exists
    const bids = product.currentBidder
        ? [
              {
                  id: product.currentBidderId || '',
                  amount: Number(product.currentPrice),
                  bidder: {
                      id: product.currentBidder.id,
                      username: product.currentBidder.fullname,
                      avatar: product.currentBidder.profileImage || '',
                      rating:
                          product.currentBidder.positiveRatings &&
                          product.currentBidder.negativeRatings !== undefined
                              ? product.currentBidder.positiveRatings /
                                (product.currentBidder.positiveRatings +
                                    product.currentBidder.negativeRatings || 1)
                              : 0,
                      reviewCount:
                          (product.currentBidder.positiveRatings || 0) +
                          (product.currentBidder.negativeRatings || 0),
                  },
                  timestamp: new Date(),
              },
          ]
        : [];

    return {
        id: product.id,
        product: {
            id: product.id,
            name: product.name,
            image: product.mainImage,
            category: product.category,
            material: '',
            brand: '',
            description: product.description,
        },
        startBid: Number(product.startingPrice),
        currentBid: Number(product.currentPrice),
        bidIncrement: Number(product.stepPrice),
        buyNowPrice: product.buyNowPrice
            ? Number(product.buyNowPrice)
            : undefined,
        bidCount: product.bidCount,
        likeCount: product.watchlistCount || 0,
        isLiked: isInWatchlist(product.id),
        startDate: new Date(),
        endDate: new Date(product.endDate),
        status: product.status.toLowerCase() as 'active' | 'ended' | 'upcoming',
        seller: {
            id: product.seller?.id || '',
            username: product.seller?.fullname || 'Unknown Seller',
            avatar: product.seller?.profileImage || '',
            rating:
                product.seller?.positiveRatings &&
                product.seller?.negativeRatings !== undefined
                    ? product.seller.positiveRatings /
                      (product.seller.positiveRatings +
                          product.seller.negativeRatings || 1)
                    : 5.0,
            reviewCount:
                (product.seller?.positiveRatings || 0) +
                (product.seller?.negativeRatings || 0),
        },
        bids,
    };
};

export const useProductsStore = create<ProductsState>((set) => ({
    endingSoon: [],
    mostBids: [],
    highestPrice: [],
    searchResults: [],
    searchTotal: 0,
    searchPage: 1,
    searchLimit: 20,
    isLoading: false,
    error: null,

    fetchHomepageProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await productsApi.getHomepageProducts();
            const { isInWatchlist } = useWatchlistStore.getState();

            set({
                endingSoon: response.topEndingSoon.map((p) =>
                    mapProductToAuction(p, isInWatchlist),
                ),
                mostBids: response.topBidCount.map((p) =>
                    mapProductToAuction(p, isInWatchlist),
                ),
                highestPrice: response.topPrice.map((p) =>
                    mapProductToAuction(p, isInWatchlist),
                ),
                isLoading: false,
            });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to fetch products';
            set({ error: message, isLoading: false });
        }
    },

    fetchProducts: async (page = 1, limit = 20) => {
        set({ isLoading: true, error: null });
        try {
            const response = await productsApi.getAllProducts(page, limit);
            const { isInWatchlist } = useWatchlistStore.getState();
            set({
                searchResults: response.products.map((p) =>
                    mapProductToAuction(p, isInWatchlist),
                ),
                searchTotal: response.total,
                searchPage: response.page,
                searchLimit: response.limit,
                isLoading: false,
            });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to fetch products';
            set({ error: message, isLoading: false });
        }
    },

    searchProducts: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const response = await productsApi.searchProducts(params);
            const { isInWatchlist } = useWatchlistStore.getState();
            set({
                searchResults: response.products.map((p) =>
                    mapProductToAuction(p, isInWatchlist),
                ),
                searchTotal: response.total,
                searchPage: response.page,
                searchLimit: response.limit,
                isLoading: false,
            });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to search products';
            set({ error: message, isLoading: false });
        }
    },

    fetchProductsByCategory: async (category, page = 1, limit = 20) => {
        set({ isLoading: true, error: null });
        try {
            const response = await productsApi.getProductsByCategory(
                category,
                page,
                limit,
            );
            const { isInWatchlist } = useWatchlistStore.getState();
            set({
                searchResults: response.products.map((p) =>
                    mapProductToAuction(p, isInWatchlist),
                ),
                searchTotal: response.total,
                searchPage: response.page,
                searchLimit: response.limit,
                isLoading: false,
            });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message ||
                'Failed to fetch products by category';
            set({ error: message, isLoading: false });
        }
    },

    clearSearch: () => {
        set({
            searchResults: [],
            searchTotal: 0,
            searchPage: 1,
            error: null,
        });
    },
}));
