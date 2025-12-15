'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    ThumbsUp,
    ThumbsDown,
    X,
    Package,
    Gavel,
    Clock,
    Plus,
    ArrowRight,
    Grid3X3,
} from 'lucide-react';
import Button from '@/modules/shared/components/ui/Button';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import Image from 'next/image';
import Link from 'next/link';
import { productsApi, BackendProduct } from '@/lib/api/products';
import { usersApi } from '@/lib/api/users';

interface ActiveAuction {
    id: string;
    title: string;
    image: string;
    currentPrice: number;
    endTime: string;
    totalBids: number;
}

interface CompletedAuction {
    id: string;
    title: string;
    image: string;
    finalPrice: number;
    sellerName: string;
    sellerAvatar: string;
    sellerId: string;
    sellerRating: number;
    dateWon: string;
}

export default function SellerDashboard() {
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>(
        'active',
    );
    const [activeAuctions, setActiveAuctions] = useState<ActiveAuction[]>([]);
    const [completedAuctions, setCompletedAuctions] = useState<
        CompletedAuction[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [currentBidder, setCurrentBidder] = useState<{
        id: string;
        name: string;
        avatar: string;
        productId: string;
    }>({ id: '', name: '', avatar: '', productId: '' });
    const [isLiked, setIsLiked] = useState<boolean | null>(null);
    const [comment, setComment] = useState('');

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

    const fetchSellerProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const [activeProducts, completedProducts] = await Promise.all([
                productsApi.getSellerProducts(),
                productsApi.getSellerCompletedProducts(),
            ]);

            setActiveAuctions(
                activeProducts.map((p: BackendProduct) => ({
                    id: p.id,
                    title: p.name,
                    image: p.mainImage,
                    currentPrice: p.currentPrice,
                    endTime: getTimeLeft(p.endDate),
                    totalBids: p.bidCount,
                })),
            );

            setCompletedAuctions(
                completedProducts.map((p: BackendProduct) => ({
                    id: p.id,
                    title: p.name,
                    image: p.mainImage,
                    finalPrice: p.currentPrice,
                    sellerName: p.currentBidder?.fullname || 'Unknown Bidder',
                    sellerAvatar: '/avatars/default.jpg',
                    sellerId: p.currentBidder?.id || '',
                    sellerRating: 5.0,
                    dateWon: new Date(p.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    }),
                })),
            );
        } catch (error) {
            console.error('Failed to fetch seller products:', error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    useEffect(() => {
        void fetchSellerProducts();
    }, [fetchSellerProducts]);

    const openRatingPopup = (
        bidderId: string,
        bidderName: string,
        bidderAvatar: string,
        productId: string,
    ) => {
        setCurrentBidder({
            id: bidderId,
            name: bidderName,
            avatar: bidderAvatar,
            productId,
        });
        setShowRatingPopup(true);
        setIsLiked(null);
        setComment('');
    };

    const closeRatingPopup = () => {
        setShowRatingPopup(false);
        setCurrentBidder({ id: '', name: '', avatar: '', productId: '' });
        setIsLiked(null);
        setComment('');
    };

    const handleSubmitRating = async () => {
        if (isLiked === null) return;

        try {
            await usersApi.createRating({
                ratedUserId: currentBidder.id,
                productId: currentBidder.productId,
                isPositive: isLiked,
                comment: comment,
            });
            closeRatingPopup();
            alert('Rating submitted successfully!');
        } catch (error) {
            console.error('Failed to submit rating:', error);
            alert('Failed to submit rating. Please try again.');
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
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-primary gap-4">
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-dark-primary rounded-full"></div>
                                    <h1 className="font-heading text-3xl font-semibold text-neutral-900 flex items-center gap-3">
                                        Seller Dashboard
                                        <Grid3X3 className="w-7 h-7 text-dark-primary" />
                                    </h1>
                                    <p className="text-neutral-500 mt-1">
                                        Manage your listings and completed sales
                                    </p>
                                </div>
                                <Link href="/create-auction">
                                    <Button
                                        variant="muted"
                                        className="rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create New Auction
                                    </Button>
                                </Link>
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
                                    Active Listings
                                    <span
                                        className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'active' ? 'bg-primary/30 text-dark-primary' : 'bg-neutral-200 text-neutral-600'}`}
                                    >
                                        {activeAuctions.length}
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
                                    Completed Auctions
                                    <span
                                        className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'completed' ? 'bg-primary/30 text-dark-primary' : 'bg-neutral-200 text-neutral-600'}`}
                                    >
                                        {completedAuctions.length}
                                    </span>
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-12 h-12 rounded-xl border-4 border-primary border-t-dark-primary animate-spin"></div>
                                    <p className="mt-4 text-neutral-500 animate-pulse">
                                        Loading your listings...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'active' && (
                                        <div className="space-y-4">
                                            {activeAuctions.length === 0 ? (
                                                <div className="text-center py-16 px-4 border-2 border-dashed border-primary/30 rounded-xl bg-secondary/20">
                                                    <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-xl flex items-center justify-center shadow-sm border border-primary/20">
                                                        <Package className="w-10 h-10 text-dark-primary/50" />
                                                    </div>
                                                    <h3 className="font-heading text-xl font-medium text-neutral-900 mb-2">
                                                        No active listings
                                                    </h3>
                                                    <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                                                        You don&apos;t have any
                                                        active auctions at the
                                                        moment.
                                                    </p>
                                                    <Link href="/create-auction">
                                                        <Button variant="muted">
                                                            Start Selling
                                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="overflow-hidden rounded-xl border border-primary/50 shadow-sm">
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
                                                            Action
                                                        </div>
                                                    </div>

                                                    <div className="divide-y divide-primary/30 bg-white">
                                                        {activeAuctions.map(
                                                            (
                                                                auction,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        auction.id
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
                                                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 shadow-sm flex-shrink-0">
                                                                            <Image
                                                                                src={
                                                                                    auction.image
                                                                                }
                                                                                alt={
                                                                                    auction.title
                                                                                }
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <h3
                                                                                className="font-medium text-neutral-900 line-clamp-1"
                                                                                title={
                                                                                    auction.title
                                                                                }
                                                                            >
                                                                                {
                                                                                    auction.title
                                                                                }
                                                                            </h3>
                                                                            <p className="text-xs text-neutral-500 mt-1">
                                                                                ID:{' '}
                                                                                {auction.id.substring(
                                                                                    0,
                                                                                    8,
                                                                                )}
                                                                                ...
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-span-2 px-6 py-4 text-center font-medium text-dark-primary">
                                                                        {formatCurrency(
                                                                            auction.currentPrice,
                                                                        )}
                                                                    </div>
                                                                    <div className="col-span-2 px-6 py-4 text-center">
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                                                                            <Clock className="w-3 h-3" />
                                                                            {
                                                                                auction.endTime
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-span-1 px-6 py-4 text-center text-neutral-600 font-medium">
                                                                        {
                                                                            auction.totalBids
                                                                        }
                                                                    </div>
                                                                    <div className="col-span-2 px-6 py-4 flex justify-center">
                                                                        <Link
                                                                            href={`/auction/${auction.id}`}
                                                                        >
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="rounded-xl hover:bg-primary/20 hover:text-dark-primary hover:border-dark-primary/50"
                                                                            >
                                                                                View
                                                                            </Button>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'completed' && (
                                        <div className="space-y-4">
                                            {completedAuctions.length === 0 ? (
                                                <div className="text-center py-16 px-4 border-2 border-dashed border-primary/30 rounded-xl bg-secondary/20">
                                                    <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-xl flex items-center justify-center shadow-sm border border-primary/20">
                                                        <Gavel className="w-10 h-10 text-dark-primary/50" />
                                                    </div>
                                                    <h3 className="font-heading text-xl font-medium text-neutral-900 mb-2">
                                                        No completed auctions
                                                    </h3>
                                                    <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                                                        Your completed auctions
                                                        will appear here once
                                                        they finish.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="overflow-hidden rounded-xl border border-primary/50 shadow-sm">
                                                    <div className="grid grid-cols-12 bg-secondary border-b border-primary/50 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                                        <div className="col-span-4 px-6 py-4">
                                                            Product
                                                        </div>
                                                        <div className="col-span-2 px-6 py-4 text-center">
                                                            Final Price
                                                        </div>
                                                        <div className="col-span-3 px-6 py-4 text-center">
                                                            Winner
                                                        </div>
                                                        <div className="col-span-2 px-6 py-4 text-center">
                                                            Date
                                                        </div>
                                                        <div className="col-span-1 px-6 py-4 text-center">
                                                            Action
                                                        </div>
                                                    </div>

                                                    <div className="divide-y divide-primary/30 bg-white">
                                                        {completedAuctions.map(
                                                            (
                                                                auction,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        auction.id
                                                                    }
                                                                    className="grid grid-cols-12 items-center hover:bg-secondary/30 transition-colors duration-200"
                                                                    style={{
                                                                        animation:
                                                                            isVisible
                                                                                ? `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                                                                                : 'none',
                                                                    }}
                                                                >
                                                                    <div className="col-span-4 px-6 py-4 flex items-center gap-4">
                                                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 shadow-sm flex-shrink-0">
                                                                            <Image
                                                                                src={
                                                                                    auction.image
                                                                                }
                                                                                alt={
                                                                                    auction.title
                                                                                }
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <h3
                                                                                className="font-medium text-neutral-900 line-clamp-1"
                                                                                title={
                                                                                    auction.title
                                                                                }
                                                                            >
                                                                                {
                                                                                    auction.title
                                                                                }
                                                                            </h3>
                                                                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                                                                                Sold
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-span-2 px-6 py-4 text-center font-bold text-dark-primary">
                                                                        {formatCurrency(
                                                                            auction.finalPrice,
                                                                        )}
                                                                    </div>
                                                                    <div className="col-span-3 px-6 py-4 flex justify-center">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-200">
                                                                                <Image
                                                                                    src={
                                                                                        auction.sellerAvatar
                                                                                    }
                                                                                    alt={
                                                                                        auction.sellerName
                                                                                    }
                                                                                    fill
                                                                                    className="object-cover"
                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="text-sm font-medium text-neutral-700 truncate max-w-[100px]"
                                                                                title={
                                                                                    auction.sellerName
                                                                                }
                                                                            >
                                                                                {
                                                                                    auction.sellerName
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-span-2 px-6 py-4 text-center text-sm text-neutral-600">
                                                                        {
                                                                            auction.dateWon
                                                                        }
                                                                    </div>
                                                                    <div className="col-span-1 px-6 py-4 flex justify-center">
                                                                        <Button
                                                                            variant="primary"
                                                                            size="sm"
                                                                            className="rounded-xl shadow-sm"
                                                                            onClick={() =>
                                                                                openRatingPopup(
                                                                                    auction.sellerId,
                                                                                    auction.sellerName,
                                                                                    auction.sellerAvatar,
                                                                                    auction.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            Rate
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
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

                {showRatingPopup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
                        <div className="bg-white p-6 max-w-md w-full mx-4 rounded-2xl shadow-xl border border-primary animate-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-center mb-6 border-b border-primary/30 pb-4">
                                <h3 className="text-xl font-bold text-dark-primary">
                                    Rate Bidder
                                </h3>
                                <button
                                    onClick={closeRatingPopup}
                                    className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-full hover:bg-neutral-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-6 p-3 bg-secondary/30 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-dark-primary font-bold border border-primary/20">
                                        {currentBidder.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">
                                            {currentBidder.name}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            Winning Bidder
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-neutral-700 mb-3">
                                    How was your experience with this bidder?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsLiked(true)}
                                        className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all flex-1 justify-center ${
                                            isLiked === true
                                                ? 'border-green-500 bg-green-50 text-green-700 shadow-sm ring-2 ring-green-500/20'
                                                : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:border-neutral-300'
                                        }`}
                                    >
                                        <ThumbsUp
                                            className={`w-5 h-5 ${
                                                isLiked === true
                                                    ? 'fill-green-500 text-green-500'
                                                    : 'text-neutral-400'
                                            }`}
                                        />
                                        <span className="font-medium">
                                            Positive
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => setIsLiked(false)}
                                        className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all flex-1 justify-center ${
                                            isLiked === false
                                                ? 'border-red-500 bg-red-50 text-red-700 shadow-sm ring-2 ring-red-500/20'
                                                : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:border-neutral-300'
                                        }`}
                                    >
                                        <ThumbsDown
                                            className={`w-5 h-5 ${
                                                isLiked === false
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-neutral-400'
                                            }`}
                                        />
                                        <span className="font-medium">
                                            Negative
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm font-medium text-neutral-700 mb-2">
                                    Comment (optional):
                                </p>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your comment about this transaction..."
                                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-2">
                                <Button
                                    variant="outline"
                                    onClick={closeRatingPopup}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => void handleSubmitRating()}
                                    disabled={isLiked === null}
                                    className="rounded-xl shadow-md"
                                >
                                    Submit Rating
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
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
