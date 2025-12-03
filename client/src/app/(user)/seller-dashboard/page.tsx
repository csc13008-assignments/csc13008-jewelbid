'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import Button from '@/modules/shared/components/ui/Button';
import RatingBadge from '@/modules/shared/components/ui/RatingBadge';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import Image from 'next/image';
import { mockActiveAuctions, mockCompletedAuctions } from '@/lib/mockData';

export default function SellerDashboard() {
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>(
        'active',
    );
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [currentBidder, setCurrentBidder] = useState<{
        name: string;
        avatar: string;
    }>({ name: '', avatar: '' });
    const [isLiked, setIsLiked] = useState<boolean | null>(null); // null = not selected, true = liked, false = disliked
    const [comment, setComment] = useState('');

    const openRatingPopup = (bidderName: string, bidderAvatar: string) => {
        setCurrentBidder({ name: bidderName, avatar: bidderAvatar });
        setShowRatingPopup(true);
        setIsLiked(null);
        setComment('');
    };

    const closeRatingPopup = () => {
        setShowRatingPopup(false);
        setCurrentBidder({ name: '', avatar: '' });
        setIsLiked(null);
        setComment('');
    };

    const handleSubmitRating = () => {
        console.log('Bidder rating submitted:', {
            bidder: currentBidder.name,
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
                                                ? 'border-blue-500 text-blue-600'
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
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-dark-primary hover:text-gray-700 hover:border-primary'
                                        }`}
                                    >
                                        Completed Auctions
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {activeTab === 'active' && (
                            <div>
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

                                    {mockActiveAuctions.map(
                                        (auction, index) => (
                                            <div
                                                key={auction.id}
                                                className={`grid grid-cols-5 ${
                                                    index <
                                                    mockActiveAuctions.length -
                                                        1
                                                        ? 'border-b border-primary'
                                                        : ''
                                                }`}
                                            >
                                                <div className="px-6 py-6 flex items-center border-r border-primary">
                                                    <div className="flex items-center space-x-4">
                                                        <Image
                                                            src={auction.image}
                                                            alt={auction.title}
                                                            width={64}
                                                            height={64}
                                                            className="w-16 h-16 rounded object-cover"
                                                        />
                                                        <div>
                                                            <h3 className="font-medium text-black mb-1">
                                                                {auction.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-6 py-6 text-center font-bold text-black border-r border-primary flex items-center justify-center">
                                                    ${auction.currentPrice}
                                                </div>
                                                <div className="px-6 py-6 text-center text-black border-r border-primary flex items-center justify-center">
                                                    {auction.endTime}
                                                </div>
                                                <div className="px-6 py-6 text-center text-black border-r border-primary flex items-center justify-center">
                                                    {auction.totalBids}
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
                            </div>
                        )}

                        {activeTab === 'completed' && (
                            <div>
                                <div className="border border-primary">
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
                                    {mockCompletedAuctions.map(
                                        (auction, index) => (
                                            <div
                                                key={auction.id}
                                                className={`grid grid-cols-5 ${
                                                    index <
                                                    mockCompletedAuctions.length -
                                                        1
                                                        ? 'border-b border-primary'
                                                        : ''
                                                }`}
                                            >
                                                <div className="px-6 py-6 flex items-center border-r border-primary ">
                                                    <div className="flex items-center space-x-4">
                                                        <Image
                                                            src={auction.image}
                                                            alt={auction.title}
                                                            width={64}
                                                            height={64}
                                                            className="w-16 h-16 rounded object-cover"
                                                        />
                                                        <div>
                                                            <h3 className="font-medium text-black mb-1">
                                                                {auction.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-6 py-6 text-center font-bold text-black border-r border-primary flex items-center justify-center">
                                                    ${auction.finalPrice}
                                                </div>
                                                <div className="px-6 py-6 flex items-center justify-center border-r border-primary">
                                                    <RatingBadge
                                                        rating={
                                                            auction.sellerRating
                                                        }
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
                                                <div className="px-6 py-6 text-center text-black border-r border-primary    flex items-center justify-center">
                                                    {auction.dateWon}
                                                </div>
                                                <div className="px-1 py-6 flex justify-center items-center space-x-2">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() =>
                                                            openRatingPopup(
                                                                auction.sellerName,
                                                                auction.sellerAvatar,
                                                            )
                                                        }
                                                    >
                                                        Rating Bidder
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-red-100 hover:bg-red-200 text-gray-700"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
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
