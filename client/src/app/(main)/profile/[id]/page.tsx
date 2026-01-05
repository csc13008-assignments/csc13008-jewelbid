'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ThumbsUp, ThumbsDown, Calendar, User } from 'lucide-react';
import { usersApi, BackendRating } from '@/lib/api/users';
import { Button } from '@/modules/shared/components/ui';

interface UserProfileData {
    id: string;
    fullname: string;
    profileImage?: string;
    positiveRatings: number;
    negativeRatings: number;
}

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [ratings, setRatings] = useState<BackendRating[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            setIsLoading(true);
            setError(null);

            try {
                const [statsResponse, ratingsResponse] = await Promise.all([
                    usersApi.getUserRatingStats(userId),
                    usersApi.getRatingsForUser(userId),
                ]);

                // Extract user info from ratings - the profile owner is toUser
                const firstRating = ratingsResponse[0];
                const userInfo = firstRating?.toUser;

                // Count positive/negative from actual ratings as backup
                const positiveCount = ratingsResponse.filter(
                    (r) => r.ratingType === 'Positive',
                ).length;
                const negativeCount = ratingsResponse.filter(
                    (r) => r.ratingType === 'Negative',
                ).length;

                setProfile({
                    id: userId,
                    fullname: userInfo?.fullname || 'User',
                    profileImage: userInfo?.profileImage,
                    // Backend returns { positive, negative, percentage }
                    positiveRatings: statsResponse.positive || positiveCount,
                    negativeRatings: statsResponse.negative || negativeCount,
                });

                setRatings(ratingsResponse);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Failed to load user profile');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchData();
    }, [userId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const totalRatings =
        (profile?.positiveRatings || 0) + (profile?.negativeRatings || 0);
    const positivePercentage =
        totalRatings > 0
            ? Math.round(((profile?.positiveRatings || 0) / totalRatings) * 100)
            : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-dark-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        User Not Found
                    </h1>
                    <p className="text-gray-600 mb-4">
                        {error || 'Could not load this profile.'}
                    </p>
                    <Button variant="outline" onClick={() => router.back()}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {profile.profileImage ? (
                                <Image
                                    src={profile.profileImage}
                                    alt={profile.fullname}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {profile.fullname}
                            </h1>

                            {/* Rating Summary */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                                    <ThumbsUp className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold text-green-700">
                                        {profile.positiveRatings}
                                    </span>
                                    <span className="text-green-600 text-sm">
                                        Positive
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                                    <ThumbsDown className="w-5 h-5 text-red-600" />
                                    <span className="font-semibold text-red-700">
                                        {profile.negativeRatings}
                                    </span>
                                    <span className="text-red-600 text-sm">
                                        Negative
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                                    <span className="font-semibold text-blue-700">
                                        {positivePercentage}%
                                    </span>
                                    <span className="text-blue-600 text-sm">
                                        Positive Rate
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings List */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Reviews ({ratings.length})
                    </h2>

                    {ratings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                No reviews yet for this user.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {ratings.map((rating) => (
                                <div
                                    key={rating.id}
                                    className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Reviewer Avatar */}
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                            {rating.fromUser?.profileImage ? (
                                                <Image
                                                    src={
                                                        rating.fromUser
                                                            .profileImage
                                                    }
                                                    alt={
                                                        rating.fromUser
                                                            ?.fullname ||
                                                        'Reviewer'
                                                    }
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-semibold text-gray-900">
                                                    {rating.fromUser
                                                        ?.fullname ||
                                                        'Anonymous'}
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                        rating.ratingType ===
                                                        'Positive'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {rating.ratingType ===
                                                    'Positive' ? (
                                                        <span className="flex items-center gap-1">
                                                            <ThumbsUp className="w-3 h-3" />{' '}
                                                            Positive
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1">
                                                            <ThumbsDown className="w-3 h-3" />{' '}
                                                            Negative
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            {rating.comment && (
                                                <p className="text-gray-700 mb-2">
                                                    {rating.comment}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(
                                                        rating.created_at,
                                                    )}
                                                </span>
                                                {rating.product && (
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/auction/${rating.product?.id}`,
                                                            )
                                                        }
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        View Product
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
