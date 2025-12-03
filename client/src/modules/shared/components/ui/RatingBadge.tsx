import React from 'react';
import Image from 'next/image';

interface RatingBadgeProps {
    rating: number;
    totalReviews: number;
    avatar?: string;
    sellerName?: string;
    className?: string;
    showAvatar?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
    rating,
    totalReviews,
    avatar,
    sellerName,
    className = '',
    showAvatar = true,
    size = 'md',
}) => {
    const sizeClasses = {
        sm: {
            avatar: 'w-8 h-8',
            badge: 'text-xs px-1.5 py-0.5',
            text: 'text-xs',
            name: 'text-xs',
        },
        md: {
            avatar: 'w-12 h-12',
            badge: 'text-xs px-2 py-0.5',
            text: 'text-xs',
            name: 'text-sm',
        },
        lg: {
            avatar: 'w-16 h-16',
            badge: 'text-sm px-3 py-1',
            text: 'text-sm',
            name: 'text-base',
        },
    };

    const classes = sizeClasses[size];

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            {sellerName && (
                <div className={`font-medium text-gray-700 ${classes.name}`}>
                    {sellerName}
                </div>
            )}

            <div className="relative inline-block">
                {showAvatar && (
                    <div
                        className={`${classes.avatar} bg-gray-200 rounded-full flex items-center justify-center overflow-hidden`}
                    >
                        {avatar ? (
                            <Image
                                src={avatar}
                                alt="User avatar"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-medium text-sm">
                                👤
                            </span>
                        )}
                    </div>
                )}

                <div
                    className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white ${classes.badge} rounded-full shadow-md whitespace-nowrap`}
                >
                    {Math.round((rating / 5) * 100)}% Positive
                </div>
            </div>

            <div className={`mt-4 text-gray-600 ${classes.text}`}>
                ({totalReviews} reviews)
            </div>
        </div>
    );
};

export default RatingBadge;
