'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, TrendingUp, Clock } from 'lucide-react';
import { TopDealsTabsProps, TopDealsTab } from '@/types';
import { cn } from '@/lib/utils';
import ProductCard from '@/modules/shared/components/ui/ProductCard';
import { Button } from '@/modules/shared/components/ui';

const TopDealsSection: React.FC<TopDealsTabsProps> = ({ auctions }) => {
    const [activeTab, setActiveTab] = useState<TopDealsTab>('ending-soon');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

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

    const handleTabChange = (tabId: TopDealsTab) => {
        setActiveTab(tabId);
    };

    // Show all 5 products
    const visibleAuctions = currentAuctions.slice(0, 5);

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

                {/* Products Grid */}
                <div
                    className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                    {/* Top row - 2 cards centered */}
                    <div className="flex justify-center gap-8 mb-8">
                        {visibleAuctions.slice(0, 2).map((auction, index) => (
                            <div
                                key={auction.id}
                                className="transition-all duration-500 w-[280px]"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
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
                    {/* Bottom row - 3 cards centered */}
                    <div className="flex justify-center gap-8">
                        {visibleAuctions.slice(2, 5).map((auction, index) => (
                            <div
                                key={auction.id}
                                className="transition-all duration-500 w-[280px]"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${(index + 2) * 0.1}s both`,
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
