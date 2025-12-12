'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import Button from '@/modules/shared/components/ui/Button';
import RatingBadge from '@/modules/shared/components/ui/RatingBadge';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import Image from 'next/image';
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
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <UserSidebar />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <h1 className="font-heading text-5xl font-normal text-black mb-6">
                                Seller Dashboard
                            </h1>

                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('active')}
                                        className={`py-2 px-1 border-b-2 font-medium text-base ${
                                            activeTab === 'active'
                                                ? 'border-[#5F87C1] text-[#5F87C1]'
                                                : 'border-transparent text-dark-primary hover:text-gray-700 hover:border-primary'
                                        }`}
                                    >
                                        Active Listing
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveTab('completed')
                                        }
                                        className={`py-2 px-1 border-b-2 font-medium text-base ${
                                            activeTab === 'completed'
                                                ? 'border-[#5F87C1] text-[#5F87C1]'
                                                : 'border-transparent text-dark-primary hover:text-gray-700 hover:border-primary'
                                        }`}
                                    >
                                        Completed Auctions
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'active' && (
                                    <div>
                                        {activeAuctions.length === 0 ? (
                                            <div className="text-center py-16">
                                                <div className="text-6xl mb-4">
                                                    📦
                                                </div>
                                                <h3 className="font-heading text-2xl font-medium text-black mb-2">
                                                    No active listings
                                                </h3>
                                                <p className="text-neutral-600 font-body">
                                                    Create a new auction to
                                                    start selling.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="border border-gray-300">
                                                <div className="grid grid-cols-5 bg-secondary border-b border-primary">
                                                    <div className="px-6 py-4 text-left font-bold text-black border-r border-primary">
                                                        Product
                                                    </div>
                                                    <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                                        Current Price
                                                    </div>
                                                    <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                                        Ends In
                                                    </div>
                                                    <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                                        Total Bids
                                                    </div>
                                                    <div className="px-6 py-4 text-center font-bold text-black">
                                                        Action
                                                    </div>
                                                </div>

                                                {activeAuctions.map(
                                                    (auction, index) => (
                                                        <div
                                                            key={auction.id}
                                                            className={`grid grid-cols-5 ${
                                                                index <
                                                                activeAuctions.length -
                                                                    1
                                                                    ? 'border-b border-primary'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <div className="px-6 py-6 flex items-center border-r border-primary">
                                                                <div className="flex items-center space-x-4">
                                                                    <Image
                                                                        src={
                                                                            auction.image
                                                                        }
                                                                        alt={
                                                                            auction.title
                                                                        }
                                                                        width={
                                                                            64
                                                                        }
                                                                        height={
                                                                            64
                                                                        }
                                                                        className="w-16 h-16 rounded object-cover"
                                                                    />
                                                                    <div>
                                                                        <h3 className="font-medium text-black mb-1">
                                                                            {
                                                                                auction.title
                                                                            }
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="px-6 py-6 text-center font-bold text-black border-r border-primary flex items-center justify-center">
                                                                {formatCurrency(
                                                                    auction.currentPrice,
                                                                )}
                                                            </div>
                                                            <div className="px-6 py-6 text-center text-black border-r border-primary flex items-center justify-center">
                                                                {
                                                                    auction.endTime
                                                                }
                                                            </div>
                                                            <div className="px-6 py-6 text-center text-black border-r border-primary flex items-center justify-center">
                                                                {
                                                                    auction.totalBids
                                                                }
                                                            </div>
                                                            <div className="px-6 py-6 flex justify-center items-center">
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                >
                                                                    View Details
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'completed' && (
                                    <div>
                                        {completedAuctions.length === 0 ? (
                                            <div className="text-center py-16">
                                                <div className="text-6xl mb-4">
                                                    🏆
                                                </div>
                                                <h3 className="font-heading text-2xl font-medium text-black mb-2">
                                                    No completed auctions
                                                </h3>
                                                <p className="text-neutral-600 font-body">
                                                    Your completed auctions will
                                                    appear here.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="border border-primary">
                                                <div className="grid grid-cols-5 bg-secondary border-b border-primary">
                                                    <div className="px-6 py-4 text-left font-bold text-black border-r border-primary">
                                                        Product
                                                    </div>
                                                    <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                                        Final Price
                                                    </div>
                                                    <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                                        Winner
                                                    </div>
                                                    <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                                        Date Won
                                                    </div>
                                                    <div className="px-6 py-4 text-center font-bold text-black">
                                                        Action
                                                    </div>
                                                </div>
                                                {completedAuctions.map(
                                                    (auction, index) => (
                                                        <div
                                                            key={auction.id}
                                                            className={`grid grid-cols-5 ${
                                                                index <
                                                                completedAuctions.length -
                                                                    1
                                                                    ? 'border-b border-primary'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <div className="px-6 py-6 flex items-center border-r border-primary ">
                                                                <div className="flex items-center space-x-4">
                                                                    <Image
                                                                        src={
                                                                            auction.image
                                                                        }
                                                                        alt={
                                                                            auction.title
                                                                        }
                                                                        width={
                                                                            64
                                                                        }
                                                                        height={
                                                                            64
                                                                        }
                                                                        className="w-16 h-16 rounded object-cover"
                                                                    />
                                                                    <div>
                                                                        <h3 className="font-medium text-black mb-1">
                                                                            {
                                                                                auction.title
                                                                            }
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="px-6 py-6 text-center font-bold text-black border-r border-primary flex items-center justify-center">
                                                                {formatCurrency(
                                                                    auction.finalPrice,
                                                                )}
                                                            </div>
                                                            <div className="px-6 py-6 flex items-center justify-center border-r border-primary">
                                                                <RatingBadge
                                                                    rating={
                                                                        auction.sellerRating
                                                                    }
                                                                    totalReviews={
                                                                        12
                                                                    }
                                                                    sellerName={
                                                                        auction.sellerName
                                                                    }
                                                                    avatar={
                                                                        auction.sellerAvatar
                                                                    }
                                                                    size="sm"
                                                                />
                                                            </div>
                                                            <div className="px-6 py-6 text-center text-black border-r border-primary    flex items-center justify-center">
                                                                {
                                                                    auction.dateWon
                                                                }
                                                            </div>
                                                            <div className="px-1 py-6 flex justify-center items-center space-x-2">
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        openRatingPopup(
                                                                            auction.sellerId,
                                                                            auction.sellerName,
                                                                            auction.sellerAvatar,
                                                                            auction.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Rating
                                                                    Bidder
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-dark-primary">
                                Rate Bidder: {currentBidder.name}
                            </h3>
                            <button
                                onClick={closeRatingPopup}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                                How was your experience with this bidder?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsLiked(true)}
                                    className={`flex items-center gap-2 px-4 py-3 border transition-colors flex-1 justify-center ${
                                        isLiked === true
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                                >
                                    <ThumbsUp
                                        className={`w-5 h-5 ${
                                            isLiked === true
                                                ? 'fill-green-500 text-green-500'
                                                : 'text-gray-400'
                                        }`}
                                    />
                                    <span className="font-medium">Like</span>
                                </button>

                                <button
                                    onClick={() => setIsLiked(false)}
                                    className={`flex items-center gap-2 px-4 py-3 border transition-colors flex-1 justify-center ${
                                        isLiked === false
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                                >
                                    <ThumbsDown
                                        className={`w-5 h-5 ${
                                            isLiked === false
                                                ? 'fill-red-500 text-red-500'
                                                : 'text-gray-400'
                                        }`}
                                    />
                                    <span className="font-medium">Dislike</span>
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Comment (optional):
                            </p>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your comment about this bidder..."
                                className="w-full border border-gray-300 p-3 text-sm resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={closeRatingPopup}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => void handleSubmitRating()}
                                disabled={isLiked === null}
                            >
                                Submit Rating
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
