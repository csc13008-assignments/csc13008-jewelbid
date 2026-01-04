export interface Product {
    id: string;
    name: string;
    image: string;
    additionalImages?: string[];
    category?: {
        id: string;
        name: string;
    } | null;
    brand?: string;
    material?: string;
    description: string;
    // New product detail fields
    era?: string;
    fineness?: string;
    condition?: string;
    totalWeight?: string;
    size?: string;
    mainStoneCaratWeight?: string;
    surroundingStonesCaratWeight?: string;
    targetAudience?: string;
    origin?: string;
    specifications?: {
        year?: string;
        totalCaratWeightMainStone?: string;
        fineness?: string;
        totalCaratWeightSurroundingStones?: string;
        size?: string;
        totalWeight?: string;
        clarity?: string;
        origin?: string;
        condition?: string;
    };
}

export interface Bid {
    id: string;
    amount: number;
    bidder: {
        id: string;
        username: string;
        avatar?: string;
        rating?: number;
        reviewCount?: number;
    };
    timestamp: Date;
}

export interface Auction {
    id: string;
    product: Product;
    startBid: number;
    currentBid: number;
    bidIncrement: number;
    buyNowPrice?: number;
    bidCount: number;
    likeCount: number;
    isLiked?: boolean;
    startDate: Date;
    createdAt?: Date;
    endDate: Date;
    status: 'active' | 'ended' | 'upcoming';
    seller: {
        id: string;
        username: string;
        avatar?: string;
        tags?: string;
        objectsSold?: number;
        rating?: number;
        reviewCount?: number;
    };
    bids: Bid[];
    qaComments?: QAComment[];
}

export interface ProductCardProps {
    auction: Auction;
    showBidInfo?: boolean;
    onLike?: (auctionId: string) => void;
    onBid?: (auctionId: string) => void;
    className?: string;
    variant?: 'vertical' | 'horizontal';
}

export interface TopDealsTabsProps {
    auctions: {
        endingSoon: Auction[];
        mostBids: Auction[];
        highestPrice: Auction[];
    };
}

export type TopDealsTab = 'ending-soon' | 'most-bids' | 'highest-price';

export type Currency = 'VND' | 'USD' | 'EUR';

export interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export type AuctionStatus = 'active' | 'ended' | 'upcoming';

export type AuctionSortBy =
    | 'ending-soon'
    | 'most-bids'
    | 'highest-price'
    | 'newest'
    | 'oldest';

export interface AuctionFilters {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    material?: string;
    brand?: string;
    status?: AuctionStatus;
}

export interface CategoryItem {
    id: string;
    name: string;
    image: string;
}

export interface FilterOption {
    label: string;
    value: string;
    count?: number;
}

export interface SearchFilters {
    category?: string;
    brand?: string;
    material?: string;
    targetAudience?: string;
    auctionStatus?: string;
    sortBy?: string;
}

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface AuctionListResponse {
    auctions: Auction[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    fullname?: string;
    username: string;
    avatar?: string;
    profileImage?: string;
    address?: string;
    phone?: string;
    role: 'user' | 'admin' | 'bidder' | 'seller';
    createdAt: Date;
}

export interface BidItem {
    id: number;
    product: string;
    currentBid: string;
    yourBid: string;
    timeLeft: string;
    status: string;
}

export interface WonAuctionItem {
    id: number;
    product: string;
    finalPrice: string;
    sellerName: string;
    sellerAvatar: string;
    dateWon: string;
    action: string;
}

export interface RatingItem {
    id: number;
    sellerName: string;
    comment: string;
    avatar: string;
    rating: number;
    totalReviews: number;
    date: string;
}

export interface AuctionItem {
    id: string;
    title: string;
    image: string;
    currentPrice: number;
    endTime: string;
    totalBids: number;
    status: 'active' | 'completed';
}

export interface CompletedAuctionItem extends AuctionItem {
    finalPrice: number;
    sellerName: string;
    sellerAvatar: string;
    sellerRating: number;
    dateWon: string;
}

export interface QAComment {
    id: string;
    author: {
        id: string;
        username: string;
        avatar: string;
        role: 'bidder' | 'seller' | 'admin';
    };
    content: string;
    timestamp: Date;
}
