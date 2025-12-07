'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Heart, Calendar, Clock, X, Edit } from 'lucide-react';
import { getAuctionById, mockAuctions } from '@/lib/mockData';
import {
    RatingBadge,
    Button,
    ProductCard,
} from '@/modules/shared/components/ui';

export default function ProductDetailPage() {
    const params = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [bidAmount, setBidAmount] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [bidError, setBidError] = useState('');
    const [showAllBids, setShowAllBids] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [currentUser, setCurrentUser] = useState<{
        id: string;
        role: string;
    } | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [additionalDescription, setAdditionalDescription] = useState('');

    useEffect(() => {
        const initializeUser = () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setCurrentUser({ id: user.id, role: user.role });
                } else {
                    setCurrentUser({ id: 'bidder1', role: 'bidder' });
                }
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                setCurrentUser({ id: 'bidder1', role: 'bidder' });
            } finally {
                setIsUserLoading(false);
            }
        };

        initializeUser();
    }, []);

    const auction = useMemo(() => {
        if (params.id) {
            return getAuctionById(params.id as string);
        }
        return null;
    }, [params.id]);

    const isOwner =
        auction &&
        currentUser &&
        currentUser.role === 'seller' &&
        currentUser.id === auction.seller.id;

    const canComment =
        currentUser &&
        (currentUser.role === 'bidder' ||
            (currentUser.role === 'seller' && !isOwner));

    const canBid =
        currentUser &&
        (currentUser.role === 'bidder' ||
            (currentUser.role === 'seller' && !isOwner));

    const highestBidder =
        auction && auction.bids && auction.bids.length > 0
            ? auction.bids.reduce((highest, current) =>
                  current.amount > highest.amount ? current : highest,
              ).bidder
            : null;

    useEffect(() => {
        if (!auction) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const endTime = auction.endDate.getTime();
            const difference = endTime - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                );
                const minutes = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60),
                );
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();

        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [auction]);

    if (!auction || isUserLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {!auction ? 'Product Not Found' : 'Loading...'}
                    </h1>
                    <p className="text-gray-600">
                        {!auction
                            ? "The auction you're looking for doesn't exist."
                            : 'Please wait while we load the auction details.'}
                    </p>
                </div>
            </div>
        );
    }

    const mockImages = [
        auction.product.image,
        auction.product.image,
        auction.product.image,
        auction.product.image,
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + 'VND';
    };

    const formatNumber = (value: string) => {
        const numbersOnly = value.replace(/[^0-9]/g, '');
        if (!numbersOnly) return '';

        return new Intl.NumberFormat('vi-VN').format(parseInt(numbersOnly));
    };

    const parseFormattedNumber = (formattedValue: string) => {
        return parseInt(formattedValue.replace(/[^0-9]/g, '')) || 0;
    };

    const maskUsername = (username: string) => {
        if (username.length <= 2) return username;
        if (username.length <= 4) {
            return `${username.charAt(0)}*${username.slice(2)}`;
        }
        const visibleChars = Math.ceil(username.length / 2);
        const maskedChars = username.length - visibleChars;
        const firstPart = username.slice(0, Math.ceil(visibleChars / 2));
        const lastPart = username.slice(-Math.floor(visibleChars / 2));
        const maskedMiddle = '*'.repeat(maskedChars);
        return `${firstPart}${maskedMiddle}${lastPart}`;
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleQuestionSubmit = () => {
        if (!newQuestion.trim()) return;
        console.log('Question submitted:', newQuestion);
        setNewQuestion('');
    };

    const handleSetMaxBid = () => {
        setBidError('');
        if (!bidAmount.trim()) {
            setBidError('Please enter a bid amount');
            return;
        }

        const amount = parseFormattedNumber(bidAmount);
        const minimumBid = auction.currentBid + auction.bidIncrement;

        if (isNaN(amount) || amount <= 0) {
            setBidError('Please enter a valid amount');
            return;
        }

        if (amount < minimumBid) {
            setBidError(`Minimum bid is ${formatCurrency(minimumBid)}`);
            return;
        }

        console.log('Max bid set:', formatCurrency(amount));
        alert(`Max bid set to ${formatCurrency(amount)}`);
        setBidAmount('');
        setBidError('');
    };

    const handleToggleBids = () => {
        setShowAllBids(!showAllBids);
    };

    const handleToggleComments = () => {
        setShowAllComments(!showAllComments);
    };

    const handleRejectBid = (bidId: string) => {
        console.log('Rejecting bid:', bidId);
        alert(`Bid ${bidId} has been rejected`);
    };

    const handleStartReply = (commentId: string) => {
        setReplyingTo(commentId);
        setReplyText('');
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const handleSubmitReply = (commentId: string) => {
        if (!replyText.trim()) return;

        console.log('Replying to comment:', commentId, 'with text:', replyText);
        alert(`Reply submitted: "${replyText}"`);

        setReplyingTo(null);
        setReplyText('');
    };

    const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        const formattedValue = formatNumber(inputValue);
        setBidAmount(formattedValue);

        if (bidError) {
            setBidError('');
        }

        if (formattedValue.trim() && auction) {
            const amount = parseFormattedNumber(formattedValue);
            const minimumBid = auction.currentBid + auction.bidIncrement;

            if (!isNaN(amount) && amount > 0 && amount < minimumBid) {
                setBidError(`Minimum bid is ${formatCurrency(minimumBid)}`);
            }
        }
    };

    const handleEditDescription = () => {
        setIsEditingDescription(true);
        setAdditionalDescription('');
    };

    const handleCancelEditDescription = () => {
        setIsEditingDescription(false);
        setAdditionalDescription('');
    };

    const handleSaveDescription = () => {
        if (!additionalDescription.trim()) {
            alert('Please enter additional description');
            return;
        }

        // Append to existing description
        console.log('Appending description:', additionalDescription);
        alert(`Additional description saved: "${additionalDescription}"`);

        // In real app, you would call API to update auction.product.description
        // auction.product.description += '\n\n' + additionalDescription;

        setIsEditingDescription(false);
        setAdditionalDescription('');
    };
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <h1 className="text-4xl font-bold text-black">
                                {auction.product.name}
                            </h1>
                            <button
                                onClick={handleLike}
                                className="flex items-center space-x-1 px-3 py-1 border border-dark-primary rounded-full hover:bg-gray-50"
                            >
                                <Heart
                                    className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-dark-primary'}`}
                                />
                                <span className="text-sm">
                                    {auction.likeCount}
                                </span>
                            </button>
                        </div>

                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                            <Image
                                src={mockImages[selectedImage]}
                                alt="Product"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex space-x-2">
                            {mockImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative w-20 h-20 bg-gray-100 overflow-hidden ${
                                        selectedImage === index
                                            ? 'border-2 border-gray-400'
                                            : ''
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="pt-8">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-2xl font-extrabold">
                                    DESCRIPTION & DETAILS
                                </p>
                                {isOwner && (
                                    <Button
                                        variant="primary"
                                        size="md"
                                        onClick={handleEditDescription}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Description
                                    </Button>
                                )}
                            </div>

                            <p className="text-gray-700 text-md mb-8">
                                {auction.product.description}
                            </p>

                            <div className="grid grid-cols-2 gap-32">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            YEAR
                                        </p>
                                        <p className="text-md">
                                            {auction.product.specifications
                                                ?.year || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            TOTAL CARAT WEIGHT OF MAIN STONE
                                        </p>
                                        <p className="text-md">
                                            {auction.product.specifications
                                                ?.totalCaratWeightMainStone ||
                                                'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            FINENESS
                                        </p>
                                        <p className="text-md">
                                            {auction.product.specifications
                                                ?.fineness || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            CONDITION
                                        </p>
                                        <p className="text-md">
                                            {auction.product.specifications
                                                ?.condition || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            SIZE
                                        </p>
                                        <p className="text-md">
                                            {auction.product.specifications
                                                ?.size || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            MATERIAL
                                        </p>
                                        <p className="text-md">
                                            {auction.product.material || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            TOTAL CARAT WEIGHT OF SURROUNDING
                                            STONES
                                        </p>
                                        <p className="text-md">
                                            {auction.product.specifications
                                                ?.totalCaratWeightSurroundingStones ||
                                                'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            TOTAL WEIGHT
                                        </p>
                                        <p className="text-md">
                                            {auction.product.specifications
                                                ?.totalWeight || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            BRAND
                                        </p>
                                        <p className="text-md">
                                            {auction.product.brand || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-dark-primary uppercase tracking-wider mb-2">
                                            ORIGIN
                                        </p>
                                        <p className="text-md">
                                            {auction.product.specifications
                                                ?.origin || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20">
                            <p className="text-2xl font-extrabold mb-4">Q&A</p>

                            {canComment && (
                                <div className="flex items-start space-x-3 mb-8">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                                        <Image
                                            src="/avatars/user1.jpg"
                                            alt="User"
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={newQuestion}
                                            onChange={(e) =>
                                                setNewQuestion(e.target.value)
                                            }
                                            placeholder="Add a comment"
                                            className="w-full h-11 border border-dark-primary px-4 "
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleQuestionSubmit}
                                    >
                                        Post
                                    </Button>
                                </div>
                            )}

                            <div className="space-y-6">
                                {auction.qaComments &&
                                auction.qaComments.length > 0 ? (
                                    auction.qaComments
                                        .slice(
                                            0,
                                            showAllComments
                                                ? auction.qaComments.length
                                                : 3,
                                        )
                                        .map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="flex items-start space-x-3"
                                            >
                                                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                                                    <Image
                                                        src={
                                                            comment.author
                                                                .avatar
                                                        }
                                                        alt={
                                                            comment.author
                                                                .username
                                                        }
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-medium">
                                                            {
                                                                comment.author
                                                                    .username
                                                            }
                                                        </span>
                                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                                            {
                                                                comment.author
                                                                    .role
                                                            }
                                                        </span>
                                                        <span className="text-gray-500 text-sm">
                                                            {comment.timestamp.toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 mb-3">
                                                        {comment.content}
                                                    </p>

                                                    {isOwner &&
                                                        (comment.author.role ===
                                                            'bidder' ||
                                                            comment.author
                                                                .role ===
                                                                'seller') && (
                                                            <div className="mt-2">
                                                                {replyingTo ===
                                                                comment.id ? (
                                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                                        <textarea
                                                                            value={
                                                                                replyText
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setReplyText(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            placeholder="Write your reply..."
                                                                            className="w-full border border-gray-300 px-3 py-2 rounded resize-none"
                                                                            rows={
                                                                                3
                                                                            }
                                                                        />
                                                                        <div className="flex space-x-2 mt-2">
                                                                            <Button
                                                                                variant="primary"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleSubmitReply(
                                                                                        comment.id,
                                                                                    )
                                                                                }
                                                                                className="px-4 py-1"
                                                                            >
                                                                                Submit
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={
                                                                                    handleCancelReply
                                                                                }
                                                                                className="px-4 py-1"
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleStartReply(
                                                                                comment.id,
                                                                            )
                                                                        }
                                                                        className="text-[#5F87C1] text-sm transition-colors"
                                                                    >
                                                                        Reply
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        {canComment
                                            ? 'No questions yet. Be the first to ask!'
                                            : 'No questions from users yet.'}
                                    </div>
                                )}
                            </div>

                            {auction.qaComments &&
                                auction.qaComments.length > 3 && (
                                    <button
                                        onClick={handleToggleComments}
                                        className="mt-6 text-[#5F87C1] text-sm hover:text-blue-600 transition-colors"
                                    >
                                        {showAllComments
                                            ? 'Show fewer comments'
                                            : `See ${auction.qaComments.length - 3} more comments`}
                                    </button>
                                )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="border border-gray-300 p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">
                                            {auction.startDate.toLocaleDateString(
                                                'en-US',
                                                {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                },
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">
                                            {auction.endDate.toLocaleDateString(
                                                'en-US',
                                                {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                },
                                            )}
                                            , 2PM
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-dark-primary text-white px-8 py-4 flex items-center justify-center space-x-6 text-center rounded">
                                    <div>
                                        <div className="text-3xl font-bold">
                                            {timeLeft.days}
                                        </div>
                                        <div className="text-xs">Days</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold">
                                            {timeLeft.hours}
                                        </div>
                                        <div className="text-xs">Hours</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold">
                                            {timeLeft.minutes}
                                        </div>
                                        <div className="text-xs">Minutes</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold">
                                            {timeLeft.seconds}
                                        </div>
                                        <div className="text-xs">Seconds</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary p-6">
                            <div className="mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-800">
                                        STARTING BID:
                                    </span>
                                    <span className="text-md font-bold text-black">
                                        {formatCurrency(auction.startBid)}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-800">
                                        BUY NOW BID:
                                    </span>
                                    <span className="text-md font-bold text-black">
                                        {formatCurrency(
                                            auction.buyNowPrice ||
                                                auction.currentBid,
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="text-sm text-gray-800 mb-4">
                                        CURRENT BID
                                    </div>
                                    <div className="text-5xl font-bold text-black">
                                        {formatCurrency(auction.currentBid)}
                                    </div>
                                    <div className="border border-black inline-block px-3 py-1 mt-4">
                                        <span className="text-sm font-bold">
                                            BID INCREMENT:{' '}
                                            {formatCurrency(
                                                auction.bidIncrement,
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm text-gray-800 mb-3">
                                        HIGHEST BIDDER
                                    </div>
                                    {highestBidder ? (
                                        <RatingBadge
                                            rating={highestBidder.rating || 0}
                                            totalReviews={
                                                highestBidder.reviewCount || 0
                                            }
                                            avatar={
                                                highestBidder.avatar ||
                                                '/avatars/bidder1.jpg'
                                            }
                                            sellerName={highestBidder.username}
                                            size="md"
                                            className="items-center"
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-sm">
                                            No bids yet
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 mb-16">
                                <RatingBadge
                                    rating={auction.seller.rating || 4.8}
                                    totalReviews={
                                        auction.seller.reviewCount || 12
                                    }
                                    avatar={
                                        auction.seller.avatar ||
                                        '/avatars/seller1.jpg'
                                    }
                                    sellerName={auction.seller.username}
                                    variant="horizontal"
                                    sellerTags={
                                        auction.seller.tags || 'Verified Seller'
                                    }
                                    objectsSold={
                                        auction.seller.objectsSold || 0
                                    }
                                    size="lg"
                                />
                            </div>

                            {canBid && (
                                <>
                                    <div className="mb-4">
                                        <div className="flex space-x-3">
                                            <input
                                                type="text"
                                                value={bidAmount}
                                                onChange={handleBidAmountChange}
                                                placeholder={`${formatCurrency(auction.currentBid + auction.bidIncrement)} or up`}
                                                className={`flex-1 border px-4 py-1 text-lg bg-gray-200 ${bidError ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={handleSetMaxBid}
                                                className="text-dark-primary font-bold"
                                            >
                                                Set max bid
                                            </Button>
                                        </div>
                                        {bidError && (
                                            <p className="text-red-500 text-sm mt-2">
                                                {bidError}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-center text-gray-500 mb-4">
                                        OR
                                    </div>

                                    <Button
                                        variant="muted"
                                        size="lg"
                                        className="w-full font-bold text-lg"
                                    >
                                        Buy now for{' '}
                                        {formatCurrency(
                                            auction.buyNowPrice ||
                                                auction.currentBid,
                                        )}
                                    </Button>
                                </>
                            )}

                            {isOwner && (
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                                    <p className="text-[#5F87C1] font-medium">
                                        This is your auction. You cannot bid on
                                        your own products.
                                    </p>
                                </div>
                            )}

                            <div className="mt-8">
                                <div className="space-y-4">
                                    {auction.bids.length > 0 ? (
                                        auction.bids
                                            .sort(
                                                (a, b) =>
                                                    b.timestamp.getTime() -
                                                    a.timestamp.getTime(),
                                            )
                                            .slice(
                                                0,
                                                showAllBids
                                                    ? auction.bids.length
                                                    : 3,
                                            )
                                            .map((bid) => (
                                                <div
                                                    key={bid.id}
                                                    className="flex justify-between items-center text-sm border-b border-gray-300 pb-2"
                                                >
                                                    <div className="flex space-x-4">
                                                        <span className="font-medium">
                                                            {maskUsername(
                                                                bid.bidder
                                                                    .username,
                                                            )}
                                                        </span>
                                                        <span className="text-gray-600">
                                                            {bid.timestamp.toLocaleDateString(
                                                                'vi-VN',
                                                            )}{' '}
                                                            {bid.timestamp.toLocaleTimeString(
                                                                'vi-VN',
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="font-bold">
                                                            {formatCurrency(
                                                                bid.amount,
                                                            )}
                                                        </span>
                                                        {isOwner && (
                                                            <button
                                                                onClick={() =>
                                                                    handleRejectBid(
                                                                        bid.id,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                                title="Từ chối bid này"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="text-center text-gray-500 py-4">
                                            {isOwner
                                                ? 'No bids received yet'
                                                : 'No bids yet'}
                                        </div>
                                    )}

                                    {auction.bids.length > 3 && (
                                        <button
                                            onClick={handleToggleBids}
                                            className="flex items-center space-x-2 text-black text-sm font-medium mt-4"
                                        >
                                            <span>
                                                {showAllBids
                                                    ? 'Show fewer bids'
                                                    : `See all bids (${auction.bids.length})`}
                                            </span>
                                            <span>
                                                {showAllBids ? '⌃' : '⌄'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-16">
                            <p className="text-2xl font-extrabold mb-4">
                                RELATED AUCTIONS
                            </p>
                            <div className="grid grid-cols-1 gap-6">
                                {mockAuctions
                                    .filter(
                                        (relatedAuction) =>
                                            relatedAuction.id !== auction.id,
                                    )
                                    .slice(0, 5)
                                    .map((relatedAuction) => (
                                        <ProductCard
                                            key={relatedAuction.id}
                                            auction={relatedAuction}
                                            variant="horizontal"
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Description Modal */}
            {isEditingDescription && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-2xl font-bold">
                                Add to Product Description
                            </p>
                            <button
                                onClick={handleCancelEditDescription}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-black mb-2">
                                Current Description:
                            </label>
                            <div className="p-4 bg-gray-100 border max-h-32 overflow-y-auto">
                                <p className="text-black">
                                    {auction.product.description}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-black mb-2">
                                Additional Description:{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={additionalDescription}
                                onChange={(e) =>
                                    setAdditionalDescription(e.target.value)
                                }
                                placeholder="Enter additional information about your product..."
                                className="w-full h-32 border border-dark-primary px-4 py-3 resize-none focus:outline-none focus:border-dark-primary"
                                rows={6}
                            />
                            <p className="text-sm text-red-500 italic mt-1">
                                This information will be appended to your
                                existing description.
                            </p>
                        </div>

                        <div className="flex space-x-4">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleCancelEditDescription}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleSaveDescription}
                                className="flex-1"
                            >
                                Save Additional Description
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
