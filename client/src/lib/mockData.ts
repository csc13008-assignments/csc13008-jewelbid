import {
    Auction,
    CategoryItem,
    User,
    BidItem,
    WonAuctionItem,
    RatingItem,
    AuctionItem,
    CompletedAuctionItem,
} from '@/types';

export const mockAuctions: Auction[] = [
    {
        id: '1',
        product: {
            id: 'p1',
            name: 'Product Name',
            image: '/sample.png',
            category: 'Ring',
            material: 'Gold',
            brand: 'Luxury Brand',
            description: '',
        },
        currentBid: 12000000,
        buyNowPrice: 12000000,
        highestBid: 20000000,
        bidCount: 12,
        likeCount: 28,
        isLiked: false,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-14'),
        status: 'active',
        seller: {
            id: 'seller1',
            username: '****Khoa',
            avatar: '/avatars/seller1.jpg',
        },
        bids: [],
    },
    {
        id: '2',
        product: {
            id: 'p2',
            name: 'Diamond Wedding Ring',
            image: '/sample.png',
            category: 'Ring',
            material: 'Gold',
            brand: 'Diamond Co',
            description: '',
        },
        currentBid: 15000000,
        buyNowPrice: 15000000,
        highestBid: 25000000,
        bidCount: 18,
        likeCount: 42,
        isLiked: true,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-14'),
        status: 'active',
        seller: {
            id: 'seller2',
            username: 'JewelryMaster',
            avatar: '/avatars/seller2.jpg',
        },
        bids: [],
    },
    {
        id: '3',
        product: {
            id: 'p3',
            name: 'Vintage Gold Necklace',
            image: '/sample.png',
            category: 'Necklace',
            material: 'Gold',
            brand: 'Vintage Collection',
            description: '',
        },
        currentBid: 8000000,
        buyNowPrice: 8500000,
        highestBid: 12000000,
        bidCount: 25,
        likeCount: 35,
        isLiked: false,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-15'),
        status: 'active',
        seller: {
            id: 'seller3',
            username: 'AntiqueDealer',
            avatar: '/avatars/seller3.jpg',
        },
        bids: [],
    },
    {
        id: '4',
        product: {
            id: 'p4',
            name: 'Emerald Earrings',
            image: '/sample.png',
            category: 'Earring',
            material: 'Silver',
            brand: 'Emerald Dreams',
            description: '',
        },
        currentBid: 6000000,
        buyNowPrice: 7000000,
        highestBid: 9000000,
        bidCount: 8,
        likeCount: 22,
        isLiked: false,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-16'),
        status: 'active',
        seller: {
            id: 'seller4',
            username: 'GemCollector',
            avatar: '/avatars/seller4.jpg',
        },
        bids: [],
    },
    {
        id: '5',
        product: {
            id: 'p5',
            name: 'Pearl Bracelet',
            image: '/sample.png',
            category: 'Bracelet',
            material: 'Pearl',
            brand: 'Ocean Pearls',
            description: '',
        },
        currentBid: 4500000,
        buyNowPrice: 5000000,
        highestBid: 6500000,
        bidCount: 15,
        likeCount: 18,
        isLiked: true,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-17'),
        status: 'active',
        seller: {
            id: 'seller5',
            username: 'PearlExpert',
            avatar: '/avatars/seller5.jpg',
        },
        bids: [],
    },
    {
        id: '6',
        product: {
            id: 'p6',
            name: 'Sapphire Pendant',
            image: '/sample.png',
            category: 'Pendant',
            material: 'Silver',
            brand: 'Sapphire World',
            description: '',
        },
        currentBid: 7000000,
        buyNowPrice: 7500000,
        highestBid: 9500000,
        bidCount: 10,
        likeCount: 27,
        isLiked: false,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-18'),
        status: 'active',
        seller: {
            id: 'seller6',
            username: 'BlueGems',
            avatar: '/avatars/seller6.jpg',
        },
        bids: [],
    },
    {
        id: '7',
        product: {
            id: 'p7',
            name: 'Luxury Watch',
            image: '/sample.png',
            category: 'Watch',
            material: 'Leather',
            brand: 'Timekeepers',
            description: '',
        },
        currentBid: 30000000,

        buyNowPrice: 32000000,
        highestBid: 40000000,
        bidCount: 5,
        likeCount: 50,
        isLiked: true,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-19'),
        status: 'active',
        seller: {
            id: 'seller7',
            username: 'WatchLover',
            avatar: '/avatars/seller7.jpg',
        },
        bids: [],
    },
];

export const getTopDealsData = () => {
    const endingSoon = [...mockAuctions].sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    );

    const mostBids = [...mockAuctions].sort((a, b) => b.bidCount - a.bidCount);

    const highestPrice = [...mockAuctions].sort(
        (a, b) => b.highestBid - a.highestBid,
    );

    return {
        endingSoon,
        mostBids,
        highestPrice,
    };
};

