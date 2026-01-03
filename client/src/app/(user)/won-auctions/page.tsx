'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ThumbsUp,
    ThumbsDown,
    X,
    Trophy,
    Calendar,
    ArrowRight,
} from 'lucide-react';
import { RatingBadge, Button } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { productsApi } from '@/lib/api/products';
import { usersApi } from '@/lib/api/users';
import { ordersApi } from '@/lib/api/orders';
import toast from '@/lib/toast';

interface WonAuction {
    id: string;
    product: string;
    productImage: string;
    finalPrice: string;
    sellerName: string;
    sellerAvatar: string;
    sellerId: string;
    dateWon: string;
    action: string;
    orderStatus?: string;
}

export default function WonAuctionsPage() {
    const [wonAuctions, setWonAuctions] = useState<WonAuction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [currentSeller, setCurrentSeller] = useState<{
        id: string;
        name: string;
        productId: string;
    }>({ id: '', name: '', productId: '' });
    const [isLiked, setIsLiked] = useState<boolean | null>(null);
    const [comment, setComment] = useState('');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
    };

    const fetchWonAuctions = useCallback(async () => {
        setIsLoading(true);
        try {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

            // Fetch both won products and products user is bidding on
            const [wonProducts, biddingProducts] = await Promise.all([
                productsApi.getProductsUserWon(),
                productsApi.getProductsUserIsBidding(),
            ]);

            // Combine and filter
            const allWonProductsMap = new Map();

            // 1. Add explicitly won products
            wonProducts.forEach((product) => {
                allWonProductsMap.set(product.id, product);
            });

            // 2. checking bidding products for "Buy Now" wins or completed auctions
            biddingProducts.forEach((product) => {
                const now = new Date();
                const endDate = new Date(product.endDate);
                const isEnded =
                    endDate.getTime() <= now.getTime() ||
                    product.status === 'ended';
                const isWinning = product.currentBidder?.id === userId;

                if (isEnded && isWinning) {
                    allWonProductsMap.set(product.id, product);
                }
            });

            const mergedProducts = Array.from(allWonProductsMap.values());

            // Fetch order status for each product
            const auctionsWithOrders = await Promise.all(
                mergedProducts.map(async (product) => {
                    const order = await ordersApi.getOrderByProduct(product.id);
                    return {
                        id: product.id,
                        product: product.name,
                        productImage: product.mainImage,
                        finalPrice: formatCurrency(product.currentPrice),
                        sellerName:
                            product.seller?.fullname || 'Unknown Seller',
                        sellerAvatar:
                            product.seller?.profileImage ||
                            '/avatars/default.jpg',
                        sellerId: product.seller?.id || '',
                        dateWon: new Date(product.endDate).toLocaleDateString(
                            'en-US',
                            {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            },
                        ),
                        action: 'View Order',
                        orderStatus: order?.status || 'Pending',
                    };
                }),
            );

            // Sort by date (newest first)
            auctionsWithOrders.sort(
                (a, b) =>
                    new Date(b.dateWon).getTime() -
                    new Date(a.dateWon).getTime(),
            );

            setWonAuctions(auctionsWithOrders);
        } catch (error) {
            console.error('Failed to fetch won auctions:', error);
            setWonAuctions([]);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    useEffect(() => {
        void fetchWonAuctions();
    }, [fetchWonAuctions]);

    const closeRatingPopup = () => {
        setShowRatingPopup(false);
        setCurrentSeller({ id: '', name: '', productId: '' });
        setIsLiked(null);
        setComment('');
    };

    const handleSubmitRating = async () => {
        if (isLiked === null) return;

        try {
            await usersApi.createRating({
                ratedUserId: currentSeller.id,
                productId: currentSeller.productId,
                isPositive: isLiked,
                comment: comment,
            });
            closeRatingPopup();
            toast.success('Rating submitted successfully!');
        } catch (error) {
            console.error('Failed to submit rating:', error);
            toast.error('Failed to submit rating. Please try again.');
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
                                        Won Auctions
                                        <Trophy className="w-7 h-7 text-dark-primary" />
                                    </h1>
                                    <p className="text-neutral-500 mt-1">
                                        Your winning moments and achievements
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl border border-dark-primary/30">
                                    <Trophy className="w-4 h-4 text-dark-primary" />
                                    <span className="text-sm font-medium text-neutral-700">
                                        {wonAuctions.length} wins
                                    </span>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-12 h-12 rounded-xl border-4 border-primary border-t-dark-primary animate-spin"></div>
                                    <p className="mt-4 text-neutral-500 animate-pulse">
                                        Loading your victories...
                                    </p>
                                </div>
                            ) : wonAuctions.length === 0 ? (
                                <div className="text-center py-16 px-4">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-xl flex items-center justify-center shadow-inner">
                                        <Trophy className="w-10 h-10 text-dark-primary" />
                                    </div>
                                    <h3 className="font-heading text-xl font-medium text-neutral-900 mb-2">
                                        No won auctions yet
                                    </h3>
                                    <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                                        Keep bidding to win your first auction!
                                    </p>
                                    <Link href="/search-result">
                                        <Button variant="muted">
                                            Start Bidding
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
                                            Final Price
                                        </div>
                                        <div className="col-span-2 px-4 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                                            Seller
                                        </div>
                                        <div className="col-span-2 px-4 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                                            Date Won
                                        </div>
                                        <div className="col-span-2 px-4 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                                            Action
                                        </div>
                                    </div>

                                    {/* Table Body */}
                                    {wonAuctions.map((auction, index) => (
                                        <div
                                            key={auction.id}
                                            className={`grid grid-cols-12 items-center hover:bg-secondary transition-all duration-300 ${
                                                index < wonAuctions.length - 1
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
                                                    href={`/auction/${auction.id}`}
                                                    className="flex items-center gap-4 group"
                                                >
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-primary flex-shrink-0 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                                                            <Image
                                                                src={
                                                                    auction.productImage
                                                                }
                                                                alt={
                                                                    auction.product
                                                                }
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-dark-primary rounded-xl flex items-center justify-center shadow-sm">
                                                            <Trophy className="w-3 h-3 text-white" />
                                                        </div>
                                                    </div>
                                                    <span className="font-medium text-neutral-900 group-hover:text-dark-primary transition-colors line-clamp-2">
                                                        {auction.product}
                                                    </span>
                                                </Link>
                                            </div>
                                            <div className="col-span-2 px-4 py-5 text-center">
                                                <span className="font-bold text-neutral-900">
                                                    {auction.finalPrice}
                                                </span>
                                            </div>
                                            <div className="col-span-2 px-4 py-5">
                                                <div className="flex justify-center">
                                                    <RatingBadge
                                                        rating={5.0}
                                                        totalReviews={12}
                                                        sellerName={
                                                            auction.sellerName
                                                        }
                                                        avatar={
                                                            auction.sellerAvatar
                                                        }
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2 px-4 py-5 text-center">
                                                <div className="inline-flex items-center gap-1.5 text-neutral-600 bg-primary px-3 py-1.5 rounded-xl">
                                                    <Calendar className="w-4 h-4 text-dark-primary" />
                                                    <span className="text-sm">
                                                        {auction.dateWon}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 px-4 py-5 text-center">
                                                <div className="flex flex-col gap-2 items-center">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            auction.orderStatus ===
                                                            'Completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : auction.orderStatus ===
                                                                    'Cancelled'
                                                                  ? 'bg-red-100 text-red-800'
                                                                  : auction.orderStatus ===
                                                                      'Pending Delivery Confirmation'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : auction.orderStatus ===
                                                                        'Pending Shipment'
                                                                      ? 'bg-yellow-100 text-yellow-800'
                                                                      : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                    >
                                                        {auction.orderStatus ||
                                                            'Pending'}
                                                    </span>
                                                    <Link
                                                        href={`/order/${auction.id}`}
                                                    >
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className="w-full text-xs"
                                                        >
                                                            View Order
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Popup */}
            {showRatingPopup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scaleIn border border-primary">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-neutral-900">
                                Rate Seller
                            </h3>
                            <button
                                onClick={closeRatingPopup}
                                className="text-neutral-400 hover:text-neutral-600 hover:bg-primary p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-neutral-600 mb-4">
                            How was your experience with{' '}
                            <span className="font-semibold text-neutral-900">
                                {currentSeller.name}
                            </span>
                            ?
                        </p>

                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setIsLiked(true)}
                                className={`flex-1 flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                                    isLiked === true
                                        ? 'border-green-500 bg-green-50 scale-105 shadow-lg'
                                        : 'border-primary hover:border-green-300 hover:bg-green-50/50'
                                }`}
                            >
                                <ThumbsUp
                                    className={`w-8 h-8 transition-colors ${
                                        isLiked === true
                                            ? 'text-green-500 fill-green-500'
                                            : 'text-neutral-400'
                                    }`}
                                />
                                <span
                                    className={`font-medium ${isLiked === true ? 'text-green-700' : 'text-neutral-600'}`}
                                >
                                    Positive
                                </span>
                            </button>

                            <button
                                onClick={() => setIsLiked(false)}
                                className={`flex-1 flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                                    isLiked === false
                                        ? 'border-red-500 bg-red-50 scale-105 shadow-lg'
                                        : 'border-primary hover:border-red-300 hover:bg-red-50/50'
                                }`}
                            >
                                <ThumbsDown
                                    className={`w-8 h-8 transition-colors ${
                                        isLiked === false
                                            ? 'text-red-500 fill-red-500'
                                            : 'text-neutral-400'
                                    }`}
                                />
                                <span
                                    className={`font-medium ${isLiked === false ? 'text-red-700' : 'text-neutral-600'}`}
                                >
                                    Negative
                                </span>
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Comment (optional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience..."
                                className="w-full border border-primary rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary transition-all"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={closeRatingPopup}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => void handleSubmitRating()}
                                disabled={isLiked === null}
                                className="flex-1 bg-dark-primary hover:shadow-lg transition-all duration-300"
                            >
                                Submit Rating
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
