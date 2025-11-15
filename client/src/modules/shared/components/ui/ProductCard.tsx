'use client';

import { useState } from 'react';
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
}) => {
    const [isLiked, setIsLiked] = useState(auction.isLiked || false);
    const timeRemaining = getTimeRemaining(auction.endDate);

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.(auction.id);
    };

    return (
        <div
            className={cn(
                ' overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer',
                'w-[308px] h-[450px] flex flex-col',
                className,
            )}
        >
            <div className="relative h-[240px] overflow-hidden flex-shrink-0">
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

                    {/* Like Button with Count */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                        <button
                            onClick={handleLike}
                            className="hover:scale-110 transition-transform duration-200"
                        >
                            <Heart
                                className={cn(
                                    'w-4 h-4 transition-colors',
                                    isLiked
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-gray-600',
                                )}
                            />
                        </button>
                        <span className="text-sm font-body font-medium text-black">
                            {auction.likeCount}
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
                    <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-neutral-400">
                            CURRENT BID
                        </span>
                        <span className="font-body text-sm font-medium text-neutral-600">
                            {formatCurrency(auction.currentBid)}
                        </span>
                    </div>

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
                            HIGHEST BID
                        </span>
                        <span className="font-body text-sm font-medium text-neutral-600">
                            {formatCurrency(auction.highestBid)}
                        </span>
                    </div>

                    {auction.seller && (
                        <div className="text-right">
                            <span className="font-body italic text-xs text-neutral-400">
                                by {auction.seller.username}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-neutral-500">
                        <Calendar className="w-4 h-4" />
                        <span className="font-body text-xs font-medium">
                            {auction.endDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-neutral-500">
                        <Clock className="w-4 h-4" />
                        <span className="font-body text-xs font-medium">
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
    );
};

export default ProductCard;
