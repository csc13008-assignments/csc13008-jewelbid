import { Auction, CategoryItem } from '@/types';

export const mockAuctions: Auction[] = [
    {
        id: '1',
        product: {
            id: 'p1',
            name: 'Product Name',
            image: '/sample.png',
            category: 'Rings',
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
            avatar: '/avatar-1.jpg',
        },
        bids: [],
    },
    {
        id: '2',
        product: {
            id: 'p2',
            name: 'Diamond Wedding Ring',
            image: '/sample.png',
            category: 'Rings',
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
            avatar: '/avatar-2.jpg',
        },
        bids: [],
    },
    {
        id: '3',
        product: {
            id: 'p3',
            name: 'Vintage Gold Necklace',
            image: '/sample.png',
            category: 'Necklaces',
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
            avatar: '/avatar-3.jpg',
        },
        bids: [],
    },
    {
        id: '4',
        product: {
            id: 'p4',
            name: 'Emerald Earrings',
            image: '/sample.png',
            category: 'Earrings',
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
            avatar: '/avatar-4.jpg',
        },
        bids: [],
    },
    {
        id: '5',
        product: {
            id: 'p5',
            name: 'Pearl Bracelet',
            image: '/sample.png',
            category: 'Bracelets',
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
            avatar: '/avatar-5.jpg',
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
        id: 'rings-category',
        name: 'Rings',
        image: '/rings.png',
    },
    {
        id: 'earrings-jewelry',
        name: 'Earrings',
        image: '/earings.png',
    },
    {
        id: 'gemstones-collection',
        name: 'Gemstones',
        image: '/gemstones.png',
    },
    {
        id: 'necklaces-accessories',
        name: 'Necklaces',
        image: '/necklaces.png',
    },
    {
        id: 'watches-timepieces',
        name: 'Watches',
        image: '/watches.png',
    },
    {
        id: 'diamonds-precious',
        name: 'Diamonds',
        image: '/diamond.png',
    },
];

export const getCategoriesData = () => {
    return mockCategories;
};
