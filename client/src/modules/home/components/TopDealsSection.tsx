'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TopDealsTabsProps, TopDealsTab } from '@/types';
import { cn } from '@/lib/utils';
import ProductCard from '@/modules/shared/components/ui/ProductCard';
import { Button } from '@/modules/shared/components/ui';

const TopDealsSection: React.FC<TopDealsTabsProps> = ({ auctions }) => {
    const [activeTab, setActiveTab] = useState<TopDealsTab>('ending-soon');
    const [currentIndex, setCurrentIndex] = useState(0);

    const tabs = [
        { id: 'ending-soon' as TopDealsTab, label: 'Top 5 Ending Soon' },
        { id: 'most-bids' as TopDealsTab, label: 'Top 5 Most Bids' },
        { id: 'highest-price' as TopDealsTab, label: 'Top 5 Highest Price' },
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
    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex + 3 < currentAuctions.length;

    const handlePrevious = () => {
        if (canGoPrevious) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (canGoNext) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleTabChange = (tabId: TopDealsTab) => {
        setActiveTab(tabId);
        setCurrentIndex(0);
    };

    const visibleAuctions = currentAuctions.slice(
        currentIndex,
        currentIndex + 3,
    );

    return (
        <section className="bg-secondary py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-heading text-black mb-8">
                        Hot Deals & Top Bids
                    </h2>

                    <div className="flex justify-center items-center">
                        <div className="inline-flex bg-primary rounded-full p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={cn(
                                        'px-14 py-1 rounded-full font-body text-md font-normal transition-all duration-200',
                                        activeTab === tab.id
                                            ? 'bg-secondary text-black shadow-sm'
                                            : 'text-neutral-600 hover:text-black',
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative flex justify-center">
                    <button
                        onClick={handlePrevious}
                        disabled={!canGoPrevious}
                        className={cn(
                            'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all',
                            canGoPrevious
                                ? 'bg-white hover:shadow-xl text-neutral-600'
                                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed',
                        )}
                        aria-label="Previous products"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className={cn(
                            'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all',
                            canGoNext
                                ? 'bg-white hover:shadow-xl text-neutral-600'
                                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed',
                        )}
                        aria-label="Next products"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="flex gap-6 justify-center max-w-fit">
                        {visibleAuctions.map((auction) => (
                            <ProductCard
                                key={auction.id}
                                auction={auction}
                                onLike={(id) => console.log('Liked:', id)}
                                onBid={(id) => console.log('Bid on:', id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Button variant="primary" size="lg" className="px-8">
                        View All Auctions
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default TopDealsSection;
