'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, Calendar, Clock, Diamond } from 'lucide-react';
import { ProductCardProps, TimeRemaining } from '@/types';
import { cn } from '@/lib/utils';

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

const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('vi-VN');
};

const ProductCard: React.FC<ProductCardProps> = ({
    auction,
    onLike,
    className,
    variant = 'vertical',
}) => {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(auction.isLiked || false);
    const [likeCount, setLikeCount] = useState(auction.likeCount);
    const timeRemaining = getTimeRemaining(auction.endDate);

    // Tìm highest bidder
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

    const handleLike = () => {
        const newLikedState = !isLiked;
        console.log('Like clicked! Current:', isLiked, 'New:', newLikedState);
        setIsLiked(newLikedState);

        setLikeCount((prev) => {
            const newCount = newLikedState ? prev + 1 : prev - 1;
            console.log('Like count changed from', prev, 'to', newCount);
            return newCount;
        });

        onLike?.(auction.id);
    };

    const handleCardClick = () => {
        router.push(`/auction/${auction.id}`);
    };

    if (variant === 'horizontal') {
        return (
            <div
                onClick={handleCardClick}
                className={cn(
                    'bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer',
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
                                    handleLike();
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
                                    BUY NOW BID
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
                ' overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer',
                'w-[308px] h-[490px] flex flex-col',
                className,
            )}
        >
            <div className="relative h-60 overflow-hidden shrink-0">
                <Image
                    src={auction.product.image}
                    alt={auction.product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

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
                                handleLike();
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
                                BUY NOW BID
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
