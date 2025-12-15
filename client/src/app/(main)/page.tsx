'use client';

import { useEffect } from 'react';
import {
    HeroSection,
    TopDealsSection,
    RecommondedSection,
} from '@/modules/home';
import { useProductsStore } from '@/stores/productsStore';

export default function Home() {
    const {
        endingSoon,
        mostBids,
        highestPrice,
        isLoading,
        fetchHomepageProducts,
    } = useProductsStore();

    useEffect(() => {
        void fetchHomepageProducts();
    }, [fetchHomepageProducts]);

    const topDealsData = {
        endingSoon,
        mostBids,
        highestPrice,
    };

    if (isLoading && endingSoon.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-4 border-primary border-t-dark-primary animate-spin"></div>
                    <p className="text-neutral-500 animate-pulse font-medium">
                        Loading amazing deals...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <HeroSection />
            <TopDealsSection auctions={topDealsData} />
            <RecommondedSection />
        </div>
    );
}
