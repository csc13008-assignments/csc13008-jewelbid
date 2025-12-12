'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { productsApi } from '@/lib/api/products';
import { mapProductToAuction } from '@/stores/productsStore';

interface BidItem {
    id: string;
    product: string;
    productImage: string;
    currentBid: string;
    yourBid: string;
    timeLeft: string;
    status: 'winning' | 'outbid' | 'ended';
}

export default function MyBidsPage() {
    const [bids, setBids] = useState<BidItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
    };

    const getTimeLeft = (endDate: Date) => {
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();
        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );

        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    const fetchBids = useCallback(async () => {
        setIsLoading(true);
        try {
            const products = await productsApi.getProductsUserIsBidding();
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

            const bidItems: BidItem[] = products.map((product) => {
                const auction = mapProductToAuction(product);
                const isWinning = product.currentBidder?.id === userId;

                return {
                    id: product.id,
                    product: product.name,
                    productImage: product.mainImage,
                    currentBid: formatCurrency(product.currentPrice),
                    yourBid: formatCurrency(product.currentPrice), // Simplified - actual bid history would be needed
                    timeLeft: getTimeLeft(new Date(product.endDate)),
                    status:
                        auction.status === 'ended'
                            ? 'ended'
                            : isWinning
                              ? 'winning'
                              : 'outbid',
                };
            });

            setBids(bidItems);
        } catch (error) {
            console.error('Failed to fetch bids:', error);
            setBids([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchBids();
    }, [fetchBids]);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <UserSidebar />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white">
                            <h1 className="font-heading text-5xl font-normal text-black mb-8">
                                My Bids
                            </h1>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : bids.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">🎯</div>
                                    <h3 className="font-heading text-2xl font-medium text-black mb-2">
                                        No bids yet
                                    </h3>
                                    <p className="text-neutral-600 font-body">
                                        Start bidding on items to see them here.
                                    </p>
                                </div>
                            ) : (
                                <div className="border border-gray-300">
                                    <div className="grid grid-cols-5 bg-secondary border-b border-primary">
                                        <div className="px-6 py-4 text-left font-bold text-black border-r border-primary">
                                            Product
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                            Current Bid
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                            Your Bid
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                            Time Left
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black">
                                            Status
                                        </div>
                                    </div>

                                    {bids.map((bid, index) => (
                                        <div
                                            key={bid.id}
                                            className={`grid grid-cols-5 ${
                                                index < bids.length - 1
                                                    ? 'border-b border-gray-300'
                                                    : ''
                                            }`}
                                        >
                                            <div className="px-6 py-6 flex items-center border-r border-gray-300">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={bid.productImage}
                                                        alt={bid.product}
                                                        className="w-16 h-16 object-cover bg-gray-200"
                                                    />
                                                    <div>
                                                        <Link
                                                            href={`/auction/${bid.id}`}
                                                            className="font-medium text-black text-sm mb-1 hover:underline"
                                                        >
                                                            {bid.product}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-6 py-6 text-center text-black border-r border-gray-300 flex items-center justify-center">
                                                {bid.currentBid}
                                            </div>
                                            <div className="px-6 py-6 text-center text-black border-r border-gray-300 flex items-center justify-center">
                                                {bid.yourBid}
                                            </div>
                                            <div className="px-6 py-6 text-center text-black border-r border-gray-300 flex items-center justify-center">
                                                {bid.timeLeft}
                                            </div>
                                            <div className="px-6 py-6 text-center flex items-center justify-center">
                                                <span
                                                    className={`px-3 py-1 text-xs font-medium ${
                                                        bid.status === 'winning'
                                                            ? 'bg-green-100 text-green-800'
                                                            : bid.status ===
                                                                'outbid'
                                                              ? 'bg-red-100 text-red-800'
                                                              : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {bid.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
