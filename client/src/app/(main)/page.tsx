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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <HeroSection />
            <TopDealsSection auctions={topDealsData} />
            <RecommondedSection />
        </div>
    );
}
