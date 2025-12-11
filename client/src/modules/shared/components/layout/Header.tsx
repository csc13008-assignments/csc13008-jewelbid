'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    ChevronDown,
    Heart,
    User,
    Settings,
    Star,
    Trophy,
    Grid3X3,
    LogOut,
} from 'lucide-react';
import Button from '../ui/Button';
import { buildSearchUrl } from '@/lib/searchUtils';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

const Header = () => {
    const router = useRouter();
    const { user: currentUser, signOut, hydrate } = useAuthStore();
    const [activeItem, setActiveItem] = useState('Home');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        // Hydrate auth state from localStorage on mount
        hydrate();
    }, [hydrate]);

    const handleLogout = async () => {
        await signOut();
        setOpenDropdown(null);
        void router.push('/');
    };

    const dropdownData = {
        'Jewelry Type': [
            'Ring',
            'Necklace',
            'Watch',
            'Earring',
            'Anklet',
            'Pendant',
            'Charm',
        ],
        Brand: [
            'Cartier',
            'Tiffany & Co',
            'Pandora',
            'Gucci',
            'Dior',
            'Local Artisan Brands',
        ],
        Material: [
            'Gold',
            'Silver',
            'Platinum',
            'Diamond',
            'Gemstone',
            'Leather',
        ],
        'Target Audience': [
            'For Men',
            'For Women',
            'For Couples',
            'For Kids',
            'Unisex',
        ],
        'Ongoing Auction': [
            'Ending Soon',
            'Most Bids',
            'Highest Price',
            'Newly Listed',
        ],
    };

    const navItems = [
        'Home',
        'All Items',
        'Jewelry Type',
        'Brand',
        'Material',
        'Target Audience',
        'Ongoing Auction',
        'Contact Us',
    ];

    const hasDropdown = (item: string) => {
        return Object.keys(dropdownData).includes(item);
    };

    const handleItemClick = (item: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (hasDropdown(item)) {
            setOpenDropdown(openDropdown === item ? null : item);
        } else {
            setActiveItem(item);
            setOpenDropdown(null);

            if (item === 'Home') {
                router.push('/');
            } else if (item === 'All Items') {
                router.push('/search-result');
            } else if (item === 'Contact Us') {
                router.push('/contact');
            }
        }
    };

    const handleDropdownItemClick = (parentItem: string, subItem: string) => {
        const value = subItem.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const filters: {
            category?: string;
            brand?: string;
            material?: string;
            targetAudience?: string;
            auctionStatus?: string;
        } = {};

        switch (parentItem) {
            case 'Jewelry Type':
                filters.category = value;
                break;
            case 'Brand':
                filters.brand = value;
                break;
            case 'Material':
                filters.material = value;
                break;
            case 'Target Audience':
                filters.targetAudience = value;
                break;
            case 'Ongoing Auction':
                filters.auctionStatus = value;
                break;
        }

        const url = buildSearchUrl(filters);
        router.push(url);
        setOpenDropdown(null);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-secondary font-body border-b border-dark-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-1 max-w-sm">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <Search
                                    className="h-5 w-5 text-black"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for brand, categories..."
                                className="block w-92 h-11 pl-10 pr-3 border border-dark-primary bg-white text-black placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-dark-primary font-body"
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/logo.svg"
                                alt="JewelBid Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                            <h1 className="text-3xl font-heading font-normal text-neutral-900">
                                JEWELBID
                            </h1>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-end items-center gap-4">
                        {currentUser ? (
                            <>
                                {currentUser.role === 'Seller' ? (
                                    <Link href="/create-auction">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="px-6"
                                        >
                                            Sell Your Jewelry
                                        </Button>
                                    </Link>
                                ) : currentUser.role === 'Bidder' ? (
                                    <Link href="/upgrade-to-seller">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="px-6"
                                        >
                                            Upgrade to Seller
                                        </Button>
                                    </Link>
                                ) : null}

                                <Link href="/favorites">
                                    <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                        <Heart className="w-6 h-6 text-black" />
                                    </button>
                                </Link>

                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setOpenDropdown(
                                                openDropdown === 'user'
                                                    ? null
                                                    : 'user',
                                            )
                                        }
                                        className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                    >
                                        <User className="w-6 h-6 text-black" />
                                        <span className="font-body font-medium text-black">
                                            {currentUser.fullname}
                                        </span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {openDropdown === 'user' && (
                                        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-neutral-200 shadow-lg rounded z-50">
                                            <div className="py-2">
                                                <button
                                                    onClick={() => {
                                                        router.push(
                                                            '/profile-settings',
                                                        );
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Profile Settings
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        router.push(
                                                            '/my-ratings',
                                                        );
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                >
                                                    <Star className="w-4 h-4" />
                                                    My Ratings
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        router.push(
                                                            '/favorites',
                                                        );
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    Favorite Items
                                                </button>{' '}
                                                <button
                                                    onClick={() => {
                                                        router.push('/my-bids');
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    My Bids
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        router.push(
                                                            '/won-auctions',
                                                        );
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                >
                                                    <Trophy className="w-4 h-4" />
                                                    Won Auctions
                                                </button>
                                                {currentUser.role ===
                                                    'Seller' && (
                                                    <button
                                                        onClick={() => {
                                                            router.push(
                                                                '/seller-dashboard',
                                                            );
                                                            setOpenDropdown(
                                                                null,
                                                            );
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                    >
                                                        <Grid3X3 className="w-4 h-4" />
                                                        Seller Dashboard
                                                    </button>
                                                )}
                                                <hr className="my-2 border-neutral-200" />
                                                <button
                                                    onClick={() =>
                                                        void handleLogout()
                                                    }
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link href="/signin">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="px-8"
                                >
                                    Log In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <nav>
                    <div className="flex items-center justify-center space-x-8 py-4">
                        {navItems.map((item, index) => (
                            <div
                                key={index}
                                className="relative group"
                                onMouseEnter={() =>
                                    hasDropdown(item) && setOpenDropdown(item)
                                }
                            >
                                <button
                                    onClick={(e) => handleItemClick(item, e)}
                                    className={`
                                        flex items-center gap-1 font-body text-base font-medium transition-all duration-200 pb-1 border-b-2
                                        ${
                                            activeItem === item ||
                                            openDropdown === item
                                                ? 'text-dark-primary border-dark-primary'
                                                : 'text-black border-transparent hover:text-dark-primary hover:border-dark-primary'
                                        }
                                    `}
                                >
                                    {item}
                                    {hasDropdown(item) && (
                                        <ChevronDown className="w-4 h-4 transition-transform" />
                                    )}
                                </button>

                                {hasDropdown(item) && openDropdown === item && (
                                    <div
                                        className="absolute top-full left-0 mt-2 w-48 bg-primary border border-neutral-200 shadow-lg z-50"
                                        onMouseLeave={() =>
                                            setOpenDropdown(null)
                                        }
                                    >
                                        <div className="py-2">
                                            {dropdownData[
                                                item as keyof typeof dropdownData
                                            ].map((subItem, subIndex) => (
                                                <button
                                                    key={subIndex}
                                                    onClick={() =>
                                                        handleDropdownItemClick(
                                                            item,
                                                            subItem,
                                                        )
                                                    }
                                                    className="w-full text-left block px-4 py-2 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                >
                                                    {subItem}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
