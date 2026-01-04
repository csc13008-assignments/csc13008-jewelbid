'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    ThumbsUp,
    ThumbsDown,
    Star,
    Award,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';
import { RatingBadge, Button } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { usersApi } from '@/lib/api/users';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';

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
    const [isVisible, setIsVisible] = useState(false);
    const [ratingData, setRatingData] = useState({
        reputationScore: 0,
        positiveCount: 0,
        totalRatings: 0,
    });

    const { user: currentUser } = useAuthStore();

    const fetchMyRatings = useCallback(async () => {
        if (!currentUser) return;

        setIsLoading(true);
        try {
            const data = await usersApi.getMyRatings();

            const positiveCount = data.filter(
                (r) => r.ratingType === 'Positive',
            ).length;
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

            const displayRatings: RatingDisplay[] = data.map((rating) => {
                // Calculate rater's reputation as a percentage (0-1 scale)
                const raterTotalReviews =
                    (rating.fromUser?.positiveRatings || 0) +
                    (rating.fromUser?.negativeRatings || 0);
                const raterRating =
                    raterTotalReviews > 0
                        ? (rating.fromUser?.positiveRatings || 0) /
                          raterTotalReviews
                        : 1.0;

                return {
                    id: rating.id,
                    sellerName: rating.fromUser?.fullname || 'Unknown User',
                    avatar:
                        rating.fromUser?.profileImage || '/avatars/default.jpg',
                    rating: raterRating,
                    totalReviews: raterTotalReviews,
                    isPositive: rating.ratingType === 'Positive',
                    comment: rating.comment,
                };
            });

            setRatings(displayRatings);
        } catch (error) {
            console.error('Failed to fetch ratings:', error);
            setRatings([]);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsVisible(true), 100);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            void fetchMyRatings();
        }
    }, [fetchMyRatings, currentUser]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 50) return 'text-amber-600';
        return 'text-red-600';
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
                                        My Ratings
                                        <Star className="w-7 h-7 text-dark-primary fill-dark-primary" />
                                    </h1>
                                    <p className="text-neutral-500 mt-1">
                                        Feedback from your transactions
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl border border-dark-primary/30">
                                    <Award className="w-4 h-4 text-dark-primary" />
                                    <span className="text-sm font-medium text-neutral-700">
                                        {ratingData.totalRatings} ratings
                                    </span>
                                </div>
                            </div>

                            {/* Reputation Score Card */}
                            <div
                                className={`mb-8 p-6 bg-primary rounded-xl border border-dark-primary/20 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                                style={{ transitionDelay: '0.2s' }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-dark-primary font-medium uppercase tracking-wider mb-2">
                                            <TrendingUp className="w-4 h-4" />
                                            Reputation Score
                                        </div>
                                        <div className="flex items-baseline gap-3">
                                            <span
                                                className={`text-4xl font-bold ${getScoreColor(ratingData.reputationScore)}`}
                                            >
                                                {ratingData.reputationScore}%
                                            </span>
                                            <span className="text-neutral-500">
                                                Positive (
                                                {ratingData.positiveCount}+ /{' '}
                                                {ratingData.totalRatings -
                                                    ratingData.positiveCount}
                                                -)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="w-20 h-20 relative">
                                            <svg className="w-20 h-20 transform -rotate-90">
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="35"
                                                    stroke="currentColor"
                                                    strokeWidth="6"
                                                    fill="none"
                                                    className="text-white"
                                                />
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="35"
                                                    stroke="currentColor"
                                                    strokeWidth="6"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${ratingData.reputationScore * 2.2} 220`}
                                                    className="text-dark-primary transition-all duration-1000"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Star className="w-6 h-6 text-dark-primary fill-dark-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-12 h-12 rounded-xl border-4 border-primary border-t-dark-primary animate-spin"></div>
                                    <p className="mt-4 text-neutral-500 animate-pulse">
                                        Loading your ratings...
                                    </p>
                                </div>
                            ) : ratings.length === 0 ? (
                                <div className="text-center py-16 px-4">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-xl flex items-center justify-center shadow-inner">
                                        <Star className="w-10 h-10 text-dark-primary" />
                                    </div>
                                    <h3 className="font-heading text-xl font-medium text-neutral-900 mb-2">
                                        No ratings yet
                                    </h3>
                                    <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                                        Complete transactions to receive ratings
                                        from other users.
                                    </p>
                                    <Link href="/search-result">
                                        <Button variant="muted">
                                            Start Trading
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {ratings.map((rating, index) => (
                                        <div
                                            key={rating.id}
                                            className="p-5 bg-secondary rounded-xl border border-primary hover:border-dark-primary hover:shadow-md transition-all duration-300"
                                            style={{
                                                animation: isVisible
                                                    ? `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                                    : 'none',
                                            }}
                                        >
                                            <div className="flex items-start gap-4">
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
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="font-medium text-neutral-900">
                                                            {rating.sellerName}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                                                                rating.isPositive
                                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                                            }`}
                                                        >
                                                            {rating.isPositive ? (
                                                                <ThumbsUp className="w-3.5 h-3.5" />
                                                            ) : (
                                                                <ThumbsDown className="w-3.5 h-3.5" />
                                                            )}
                                                            {rating.isPositive
                                                                ? 'Positive'
                                                                : 'Negative'}
                                                        </span>
                                                    </div>
                                                    {rating.comment && (
                                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                                            &quot;
                                                            {rating.comment}
                                                            &quot;
                                                        </p>
                                                    )}
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
