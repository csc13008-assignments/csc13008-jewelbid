import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RatingBadgeProps {
    rating: number;
    totalReviews: number;
    avatar?: string;
    sellerName?: string;
    className?: string;
    showAvatar?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'vertical' | 'horizontal';
    sellerTags?: string;
    objectsSold?: number;
    userId?: string; // User ID for linking to profile
    linkToProfile?: boolean; // Whether to make clickable
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
    rating,
    totalReviews,
    avatar,
    sellerName,
    className = '',
    showAvatar = true,
    size = 'md',
    variant = 'vertical',
    sellerTags,
    objectsSold,
    userId,
    linkToProfile = true,
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

    // Wrapper component - either Link or div based on linkToProfile and userId
    const Wrapper = ({
        children,
        className: wrapperClassName,
    }: {
        children: React.ReactNode;
        className?: string;
    }) => {
        if (linkToProfile && userId) {
            return (
                <Link
                    href={`/profile/${userId}`}
                    className={`${wrapperClassName} cursor-pointer hover:opacity-80 transition-opacity`}
                    title={`View ${sellerName || 'user'}'s profile`}
                >
                    {children}
                </Link>
            );
        }
        return <div className={wrapperClassName}>{children}</div>;
    };

    if (variant === 'vertical') {
        return (
            <Wrapper
                className={`flex flex-col items-center gap-2 ${className}`}
            >
                {sellerName && (
                    <div
                        className={`font-medium text-gray-700 ${classes.name} ${linkToProfile && userId ? 'hover:text-blue-600 hover:underline' : ''}`}
                    >
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
                        className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 ${totalReviews > 0 ? 'bg-[#5F87C1]' : 'bg-gray-400'} text-white ${classes.badge} rounded-full shadow-md whitespace-nowrap`}
                    >
                        {totalReviews > 0
                            ? `${Math.round(rating * 100)}% Positive`
                            : 'No reviews'}
                    </div>
                </div>

                {totalReviews > 0 && (
                    <div className={`mt-4 text-gray-600 ${classes.text}`}>
                        ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                    </div>
                )}
            </Wrapper>
        );
    }

    return (
        <Wrapper className={`flex items-center space-x-4 ${className}`}>
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
                    className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 ${totalReviews > 0 ? 'bg-[#5F87C1]' : 'bg-gray-400'} text-white ${classes.badge} rounded-full shadow-md whitespace-nowrap`}
                >
                    {totalReviews > 0
                        ? `${Math.round(rating * 100)}% Positive`
                        : 'No reviews'}
                </div>

                {totalReviews > 0 && (
                    <div
                        className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-gray-600 ${classes.text} text-center whitespace-nowrap`}
                    >
                        ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                    </div>
                )}
            </div>

            <div className="flex-1 ml-4">
                {sellerName && (
                    <div
                        className={`font-medium text-xl text-gray-900 mb-1 ${linkToProfile && userId ? 'hover:text-blue-600 hover:underline' : ''}`}
                    >
                        {sellerName}
                    </div>
                )}
                {sellerTags && (
                    <div className="text-md text-gray-600 italic mb-1">
                        {sellerTags}
                    </div>
                )}
                {objectsSold !== undefined && (
                    <div className="text-md text-gray-600">
                        {objectsSold} Object{objectsSold !== 1 ? 's' : ''} sold
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default RatingBadge;
