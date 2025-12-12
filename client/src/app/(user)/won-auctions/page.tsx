'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { RatingBadge, Button } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { productsApi } from '@/lib/api/products';
import { usersApi } from '@/lib/api/users';

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
}

export default function WonAuctionsPage() {
    const [wonAuctions, setWonAuctions] = useState<WonAuction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
            const products = await productsApi.getProductsUserWon();

            const auctions: WonAuction[] = products.map((product) => ({
                id: product.id,
                product: product.name,
                productImage: product.mainImage,
                finalPrice: formatCurrency(product.currentPrice),
                sellerName: product.seller?.fullname || 'Unknown Seller',
                sellerAvatar:
                    product.seller?.profileImage || '/avatars/default.jpg',
                sellerId: product.seller?.id || '',
                dateWon: new Date(product.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
                action: 'Rate Seller',
            }));

            setWonAuctions(auctions);
        } catch (error) {
            console.error('Failed to fetch won auctions:', error);
            setWonAuctions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchWonAuctions();
    }, [fetchWonAuctions]);

    const openRatingPopup = (
        sellerId: string,
        sellerName: string,
        productId: string,
    ) => {
        setCurrentSeller({ id: sellerId, name: sellerName, productId });
        setShowRatingPopup(true);
        setIsLiked(null);
        setComment('');
    };

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
                        <div className="bg-white">
                            <h1 className="font-heading text-5xl font-normal text-black mb-8">
                                Won Auctions
                            </h1>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : wonAuctions.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">🏆</div>
                                    <h3 className="font-heading text-2xl font-medium text-black mb-2">
                                        No won auctions yet
                                    </h3>
                                    <p className="text-neutral-600 font-body">
                                        Keep bidding to win your first auction!
                                    </p>
                                </div>
                            ) : (
                                <div className="border border-gray-300">
                                    <div className="grid grid-cols-5 bg-secondary border-b border-primary">
                                        <div className="px-6 py-4 text-left font-bold text-black border-r border-primary">
                                            Product
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                            Final Price
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                            Seller Name
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                            Date Won
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black">
                                            Action
                                        </div>
                                    </div>

                                    {wonAuctions.map((auction, index) => (
                                        <div
                                            key={auction.id}
                                            className={`grid grid-cols-5 ${
                                                index < wonAuctions.length - 1
                                                    ? 'border-b border-primary'
                                                    : ''
                                            }`}
                                        >
                                            <div className="px-6 py-6 flex items-center border-r border-gray-300">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={
                                                            auction.productImage
                                                        }
                                                        alt={auction.product}
                                                        className="w-16 h-16 object-cover bg-gray-200"
                                                    />
                                                    <div>
                                                        <Link
                                                            href={`/auction/${auction.id}`}
                                                            className="font-medium text-black text-sm mb-1 hover:underline"
                                                        >
                                                            {auction.product}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-6 py-4 border-r border-primary text-center items-center justify-center flex">
                                                <span className="text-black font-bold">
                                                    {auction.finalPrice}
                                                </span>
                                            </div>

                                            <div className="px-6 py-4 border-r border-primary text-center">
                                                <div className="flex items-center justify-center">
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

                                            <div className="px-6 py-4 border-r border-primary text-center items-center justify-center flex">
                                                <span className="text-black">
                                                    {auction.dateWon}
                                                </span>
                                            </div>

                                            <div className="px-6 py-4 text-center items-center justify-center flex">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() =>
                                                        openRatingPopup(
                                                            auction.sellerId,
                                                            auction.sellerName,
                                                            auction.id,
                                                        )
                                                    }
                                                >
                                                    {auction.action}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showRatingPopup && (
                <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-dark-primary">
                                Rate Seller: {currentSeller.name}
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
                                How was your experience with this seller?
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
                                placeholder="Write your comment about this seller..."
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
