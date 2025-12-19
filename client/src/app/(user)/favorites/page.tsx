'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductCard, Button } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { productsApi } from '@/lib/api/products';
import { mapProductToAuction } from '@/stores/productsStore';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { Auction } from '@/types';
import { ChevronDown, Trash2, Heart, ArrowRight } from 'lucide-react';
import toast from '@/lib/toast';
import Link from 'next/link';

export default function FavoritesPage() {
    const [sortBy, setSortBy] = useState('newest');
    const [favorites, setFavorites] = useState<Auction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

    const fetchWatchlist = useCallback(async () => {
        setIsLoading(true);
        try {
            const products = await productsApi.getWatchlist();
            const { isInWatchlist } = useWatchlistStore.getState();
            const auctions = products.map((p) =>
                mapProductToAuction(p, isInWatchlist),
            );
            setFavorites(auctions);
        } catch (error) {
            console.error('Failed to fetch watchlist:', error);
            setFavorites([]);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    useEffect(() => {
        void fetchWatchlist();
    }, [fetchWatchlist]);

    const { removeFromWatchlist } = useWatchlistStore();

    const handleRemoveFromFavorites = async (productId: string) => {
        if (removingIds.has(productId)) return;

        setRemovingIds((prev) => new Set(prev).add(productId));

        try {
            await productsApi.removeFromWatchlist(productId);
            setFavorites((prev) =>
                prev.filter((item) => item.id !== productId),
            );
            // Sync with watchlist store so ProductCards update correctly
            removeFromWatchlist(productId);
            toast.success('Removed from favorites');
        } catch (error) {
            console.error('Failed to remove from watchlist:', error);
            toast.error('Failed to remove from favorites');
        } finally {
            setRemovingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
        { label: 'Price: Low to High', value: 'price-asc' },
        { label: 'Price: High to Low', value: 'price-desc' },
        { label: 'Most Popular', value: 'popular' },
    ];

    const getSortedAuctions = () => {
        const sorted = [...favorites];

        switch (sortBy) {
            case 'newest':
                return sorted.sort(
                    (a, b) =>
                        new Date(b.endDate).getTime() -
                        new Date(a.endDate).getTime(),
                );
            case 'oldest':
                return sorted.sort(
                    (a, b) =>
                        new Date(a.endDate).getTime() -
                        new Date(b.endDate).getTime(),
                );
            case 'price-asc':
                return sorted.sort((a, b) => a.currentBid - b.currentBid);
            case 'price-desc':
                return sorted.sort((a, b) => b.currentBid - a.currentBid);
            case 'popular':
                return sorted.sort((a, b) => b.bidCount - a.bidCount);
            default:
                return sorted;
        }
    };

    const sortedFavorites = getSortedAuctions();

    return (
        <div className="min-h-screen bg-secondary">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <UserSidebar />
                    </div>

                    <div className="lg:col-span-3">
                        <div
                            className={`bg-white rounded-xl shadow-lg border border-primary p-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-primary">
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-dark-primary rounded-full"></div>
                                    <h1 className="font-heading text-3xl font-semibold text-neutral-900 flex items-center gap-3">
                                        Favorite Items
                                        <Heart className="w-7 h-7 text-dark-primary fill-dark-primary" />
                                    </h1>
                                    <p className="text-neutral-500 mt-1">
                                        Items you&apos;ve saved for later
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl border border-dark-primary/30">
                                        <Heart className="w-4 h-4 text-dark-primary" />
                                        <span className="text-sm font-medium text-neutral-700">
                                            {favorites.length} items
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) =>
                                                setSortBy(e.target.value)
                                            }
                                            className="appearance-none bg-white border border-primary rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary cursor-pointer transition-all hover:border-dark-primary"
                                        >
                                            {sortOptions.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-12 h-12 rounded-xl border-4 border-primary border-t-dark-primary animate-spin"></div>
                                    <p className="mt-4 text-neutral-500 animate-pulse">
                                        Loading your favorites...
                                    </p>
                                </div>
                            ) : sortedFavorites.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {sortedFavorites.map((auction, index) => (
                                        <div
                                            key={auction.id}
                                            className="relative group"
                                            style={{
                                                animation: isVisible
                                                    ? `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                                    : 'none',
                                            }}
                                        >
                                            <div className="transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl rounded-xl overflow-hidden">
                                                <ProductCard
                                                    auction={auction}
                                                />
                                            </div>
                                            <button
                                                onClick={() =>
                                                    void handleRemoveFromFavorites(
                                                        auction.id,
                                                    )
                                                }
                                                disabled={removingIds.has(
                                                    auction.id,
                                                )}
                                                className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm hover:bg-red-500 text-neutral-600 hover:text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                                title="Remove from favorites"
                                            >
                                                {removingIds.has(auction.id) ? (
                                                    <div className="animate-spin h-4 w-4 border-2 border-neutral-400 border-t-transparent rounded-full" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 px-4">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-xl flex items-center justify-center shadow-inner">
                                        <Heart className="w-10 h-10 text-dark-primary" />
                                    </div>
                                    <h3 className="font-heading text-xl font-medium text-neutral-900 mb-2">
                                        No favorites yet
                                    </h3>
                                    <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                                        Start exploring and add items to your
                                        favorites to see them here.
                                    </p>
                                    <Link href="/search-result">
                                        <Button variant="muted">
                                            Explore Auctions
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
