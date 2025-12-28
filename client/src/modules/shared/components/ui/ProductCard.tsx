'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, Calendar, Clock, Diamond } from 'lucide-react';
import { ProductCardProps, TimeRemaining } from '@/types';
import { cn } from '@/lib/utils';
import { useWatchlistStore } from '@/stores/watchlistStore';

const getTimeRemaining = (endDate: Date): TimeRemaining => {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
};

const isAuctionEnded = (endDate: Date): boolean => {
    return new Date().getTime() >= endDate.getTime();
};

// Threshold for considering an auction "new" (in days remaining)
// Auctions with more than this many days left are considered new
const NEW_AUCTION_DAYS = 3;

const isNew = (createdAt?: Date): boolean => {
    if (!createdAt) return false;
    const now = new Date();
    const created = new Date(createdAt);
    const daysSinceCreation =
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= NEW_AUCTION_DAYS;
};

const formatCurrency = (amount: number): string => {
    // Remove decimal places and format with dot separator, add VND suffix
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' VND';
};

const ProductCard: React.FC<ProductCardProps> = ({
    auction,
    onLike,
    className,
    variant = 'vertical',
}) => {
    const router = useRouter();
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } =
        useWatchlistStore();
    const [isLiked, setIsLiked] = useState(isInWatchlist(auction.id));
    const [likeCount, setLikeCount] = useState(auction.likeCount);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const timeRemaining = getTimeRemaining(auction.endDate);

    // Sync isLiked with watchlist store
    useEffect(() => {
        setIsLiked(isInWatchlist(auction.id));
    }, [isInWatchlist, auction.id]);

    // Find highest bidder
    const getHighestBidder = () => {
        if (auction.bids && auction.bids.length > 0) {
            const highestBid = auction.bids.reduce((highest, current) =>
                current.amount > highest.amount ? current : highest,
            );
            return highestBid.bidder;
        }
        return null;
    };

    const highestBidder = getHighestBidder();

    const handleLike = async () => {
        // Dynamic import useToast to avoid SSR issues
        await import('./Toast');

        // Check if user is logged in
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            // Can't use hook here, use event-based approach
            window.dispatchEvent(
                new CustomEvent('show-toast', {
                    detail: {
                        type: 'warning',
                        message: 'Please login to add to watchlist',
                    },
                }),
            );
            router.push('/signin');
            return;
        }

        if (isLikeLoading) return;
        setIsLikeLoading(true);

        const newLikedState = !isLiked;

        try {
            const { productsApi } = await import('@/lib/api/products');

            if (newLikedState) {
                await productsApi.addToWatchlist(auction.id);
                addToWatchlist(auction.id);
                setLikeCount((prev) => prev + 1);
                window.dispatchEvent(
                    new CustomEvent('show-toast', {
                        detail: {
                            type: 'success',
                            message: 'Added to favorites',
                        },
                    }),
                );
            } else {
                await productsApi.removeFromWatchlist(auction.id);
                removeFromWatchlist(auction.id);
                setLikeCount((prev) => Math.max(0, prev - 1));
                window.dispatchEvent(
                    new CustomEvent('show-toast', {
                        detail: {
                            type: 'info',
                            message: 'Removed from favorites',
                        },
                    }),
                );
            }

            setIsLiked(newLikedState);
            onLike?.(auction.id);
        } catch (error) {
            console.error('Failed to update watchlist:', error);
            window.dispatchEvent(
                new CustomEvent('show-toast', {
                    detail: {
                        type: 'error',
                        message: 'Failed to update favorites',
                    },
                }),
            );
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleCardClick = () => {
        router.push(`/auction/${auction.id}`);
    };

    if (variant === 'horizontal') {
        return (
            <div
                onClick={handleCardClick}
                className={cn(
                    'bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer',
                    'flex items-center gap-4 p-4 h-32',
                    className,
                )}
            >
                <div className="relative w-24 h-24 overflow-hidden shrink-0 rounded">
                    <Image
                        src={auction.product.image}
                        alt={auction.product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute top-1 left-1 right-1 flex justify-between items-start">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
                            <Diamond
                                className="w-2.5 h-2.5 text-black"
                                fill="currentColor"
                            />
                            <span className="text-xs font-body font-medium text-black">
                                {auction.bidCount}
                            </span>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm z-10">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    void handleLike();
                                }}
                                className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                                aria-label={isLiked ? 'Unlike' : 'Like'}
                            >
                                <Heart
                                    className={cn(
                                        'w-3 h-3 transition-colors duration-200',
                                        isLiked
                                            ? 'fill-red-500 text-red-500'
                                            : 'text-gray-600 hover:text-red-400',
                                    )}
                                />
                            </button>
                            <span className="text-xs font-body font-medium text-black">
                                {likeCount}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col h-full justify-between">
                    <div>
                        <h3 className="font-body font-bold text-lg text-black mb-2 line-clamp-1">
                            {auction.product.name}
                        </h3>
                    </div>

                    <div className="flex gap-x-3 text-xs">
                        {auction.buyNowPrice && (
                            <div className="flex-1 min-w-0">
                                <span className="font-body text-neutral-400 block">
                                    BUY NOW PRICE
                                </span>
                                <span className="font-body font-medium text-neutral-600">
                                    {formatCurrency(auction.buyNowPrice)}
                                </span>
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <span className="font-body text-neutral-400 block">
                                BID INCREMENT
                            </span>
                            <span className="font-body font-medium text-neutral-600">
                                {formatCurrency(auction.bidIncrement)}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            {auction.bids && auction.bids.length > 0 ? (
                                <>
                                    <span className="font-body text-neutral-400 block">
                                        CURRENT BID
                                    </span>
                                    <span className="font-body font-medium text-neutral-600">
                                        {formatCurrency(auction.currentBid)}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="font-body text-neutral-400 block">
                                        STARTING BID
                                    </span>
                                    <span className="font-body font-medium text-neutral-600">
                                        {formatCurrency(auction.startBid)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        {auction.bids &&
                            auction.bids.length > 0 &&
                            highestBidder && (
                                <div>
                                    <span className="font-body italic text-xs text-neutral-400">
                                        by {highestBidder.username}
                                    </span>
                                </div>
                            )}

                        <div className="flex items-center gap-4 ml-auto pl-2 border-l border-dark-primary">
                            <div className="flex items-center gap-1 text-neutral-600">
                                <Calendar className="w-3 h-3" />
                                <span className="font-body text-xs font-semibold">
                                    {auction.endDate.toLocaleDateString(
                                        'en-US',
                                        {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        },
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 text-neutral-600">
                                <Clock className="w-3 h-3" />
                                <span className="font-body text-xs font-semibold">
                                    {timeRemaining.days > 0
                                        ? `${timeRemaining.days} days left`
                                        : timeRemaining.hours > 0
                                          ? `${timeRemaining.hours}h ${timeRemaining.minutes}m`
                                          : `${timeRemaining.minutes}m ${timeRemaining.seconds}s`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleCardClick}
            className={cn(
                ' overflow-hidden rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer',
                'w-[308px] h-[490px] flex flex-col',
                className,
            )}
        >
            <div className="relative h-60 overflow-hidden shrink-0">
                <Image
                    src={auction.product.image}
                    alt={auction.product.name}
                    fill
                    className={cn(
                        'object-cover group-hover:scale-110 transition-transform duration-500',
                        isAuctionEnded(auction.endDate) && 'grayscale-[0.5]',
                    )}
                />

                {isAuctionEnded(auction.endDate) && (
                    <div className="absolute top-3 right-3 z-20">
                        <span className="bg-neutral-800/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-white/20">
                            AUCTION ENDED
                        </span>
                    </div>
                )}

                {!isAuctionEnded(auction.endDate) &&
                    isNew(auction.createdAt) && (
                        <div className="absolute top-3 left-3 z-20">
                            <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-white/20 animate-pulse">
                                NEW
                            </span>
                        </div>
                    )}

                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                        <Diamond
                            className="w-3 h-3 text-black"
                            fill="currentColor"
                        />
                        <span className="text-sm font-body font-medium text-black">
                            {auction.bidCount}
                        </span>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm z-10">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                void handleLike();
                            }}
                            className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                            aria-label={isLiked ? 'Unlike' : 'Like'}
                        >
                            <Heart
                                className={cn(
                                    'w-4 h-4 transition-colors duration-200',
                                    isLiked
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-gray-600 hover:text-red-400',
                                )}
                            />
                        </button>
                        <span className="text-sm font-body font-medium text-black">
                            {likeCount}
                        </span>
                    </div>
                </div>

                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="w-full bg-primary backdrop-blur-sm py-3">
                        <p className="text-center font-body font-semibold text-black text-sm tracking-wider">
                            VIEW DETAIL
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-body font-bold text-lg text-black mb-3">
                    {auction.product.name}
                </h3>

                <div className="space-y-2 mb-4 flex-1">
                    {auction.buyNowPrice && (
                        <div className="flex justify-between items-center">
                            <span className="font-body text-sm text-neutral-400">
                                BUY NOW PRICE
                            </span>
                            <span className="font-body text-sm font-medium text-neutral-600">
                                {formatCurrency(auction.buyNowPrice)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-neutral-400">
                            BID INCREMENT
                        </span>
                        <span className="font-body text-sm font-medium text-neutral-600">
                            {formatCurrency(auction.bidIncrement)}
                        </span>
                    </div>

                    {auction.bids && auction.bids.length > 0 ? (
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="font-body text-sm text-neutral-400">
                                    CURRENT BID
                                </span>
                                <span className="font-body text-sm font-medium text-neutral-600">
                                    {formatCurrency(auction.currentBid)}
                                </span>
                            </div>
                            {highestBidder && (
                                <div className="text-right mt-1">
                                    <span className="font-body italic text-xs text-neutral-400">
                                        by {highestBidder.username}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <span className="font-body text-sm text-neutral-400">
                                STARTING BID
                            </span>
                            <span className="font-body text-sm font-medium text-neutral-600">
                                {formatCurrency(auction.startBid)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer section with date/time info */}
                <div className="mt-3 pt-3 border-t border-primary">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-neutral-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-body text-xs font-semibold">
                                {auction.endDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-neutral-600">
                            <Clock className="w-4 h-4" />
                            <span className="font-body text-xs font-semibold">
                                {timeRemaining.days > 0
                                    ? `${timeRemaining.days}d left`
                                    : timeRemaining.hours > 0
                                      ? `${timeRemaining.hours}h ${timeRemaining.minutes}m`
                                      : `${timeRemaining.minutes}m ${timeRemaining.seconds}s`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
