'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { RatingBadge, Button } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { mockWonAuctions } from '@/lib/mockData';

export default function WonAuctionsPage() {
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [currentSeller, setCurrentSeller] = useState<string>('');
    const [isLiked, setIsLiked] = useState<boolean | null>(null); // null = not selected, true = liked, false = disliked
    const [comment, setComment] = useState('');

    const openRatingPopup = (sellerName: string) => {
        setCurrentSeller(sellerName);
        setShowRatingPopup(true);
        setIsLiked(null);
        setComment('');
    };

    const closeRatingPopup = () => {
        setShowRatingPopup(false);
        setCurrentSeller('');
        setIsLiked(null);
        setComment('');
    };

    const handleSubmitRating = () => {
        console.log('Rating submitted:', {
            seller: currentSeller,
            liked: isLiked,
            comment,
        });
        closeRatingPopup();
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

                                {mockWonAuctions.map((auction, index) => (
                                    <div
                                        key={auction.id}
                                        className={`grid grid-cols-5 ${
                                            index < mockWonAuctions.length - 1
                                                ? 'border-b border-primary'
                                                : ''
                                        }`}
                                    >
                                        <div className="px-6 py-6 flex items-center border-r border-gray-300">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src="/sample.png"
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
                                                        auction.sellerName,
                                                    )
                                                }
                                            >
                                                {auction.action}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showRatingPopup && (
                <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-dark-primary">
                                Rate Seller: {currentSeller}
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
                                onClick={handleSubmitRating}
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
