export interface Product {
    id: string;
    name: string;
    image: string;
    category: string;
    brand?: string;
    material?: string;
    description: string;
}

export interface Bid {
    id: string;
    amount: number;
    bidder: {
        id: string;
        username: string;
        avatar?: string;
    };
    timestamp: Date;
}

export interface Auction {
    id: string;
    product: Product;
    currentBid: number;
    buyNowPrice?: number;
    highestBid: number;
    bidCount: number;
    likeCount: number;
    isLiked?: boolean;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'ended' | 'upcoming';
    seller: {
        id: string;
        username: string;
        avatar?: string;
    };
    bids: Bid[];
}

export interface ProductCardProps {
    auction: Auction;
    showBidInfo?: boolean;
    onLike?: (auctionId: string) => void;
    onBid?: (auctionId: string) => void;
    className?: string;
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

export interface AuctionListResponse {
    auctions: Auction[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
