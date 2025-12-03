'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { mockAuctions } from '@/lib/mockData';
import { ChevronDown } from 'lucide-react';

export default function FavoritesPage() {
    const [sortBy, setSortBy] = useState('newest');

    const favoriteAuctions = useMemo(() => {
        const likedAuctions = mockAuctions.filter((auction) => auction.isLiked);

        if (likedAuctions.length === 0) {
            return mockAuctions.slice(0, 6).map((auction) => ({
                ...auction,
                isLiked: true,
            }));
        }

        return likedAuctions;
    }, []);

    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
        { label: 'Price: Low to High', value: 'price-asc' },
        { label: 'Price: High to Low', value: 'price-desc' },
        { label: 'Most Popular', value: 'popular' },
    ];

    const getSortedAuctions = () => {
        const sorted = [...favoriteAuctions];

        switch (sortBy) {
            case 'newest':
                return sorted.sort(
                    (a, b) => b.endDate.getTime() - a.endDate.getTime(),
                );
            case 'oldest':
                return sorted.sort(
                    (a, b) => a.endDate.getTime() - b.endDate.getTime(),
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
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <UserSidebar />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="font-heading text-5xl font-medium text-black">
                                Favorite Items
                            </h1>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-body text-sm text-neutral-600">
                                        Sorting Options
                                    </span>
                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) =>
                                                setSortBy(e.target.value)
                                            }
                                            className="appearance-none bg-white border border-primary px-4 py-2 pr-8 text-sm font-body focus:outline-none focus:border-black cursor-pointer"
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
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {sortedFavorites.length > 0 ? (
                            <div className="grid grid-cols-3 gap-12">
                                {sortedFavorites.map((auction) => (
                                    <ProductCard
                                        key={auction.id}
                                        auction={auction}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">💎</div>
                                <h3 className="font-heading text-2xl font-medium text-black mb-2">
                                    No favorites yet
                                </h3>
                                <p className="text-neutral-600 font-body">
                                    Start exploring and add items to your
                                    favorites to see them here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
