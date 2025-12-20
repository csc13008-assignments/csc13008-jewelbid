'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Gavel,
    Clock,
    CheckCircle,
    AlertCircle,
    Package,
    ArrowRight,
    Trophy,
} from 'lucide-react';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { Button } from '@/modules/shared/components/ui';
import { productsApi, BackendProduct } from '@/lib/api/products';
import Image from 'next/image';
import Link from 'next/link';

interface MyBidItem extends BackendProduct {
    myBidStatus: '1st_place' | 'outbid' | 'won' | 'lost';
    formattedEndTime: string;
}

export default function MyBidsPage() {
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>(
        'active',
    );
    const [activeBids, setActiveBids] = useState<MyBidItem[]>([]);
    const [completedBids, setCompletedBids] = useState<MyBidItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
    };

    const getTimeLeft = (endDate: string) => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );

        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    const getStatusInfo = (status: MyBidItem['myBidStatus']) => {
        switch (status) {
            case '1st_place':
                return {
                    label: '1st Place',
                    className: 'bg-green-50 text-green-700 border-green-200',
                    icon: <Trophy className="w-3 h-3" />,
                };
            case 'outbid':
                return {
                    label: 'Outbid',
                    className: 'bg-red-50 text-red-700 border-red-200',
                    icon: <AlertCircle className="w-3 h-3" />,
                };
            case 'won':
                return {
                    label: 'Winning',
                    className: 'bg-green-100 text-green-800 border-green-300',
                    icon: <CheckCircle className="w-3 h-3" />,
                };
            case 'lost':
                return {
                    label: 'Lost',
                    className:
                        'bg-neutral-100 text-neutral-600 border-neutral-200',
                    icon: <Package className="w-3 h-3" />,
                };
        }
    };

    const fetchBids = useCallback(async () => {
        setIsLoading(true);
        try {
            const products = await productsApi.getProductsUserIsBidding();
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

            const processedBids: MyBidItem[] = products.map((product) => {
                const now = new Date();
                const endDate = new Date(product.endDate);
                const isEnded =
                    endDate.getTime() <= now.getTime() ||
                    product.status === 'ended';
                const isWinning = product.currentBidder?.id === userId;

                let status: MyBidItem['myBidStatus'];

                if (isEnded) {
                    status = isWinning ? 'won' : 'lost';
                } else {
                    status = isWinning ? '1st_place' : 'outbid';
                }

                return {
                    ...product,
                    myBidStatus: status,
                    formattedEndTime: getTimeLeft(product.endDate),
                };
            });

            // Split into active and completed
            setActiveBids(
                processedBids.filter(
                    (item) =>
                        item.myBidStatus === '1st_place' ||
                        item.myBidStatus === 'outbid',
                ),
            );

            setCompletedBids(
                processedBids.filter(
                    (item) =>
                        item.myBidStatus === 'won' ||
                        item.myBidStatus === 'lost',
                ),
            );
        } catch (error) {
            console.error('Failed to fetch bids:', error);
            setActiveBids([]);
            setCompletedBids([]);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    useEffect(() => {
        void fetchBids();
    }, [fetchBids]);

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
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-8 bg-neutral-100 p-1.5 rounded-xl w-fit border border-neutral-200">
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                                        activeTab === 'active'
                                            ? 'bg-white text-black shadow-sm border border-primary/20'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                                    }`}
                                >
                                    <Gavel className="w-4 h-4" />
                                    Active Bids
                                    <span
                                        className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'active' ? 'bg-primary/30 text-dark-primary' : 'bg-neutral-200 text-neutral-600'}`}
                                    >
                                        {activeBids.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('completed')}
                                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                                        activeTab === 'completed'
                                            ? 'bg-white text-black shadow-sm border border-primary/20'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                                    }`}
                                >
                                    <Package className="w-4 h-4" />
                                    Completed Bids
                                    <span
                                        className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'completed' ? 'bg-primary/30 text-dark-primary' : 'bg-neutral-200 text-neutral-600'}`}
                                    >
                                        {completedBids.length}
                                    </span>
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-12 h-12 rounded-xl border-4 border-primary border-t-dark-primary animate-spin"></div>
                                    <p className="mt-4 text-neutral-500 animate-pulse">
                                        Loading your bids...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'active' && (
                                        <div className="space-y-4">
                                            {activeBids.length === 0 ? (
                                                <div className="text-center py-16 px-4 border-2 border-dashed border-primary/30 rounded-xl bg-secondary/20">
                                                    <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-xl flex items-center justify-center shadow-sm border border-primary/20">
                                                        <Gavel className="w-10 h-10 text-dark-primary/50" />
                                                    </div>
                                                    <h3 className="font-heading text-xl font-medium text-neutral-900 mb-2">
                                                        No active bids
                                                    </h3>
                                                    <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                                                        Start bidding on items
                                                        to track them here.
                                                    </p>
                                                    <Link href="/search-result">
                                                        <Button variant="muted">
                                                            Browse Auctions
                                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto rounded-xl border border-primary/50 shadow-sm">
                                                    <div className="min-w-[800px]">
                                                        <div className="grid grid-cols-12 bg-secondary border-b border-primary/50 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                                            <div className="col-span-5 px-6 py-4">
                                                                Product
                                                            </div>
                                                            <div className="col-span-2 px-6 py-4 text-center">
                                                                Current Price
                                                            </div>
                                                            <div className="col-span-2 px-6 py-4 text-center">
                                                                Ends In
                                                            </div>
                                                            <div className="col-span-1 px-6 py-4 text-center">
                                                                Bids
                                                            </div>
                                                            <div className="col-span-2 px-6 py-4 text-center">
                                                                Status
                                                            </div>
                                                        </div>

                                                        <div className="divide-y divide-primary/30 bg-white">
                                                            {activeBids.map(
                                                                (
                                                                    bid,
                                                                    index,
                                                                ) => {
                                                                    const statusInfo =
                                                                        getStatusInfo(
                                                                            bid.myBidStatus,
                                                                        );
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                bid.id
                                                                            }
                                                                            className="grid grid-cols-12 items-center hover:bg-secondary/30 transition-colors duration-200"
                                                                            style={{
                                                                                animation:
                                                                                    isVisible
                                                                                        ? `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                                                                                        : 'none',
                                                                            }}
                                                                        >
                                                                            <div className="col-span-5 px-6 py-4 flex items-center gap-4">
                                                                                <Link
                                                                                    href={`/auction/${bid.id}`}
                                                                                    className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 shadow-sm flex-shrink-0 group"
                                                                                >
                                                                                    <Image
                                                                                        src={
                                                                                            bid.mainImage
                                                                                        }
                                                                                        alt={
                                                                                            bid.name
                                                                                        }
                                                                                        fill
                                                                                        className="object-cover group-hover:scale-105 transition-transform"
                                                                                    />
                                                                                </Link>
                                                                                <div>
                                                                                    <Link
                                                                                        href={`/auction/${bid.id}`}
                                                                                    >
                                                                                        <h3
                                                                                            className="font-medium text-neutral-900 line-clamp-1 hover:text-dark-primary transition-colors"
                                                                                            title={
                                                                                                bid.name
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                bid.name
                                                                                            }
                                                                                        </h3>
                                                                                    </Link>
                                                                                    <p className="text-xs text-neutral-500 mt-1">
                                                                                        Category:{' '}
                                                                                        {
                                                                                            bid.category
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-span-2 px-6 py-4 text-center font-medium text-dark-primary">
                                                                                {formatCurrency(
                                                                                    bid.currentPrice,
                                                                                )}
                                                                            </div>
                                                                            <div className="col-span-2 px-6 py-4 text-center">
                                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                                                                                    <Clock className="w-3 h-3" />
                                                                                    {
                                                                                        bid.formattedEndTime
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-span-1 px-6 py-4 text-center text-neutral-600 font-medium">
                                                                                {
                                                                                    bid.bidCount
                                                                                }
                                                                            </div>
                                                                            <div className="col-span-2 px-6 py-4 flex justify-center">
                                                                                <span
                                                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}
                                                                                >
                                                                                    {
                                                                                        statusInfo.icon
                                                                                    }
                                                                                    {
                                                                                        statusInfo.label
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'completed' && (
                                        <div className="space-y-4">
                                            {completedBids.length === 0 ? (
                                                <div className="text-center py-16 px-4 border-2 border-dashed border-primary/30 rounded-xl bg-secondary/20">
                                                    <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-xl flex items-center justify-center shadow-sm border border-primary/20">
                                                        <Package className="w-10 h-10 text-dark-primary/50" />
                                                    </div>
                                                    <h3 className="font-heading text-xl font-medium text-neutral-900 mb-2">
                                                        No completed bids
                                                    </h3>
                                                    <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                                                        Past auctions you
                                                        participated in will
                                                        appear here.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto rounded-xl border border-primary/50 shadow-sm">
                                                    <div className="min-w-[800px]">
                                                        <div className="grid grid-cols-12 bg-secondary border-b border-primary/50 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                                            <div className="col-span-5 px-6 py-4">
                                                                Product
                                                            </div>
                                                            <div className="col-span-2 px-6 py-4 text-center">
                                                                Final Price
                                                            </div>
                                                            <div className="col-span-2 px-6 py-4 text-center">
                                                                Ended Date
                                                            </div>
                                                            <div className="col-span-1 px-6 py-4 text-center">
                                                                Bids
                                                            </div>
                                                            <div className="col-span-2 px-6 py-4 text-center">
                                                                Result
                                                            </div>
                                                        </div>

                                                        <div className="divide-y divide-primary/30 bg-white">
                                                            {completedBids.map(
                                                                (
                                                                    bid,
                                                                    index,
                                                                ) => {
                                                                    const statusInfo =
                                                                        getStatusInfo(
                                                                            bid.myBidStatus,
                                                                        );
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                bid.id
                                                                            }
                                                                            className="grid grid-cols-12 items-center hover:bg-secondary/30 transition-colors duration-200"
                                                                            style={{
                                                                                animation:
                                                                                    isVisible
                                                                                        ? `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                                                                                        : 'none',
                                                                            }}
                                                                        >
                                                                            <div className="col-span-5 px-6 py-4 flex items-center gap-4">
                                                                                <Link
                                                                                    href={`/auction/${bid.id}`}
                                                                                    className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 shadow-sm flex-shrink-0 group"
                                                                                >
                                                                                    <Image
                                                                                        src={
                                                                                            bid.mainImage
                                                                                        }
                                                                                        alt={
                                                                                            bid.name
                                                                                        }
                                                                                        fill
                                                                                        className="object-cover group-hover:scale-105 transition-transform"
                                                                                    />
                                                                                </Link>
                                                                                <div>
                                                                                    <Link
                                                                                        href={`/auction/${bid.id}`}
                                                                                    >
                                                                                        <h3
                                                                                            className="font-medium text-neutral-900 line-clamp-1 hover:text-dark-primary transition-colors"
                                                                                            title={
                                                                                                bid.name
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                bid.name
                                                                                            }
                                                                                        </h3>
                                                                                    </Link>
                                                                                    <div className="flex flex-col gap-1 mt-1">
                                                                                        <p className="text-xs text-neutral-500">
                                                                                            Seller:{' '}
                                                                                            {
                                                                                                bid
                                                                                                    .seller
                                                                                                    .fullname
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-span-2 px-6 py-4 text-center font-bold text-dark-primary">
                                                                                {formatCurrency(
                                                                                    bid.currentPrice,
                                                                                )}
                                                                            </div>
                                                                            <div className="col-span-2 px-6 py-4 text-center text-sm text-neutral-600">
                                                                                {new Date(
                                                                                    bid.endDate,
                                                                                ).toLocaleDateString(
                                                                                    'en-GB',
                                                                                )}
                                                                            </div>
                                                                            <div className="col-span-1 px-6 py-4 text-center text-neutral-600 font-medium">
                                                                                {
                                                                                    bid.bidCount
                                                                                }
                                                                            </div>
                                                                            <div className="col-span-2 px-6 py-4 flex justify-center">
                                                                                <span
                                                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}
                                                                                >
                                                                                    {
                                                                                        statusInfo.icon
                                                                                    }
                                                                                    {
                                                                                        statusInfo.label
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
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
