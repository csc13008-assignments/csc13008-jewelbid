'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { TopDealsTabsProps, TopDealsTab } from '@/types';
import { cn } from '@/lib/utils';
import ProductCard from '@/modules/shared/components/ui/ProductCard';
import { Button } from '@/modules/shared/components/ui';

const TopDealsSection: React.FC<TopDealsTabsProps> = ({ auctions }) => {
    const [activeTab, setActiveTab] = useState<TopDealsTab>('ending-soon');
    const [currentPage, setCurrentPage] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const ITEMS_PER_PAGE = 3;
    const MAX_ITEMS = 5;

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(0);
    }, [activeTab]);

    const tabs = [
        { id: 'ending-soon' as TopDealsTab, label: 'Ending Soon', icon: Clock },
        { id: 'most-bids' as TopDealsTab, label: 'Most Bids', icon: Flame },
        {
            id: 'highest-price' as TopDealsTab,
            label: 'Highest Price',
            icon: TrendingUp,
        },
    ];

    const getCurrentAuctions = () => {
        switch (activeTab) {
            case 'ending-soon':
                return auctions.endingSoon;
            case 'most-bids':
                return auctions.mostBids;
            case 'highest-price':
                return auctions.highestPrice;
            default:
                return auctions.endingSoon;
        }
    };

    const currentAuctions = getCurrentAuctions();

    // Limit to 5 products total
    const limitedAuctions = currentAuctions.slice(0, MAX_ITEMS);
    const totalPages = Math.ceil(limitedAuctions.length / ITEMS_PER_PAGE);

    // Get current page items
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const visibleAuctions = limitedAuctions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleTabChange = (tabId: TopDealsTab) => {
        setActiveTab(tabId);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <section className="bg-secondary py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div
                    className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                    <h2 className="text-4xl font-heading text-black mb-4">
                        Hot Deals & Top Bids
                    </h2>
                    <p className="text-neutral-600 max-w-md mx-auto mb-8">
                        Don&apos;t miss out on these exciting auctions. Bid now
                        before time runs out!
                    </p>

                    {/* Tabs */}
                    <div className="flex justify-center items-center">
                        <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-primary">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={cn(
                                            'px-6 py-3 rounded-xl font-body text-sm font-medium transition-all duration-300 flex items-center gap-2',
                                            activeTab === tab.id
                                                ? 'bg-dark-primary text-white shadow-md'
                                                : 'text-neutral-600 hover:text-dark-primary hover:bg-primary/50',
                                        )}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Products Carousel */}
                <div
                    className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                    <div className="relative">
                        {/* Previous Button */}
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className={cn(
                                'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300',
                                currentPage === 0
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:bg-dark-primary hover:text-white hover:scale-110'
                            )}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        {/* Products Row */}
                        <div className="flex justify-center gap-6 px-12">
                            {visibleAuctions.map((auction, index) => (
                                <div
                                    key={auction.id}
                                    className="transition-all duration-500 w-[308px]"
                                    style={{
                                        animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
                                    }}
                                >
                                    <ProductCard
                                        auction={auction}
                                        onLike={(id) => console.log('Liked:', id)}
                                        onBid={(id) => console.log('Bid on:', id)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1}
                            className={cn(
                                'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300',
                                currentPage >= totalPages - 1
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:bg-dark-primary hover:text-white hover:scale-110'
                            )}
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Page Indicators */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    className={cn(
                                        'w-2.5 h-2.5 rounded-full transition-all duration-300',
                                        currentPage === index
                                            ? 'bg-dark-primary w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    )}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* View All Button */}
                <div
                    className={`text-center mt-14 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                    <Link href="/search-result">
                        <Button variant="muted" size="md">
                            View All Auctions
                        </Button>
                    </Link>
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
        </section>
    );
};

export default TopDealsSection;