export const mockCategories: CategoryItem[] = [
    {
        id: 'ring-category',
        name: 'Ring',
        image: '/rings.png',
    },
    {
        id: 'earring-jewelry',
        name: 'Earring',
        image: '/earings.png',
    },
    {
        id: 'gemstone-collection',
        name: 'Gemstone',
        image: '/gemstones.png',
    },
    {
        id: 'necklace-accessories',
        name: 'Necklace',
        image: '/necklaces.png',
    },
    {
        id: 'watch-timepieces',
        name: 'Watch',
        image: '/watches.png',
    },
    {
        id: 'diamond-precious',
        name: 'Diamond',
        image: '/diamond.png',
    },
];

export const getCategoriesData = () => {
    return mockCategories;
};

export const mockUsers: User[] = [
    {
        id: 'user1',
        email: 'admin@jewelbid.com',
        password: 'admin123',
        name: 'Admin User',
        username: 'admin',
        avatar: '/avatars/admin.jpg',
        address: '123 Admin Street, Ho Chi Minh City',
        phone: '+84 123 456 789',
        role: 'admin',
        createdAt: new Date('2024-01-01'),
    },
    {
        id: 'bidder1',
        email: 'bidder@jewelbid.com',
        password: 'bidder123',
        name: 'Nguyen Van Bidder',
        username: 'bidder_user',
        avatar: '/avatars/bidder.jpg',
        address: '456 Bidder Avenue, Ho Chi Minh City',
        phone: '+84 987 654 321',
        role: 'bidder',
        createdAt: new Date('2024-02-15'),
    },
    {
        id: 'seller1',
        email: 'seller@jewelbid.com',
        password: 'seller123',
        name: 'Tran Thi Seller',
        username: 'seller_user',
        avatar: '/avatars/seller.jpg',
        address: '789 Seller Lane, Hanoi',
        phone: '+84 111 222 333',
        role: 'seller',
        createdAt: new Date('2024-03-20'),
    },
    {
        id: 'user2',
        email: 'user@jewelbid.com',
        password: 'user123',
        name: 'John Doe',
        username: 'johndoe',
        avatar: '/avatars/user2.jpg',
        address: '321 User Road, Da Nang',
        phone: '+84 444 555 666',
        role: 'user',
        createdAt: new Date('2024-04-10'),
    },
    {
        id: 'user3',
        email: 'test@test.com',
        password: 'test123',
        name: 'Test User',
        username: 'testuser',
        avatar: '/avatars/user3.jpg',
        role: 'user',
        createdAt: new Date('2024-05-01'),
    },
];

export const authenticateUser = (
    email: string,
    password: string,
): User | null => {
    const user = mockUsers.find(
        (u) => u.email === email && u.password === password,
    );

    return user || null;
};

export const getUserByEmail = (email: string): User | null => {
    return mockUsers.find((u) => u.email === email) || null;
};

export const emailExists = (email: string): boolean => {
    return mockUsers.some((u) => u.email === email);
};

export const mockBids: BidItem[] = [
    {
        id: 1,
        product: 'Diamond Ring',
        currentBid: '$500',
        yourBid: '$480',
        timeLeft: '2h 30m',
        status: 'Leading',
    },
    {
        id: 2,
        product: 'Diamond Ring',
        currentBid: '$500',
        yourBid: '$480',
        timeLeft: '2h 30m',
        status: 'Leading',
    },
    {
        id: 3,
        product: 'Diamond Ring',
        currentBid: '$500',
        yourBid: '$480',
        timeLeft: '2h 30m',
        status: 'Leading',
    },
    {
        id: 4,
        product: 'Diamond Ring',
        currentBid: '$500',
        yourBid: '$480',
        timeLeft: '2h 30m',
        status: 'Leading',
    },
    {
        id: 5,
        product: 'Diamond Ring',
        currentBid: '$500',
        yourBid: '$480',
        timeLeft: '2h 30m',
        status: 'Leading',
    },
    {
        id: 6,
        product: 'Diamond Ring',
        currentBid: '$500',
        yourBid: '$480',
        timeLeft: '2h 30m',
        status: 'Leading',
    },
    {
        id: 7,
        product: 'Diamond Ring',
        currentBid: '$500',
        yourBid: '$480',
        timeLeft: '2h 30m',
        status: 'Leading',
    },
    {
        id: 8,
        product: 'Diamond Ring',
        currentBid: '$500',
        yourBid: '$480',
        timeLeft: '2h 30m',
        status: 'Leading',
    },
];

