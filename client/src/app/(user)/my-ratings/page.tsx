'use client';

import { ThumbsUp } from 'lucide-react';
import { RatingBadge } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { mockRatings } from '@/lib/mockData';

export default function MyRatingsPage() {
    const ratingData = {
        reputationScore: 75,
        positiveCount: 15,
        totalRatings: 5,
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
                                My Ratings
                            </h1>

                            <div className="mb-8 p-4 bg-secondary border border-primary">
                                <div className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">
                                        REPUTATION SCORE:
                                    </span>
                                </div>
                                <div className="text-2xl font-normal text-blue-600">
                                    {ratingData.reputationScore}% Positive (
                                    {ratingData.positiveCount}+/
                                    {ratingData.totalRatings} -)
                                </div>
                            </div>

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

                                {mockRatings.map((rating, index) => (
                                    <div
                                        key={rating.id}
                                        className={`grid grid-cols-3 ${
                                            index < mockRatings.length - 1
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
                                            <ThumbsUp className="w-6 h-6 text-gray-600" />
                                        </div>

                                        <div className="px-6 py-6 flex items-center">
                                            <span className="text-black text-base">
                                                {rating.comment}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
