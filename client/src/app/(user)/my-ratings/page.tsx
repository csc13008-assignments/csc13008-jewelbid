'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThumbsUp } from 'lucide-react';
import { RatingBadge } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { usersApi } from '@/lib/api/users';

interface RatingDisplay {
    id: string;
    sellerName: string;
    avatar: string;
    rating: number;
    totalReviews: number;
    isPositive: boolean;
    comment: string;
}

export default function MyRatingsPage() {
    const [ratings, setRatings] = useState<RatingDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ratingData, setRatingData] = useState({
        reputationScore: 0,
        positiveCount: 0,
        totalRatings: 0,
    });

    const fetchMyRatings = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await usersApi.getMyRatings();

            const positiveCount = data.filter((r) => r.isPositive).length;
            const totalRatings = data.length;
            const reputationScore =
                totalRatings > 0
                    ? Math.round((positiveCount / totalRatings) * 100)
                    : 0;

            setRatingData({
                reputationScore,
                positiveCount,
                totalRatings,
            });

            const displayRatings: RatingDisplay[] = data.map((rating) => ({
                id: rating.id,
                sellerName: rating.rater?.fullname || 'Unknown User',
                avatar: rating.rater?.profileImage || '/avatars/default.jpg',
                rating: 5.0,
                totalReviews: 0,
                isPositive: rating.isPositive,
                comment: rating.comment,
            }));

            setRatings(displayRatings);
        } catch (error) {
            console.error('Failed to fetch ratings:', error);
            setRatings([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchMyRatings();
    }, [fetchMyRatings]);

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
                                My Ratings
                            </h1>

                            <div className="mb-8 p-4 bg-secondary border border-primary">
                                <div className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">
                                        REPUTATION SCORE:
                                    </span>
                                </div>
                                <div className="text-2xl font-normal text-[#5F87C1]">
                                    {ratingData.reputationScore}% Positive (
                                    {ratingData.positiveCount}+/
                                    {ratingData.totalRatings -
                                        ratingData.positiveCount}{' '}
                                    -)
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : ratings.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">⭐</div>
                                    <h3 className="font-heading text-2xl font-medium text-black mb-2">
                                        No ratings yet
                                    </h3>
                                    <p className="text-neutral-600 font-body">
                                        Complete transactions to receive
                                        ratings.
                                    </p>
                                </div>
                            ) : (
                                <div className="border border-primary">
                                    <div className="grid grid-cols-3 bg-secondary border-b border-primary">
                                        <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                            Seller
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                            Ratings
                                        </div>
                                        <div className="px-6 py-4 text-center font-bold text-black">
                                            Comments
                                        </div>
                                    </div>

                                    {ratings.map((rating, index) => (
                                        <div
                                            key={rating.id}
                                            className={`grid grid-cols-3 ${
                                                index < ratings.length - 1
                                                    ? 'border-b border-primary'
                                                    : ''
                                            }`}
                                        >
                                            <div className="px-6 py-6 border-r border-primary">
                                                <div className="flex items-center justify-center h-full">
                                                    <RatingBadge
                                                        rating={rating.rating}
                                                        totalReviews={
                                                            rating.totalReviews
                                                        }
                                                        avatar={rating.avatar}
                                                        sellerName={
                                                            rating.sellerName
                                                        }
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="px-6 py-6 border-r border-primary flex items-center justify-center">
                                                <ThumbsUp
                                                    className={`w-6 h-6 ${rating.isPositive ? 'text-green-600' : 'text-gray-400'}`}
                                                />
                                            </div>

                                            <div className="px-6 py-6 flex items-center">
                                                <span className="text-black text-base">
                                                    {rating.comment}
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
