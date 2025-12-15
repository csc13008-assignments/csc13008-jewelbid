'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { Button } from '@/modules/shared/components/ui';
import { productsApi } from '@/lib/api/products';
import { mapProductToAuction } from '@/stores/productsStore';
import {
    Clock,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    ArrowRight,
    Gavel,
} from 'lucide-react';

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
    const [isVisible, setIsVisible] = useState(false);

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
                    yourBid: formatCurrency(product.currentPrice),
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
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    useEffect(() => {
        void fetchBids();
    }, [fetchBids]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'winning':
                return <CheckCircle className="w-4 h-4" />;
            case 'outbid':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'winning':
                return 'bg-green-50 text-green-700 border border-green-200';
            case 'outbid':
                return 'bg-red-50 text-red-700 border border-red-200';
            default:
                return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
        }
    };

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
                                        My Bids
                                        <Gavel className="w-7 h-7 text-dark-primary" />
                                    </h1>
                                    <p className="text-neutral-500 mt-1">
                                        Track all your active and past bids
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl border border-dark-primary/30">
                                    <TrendingUp className="w-4 h-4 text-dark-primary" />
                                    <span className="text-sm font-medium text-neutral-700">
                                        {bids.length} active bids
                                    </span>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-12 h-12 rounded-xl border-4 border-primary border-t-dark-primary animate-spin"></div>
                                    <p className="mt-4 text-neutral-500 animate-pulse">
                                        Loading your bids...
                                    </p>
                                </div>
                            ) : bids.length === 0 ? (
                                <div className="text-center py-16 px-4">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-xl flex items-center justify-center shadow-inner">
                                        <Gavel className="w-10 h-10 text-dark-primary" />
                                    </div>
                                    <h3 className="font-heading text-xl font-medium text-neutral-900 mb-2">
                                        No bids yet
                                    </h3>
                                    <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                                        Start bidding on items to track them
                                        here.
                                    </p>
                                    <Link href="/search-result">
                                        <Button variant="muted">
                                            Browse Auctions
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-xl border border-primary">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 bg-primary border-b border-dark-primary/20">
                                        <div className="col-span-4 px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                                            Product
                                        </div>
                                        <div className="col-span-2 px-4 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                                            Current Bid
                                        </div>
                                        <div className="col-span-2 px-4 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                                            Your Bid
                                        </div>
                                        <div className="col-span-2 px-4 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                                            Time Left
                                        </div>
                                        <div className="col-span-2 px-4 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                                            Status
                                        </div>
                                    </div>

                                    {/* Table Body */}
                                    {bids.map((bid, index) => (
                                        <div
                                            key={bid.id}
                                            className={`grid grid-cols-12 items-center hover:bg-secondary transition-colors ${
                                                index < bids.length - 1
                                                    ? 'border-b border-primary'
                                                    : ''
                                            }`}
                                            style={{
                                                animation: isVisible
                                                    ? `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                                    : 'none',
                                            }}
                                        >
                                            <div className="col-span-4 px-6 py-5">
                                                <Link
                                                    href={`/auction/${bid.id}`}
                                                    className="flex items-center gap-4 group"
                                                >
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-primary flex-shrink-0 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                                                        <Image
                                                            src={
                                                                bid.productImage
                                                            }
                                                            alt={bid.product}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="font-medium text-neutral-900 group-hover:text-dark-primary transition-colors line-clamp-2">
                                                        {bid.product}
                                                    </span>
                                                </Link>
                                            </div>
                                            <div className="col-span-2 px-4 py-5 text-center">
                                                <span className="font-semibold text-neutral-900">
                                                    {bid.currentBid}
                                                </span>
                                            </div>
                                            <div className="col-span-2 px-4 py-5 text-center">
                                                <span className="text-neutral-600">
                                                    {bid.yourBid}
                                                </span>
                                            </div>
                                            <div className="col-span-2 px-4 py-5 text-center">
                                                <div className="inline-flex items-center gap-1.5 text-neutral-600 bg-primary px-3 py-1.5 rounded-lg">
                                                    <Clock className="w-4 h-4 text-dark-primary" />
                                                    <span className="font-medium">
                                                        {bid.timeLeft}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 px-4 py-5 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full capitalize ${getStatusStyles(bid.status)}`}
                                                >
                                                    {getStatusIcon(bid.status)}
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
