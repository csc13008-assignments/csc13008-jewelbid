import { create } from 'zustand';
import { productsApi } from '../lib/api/products';

interface WatchlistState {
    watchlistProductIds: Set<string>;
    isLoading: boolean;

    fetchWatchlist: () => Promise<void>;
    addToWatchlist: (productId: string) => void;
    removeFromWatchlist: (productId: string) => void;
    isInWatchlist: (productId: string) => boolean;
    clear: () => void;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
    watchlistProductIds: new Set(),
    isLoading: false,

    fetchWatchlist: async () => {
        set({ isLoading: true });
        try {
            const products = await productsApi.getWatchlist();
            const productIds = new Set(products.map((p) => p.id));
            set({ watchlistProductIds: productIds, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch watchlist:', error);
            set({ isLoading: false });
        }
    },

    addToWatchlist: (productId: string) => {
        const ids = new Set(get().watchlistProductIds);
        ids.add(productId);
        set({ watchlistProductIds: ids });
    },

    removeFromWatchlist: (productId: string) => {
        const ids = new Set(get().watchlistProductIds);
        ids.delete(productId);
        set({ watchlistProductIds: ids });
    },

    isInWatchlist: (productId: string) => {
        return get().watchlistProductIds.has(productId);
    },

    clear: () => {
        set({ watchlistProductIds: new Set() });
    },
}));