export const mockWonAuctions: WonAuctionItem[] = [
    {
        id: 1,
        product: 'Diamond Ring',
        finalPrice: '$500',
        sellerName: 'John Smith',
        sellerAvatar: '/avatars/seller1.jpg',
        dateWon: '2h 30m',
        action: 'Rating Seller',
    },
    {
        id: 2,
        product: 'Diamond Ring',
        finalPrice: '$500',
        sellerName: 'Jane Doe',
        sellerAvatar: '/avatars/seller2.jpg',
        dateWon: '2h 30m',
        action: 'Rating Seller',
    },
    {
        id: 3,
        product: 'Diamond Ring',
        finalPrice: '$500',
        sellerName: 'Mike Johnson',
        sellerAvatar: '/avatars/seller3.jpg',
        dateWon: '2h 30m',
        action: 'Rating Seller',
    },
    {
        id: 4,
        product: 'Diamond Ring',
        finalPrice: '$500',
        sellerName: 'Sarah Wilson',
        sellerAvatar: '/avatars/seller4.jpg',
        dateWon: '2h 30m',
        action: 'Rating Seller',
    },
];

export const mockRatings: RatingItem[] = [
    {
        id: 1,
        sellerName: 'John Smith',
        comment: 'Great seller, fast shipping!',
        avatar: '/avatars/seller1.jpg',
        rating: 5.0,
        totalReviews: 12,
        date: '2 days ago',
    },
    {
        id: 2,
        sellerName: 'Jane Doe',
        comment: 'Great seller, fast shipping!',
        avatar: '/avatars/seller2.jpg',
        rating: 5.0,
        totalReviews: 12,
        date: '1 week ago',
    },
    {
        id: 3,
        sellerName: 'Mike Johnson',
        comment: 'Great seller, fast shipping!',
        avatar: '/avatars/seller3.jpg',
        rating: 5.0,
        totalReviews: 12,
        date: '2 weeks ago',
    },
];

// Mock data for seller dashboard active auctions
export const mockActiveAuctions: AuctionItem[] = [
    {
        id: '1',
        title: 'Diamond Ring',
        image: '/sample.png',
        currentPrice: 500,
        endTime: '2h 15m',
        totalBids: 12,
        status: 'active',
    },
    {
        id: '2',
        title: 'Gold Necklace',
        image: '/sample.png',
        currentPrice: 750,
        endTime: '1h 45m',
        totalBids: 18,
        status: 'active',
    },
    {
        id: '3',
        title: 'Pearl Earrings',
        image: '/sample.png',
        currentPrice: 320,
        endTime: '3h 20m',
        totalBids: 8,
        status: 'active',
    },
    {
        id: '4',
        title: 'Silver Bracelet',
        image: '/sample.png',
        currentPrice: 450,
        endTime: '4h 10m',
        totalBids: 15,
        status: 'active',
    },
    {
        id: '5',
        title: 'Ruby Ring',
        image: '/sample.png',
        currentPrice: 1200,
        endTime: '5h 30m',
        totalBids: 25,
        status: 'active',
    },
    {
        id: '6',
        title: 'Emerald Pendant',
        image: '/sample.png',
        currentPrice: 890,
        endTime: '6h 15m',
        totalBids: 22,
        status: 'active',
    },
];

// Mock data for seller dashboard completed auctions
export const mockCompletedAuctions: CompletedAuctionItem[] = [
    {
        id: '1',
        title: 'Vintage Diamond Ring',
        image: '/sample.png',
        currentPrice: 850,
        finalPrice: 850,
        endTime: '2h 30m',
        totalBids: 12,
        sellerName: 'John Smith',
        sellerAvatar: '/avatars/user1.jpg',
        sellerRating: 4.8,
        dateWon: '2h 30m',
        status: 'completed',
    },
    {
        id: '2',
        title: 'Gold Wedding Band',
        image: '/sample.png',
        currentPrice: 650,
        finalPrice: 650,
        endTime: '1d 15h',
        totalBids: 9,
        sellerName: 'Jane Doe',
        sellerAvatar: '/avatars/user2.jpg',
        sellerRating: 4.9,
        dateWon: '1d 15h',
        status: 'completed',
    },
    {
        id: '3',
        title: 'Pearl Necklace Set',
        image: '/sample.png',
        currentPrice: 1200,
        finalPrice: 1200,
        endTime: '3d 8h',
        totalBids: 18,
        sellerName: 'Mike Johnson',
        sellerAvatar: '/avatars/user3.jpg',
        sellerRating: 4.6,
        dateWon: '3d 8h',
        status: 'completed',
    },
    {
        id: '4',
        title: 'Sapphire Earrings',
        image: '/sample.png',
        currentPrice: 950,
        finalPrice: 950,
        endTime: '1w 2d',
        totalBids: 14,
        sellerName: 'Sarah Wilson',
        sellerAvatar: '/avatars/user4.jpg',
        sellerRating: 5.0,
        dateWon: '1w 2d',
        status: 'completed',
    },
];
