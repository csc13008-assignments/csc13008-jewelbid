'use client';

import { useEffect, useState } from 'react';
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
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useFiltersStore } from '@/stores/filtersStore';
import { cn } from '@/lib/utils';

interface HeaderProps {
    showNavigation?: boolean;
}

const Header = ({ showNavigation = true }: HeaderProps) => {
    const router = useRouter();
    const { user: currentUser, signOut, hydrate } = useAuthStore();
    const { categoryFilterOptions, fetchCategories } = useCategoriesStore();
    const {
        brandOptions,
        materialOptions,
        targetAudienceOptions,
        auctionStatusOptions,
        fetchAllFilters,
    } = useFiltersStore();
    const [activeItem, setActiveItem] = useState('Home');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        hydrate();
        void fetchCategories();
        void fetchAllFilters();

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hydrate, fetchCategories, fetchAllFilters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(
                `/search-result?q=${encodeURIComponent(searchQuery.trim())}`,
            );
            setSearchQuery('');
        }
    };

    const handleLogout = async () => {
        await signOut();
        setOpenDropdown(null);
        void router.push('/');
    };

    const dropdownData = {
        'Jewelry Type':
            categoryFilterOptions.length > 0
                ? categoryFilterOptions.map((c) => c.label)
                : [],
        Brand: brandOptions.length > 0 ? brandOptions.map((b) => b.label) : [],
        Material:
            materialOptions.length > 0
                ? materialOptions.map((m) => m.label)
                : [],
        'Target Audience':
            targetAudienceOptions.length > 0
                ? targetAudienceOptions.map((t) => t.label)
                : [],
        'Ongoing Auction':
            auctionStatusOptions.length > 0
                ? auctionStatusOptions.map((a) => a.label)
                : [],
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
        <header
            className={cn(
                'sticky top-0 z-50 w-full font-body transition-all duration-300 border-b',
                scrolled
                    ? 'bg-white/90 backdrop-blur-md border-dark-primary/20 shadow-md py-0'
                    : 'bg-secondary border-dark-primary py-2',
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-sm hidden lg:block">
                        <form
                            onSubmit={handleSearch}
                            className="relative group"
                        >
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search
                                    className="h-5 w-5 text-neutral-400 group-focus-within:text-dark-primary transition-colors"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for brand, categories..."
                                className="block w-full h-11 pl-10 pr-4 rounded-xl border border-dark-primary/30 bg-white text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-dark-primary/50 focus:border-dark-primary transition-all shadow-sm hover:shadow-md"
                            />
                        </form>
                    </div>

                    {/* Logo */}
                    <div className="flex-1 flex justify-center">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                                <Image
                                    src="/logo.svg"
                                    alt="JewelBid Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h1 className="text-3xl font-heading font-normal text-neutral-900 tracking-wide group-hover:text-dark-primary transition-colors">
                                JEWELBID
                            </h1>
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex-1 flex justify-end items-center gap-4">
                        <button className="p-2 hover:bg-dark-primary/10 rounded-full transition-colors relative group">
                            <Search className="w-6 h-6 text-black lg:hidden" />
                        </button>

                        {currentUser ? (
                            <>
                                {currentUser.role === 'Seller' ? (
                                    <Link
                                        href="/create-auction"
                                        className="hidden md:block"
                                    >
                                        <Button
                                            variant="muted"
                                            size="md"
                                            className="px-6 shadow-md hover:shadow-lg"
                                        >
                                            Sell Your Jewelry
                                        </Button>
                                    </Link>
                                ) : currentUser.role === 'Bidder' ? (
                                    <Link
                                        href="/upgrade-to-seller"
                                        className="hidden md:block"
                                    >
                                        <Button
                                            variant="muted"
                                            size="md"
                                            className="px-6 shadow-md hover:shadow-lg"
                                        >
                                            Upgrade to Seller
                                        </Button>
                                    </Link>
                                ) : null}

                                <Link href="/favorites">
                                    <button className="p-2.5 hover:bg-dark-primary/10 rounded-full transition-all hover:scale-105 group relative">
                                        <Heart className="w-6 h-6 text-neutral-700 group-hover:text-red-500 transition-colors" />
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
                                        className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-white/50 rounded-full transition-all border border-transparent hover:border-dark-primary/20"
                                    >
                                        {currentUser.profileImage &&
                                        (currentUser.profileImage.startsWith(
                                            'http',
                                        ) ||
                                            currentUser.profileImage.startsWith(
                                                '/',
                                            )) ? (
                                            <Image
                                                src={currentUser.profileImage}
                                                alt={currentUser.fullname}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-dark-primary/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-dark-primary" />
                                            </div>
                                        )}
                                        <span className="font-body font-medium text-neutral-800 hidden sm:block">
                                            {currentUser.fullname.split(' ')[0]}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${openDropdown === 'user' ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {openDropdown === 'user' && (
                                        <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-neutral-100 shadow-xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-4 border-b border-neutral-100 bg-secondary/30">
                                                <p className="font-medium text-neutral-900">
                                                    {currentUser.fullname}
                                                </p>
                                                <p className="text-xs text-neutral-500 truncate">
                                                    {currentUser.email}
                                                </p>
                                            </div>
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        router.push(
                                                            '/profile-settings',
                                                        );
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-secondary rounded-xl transition-colors"
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
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-secondary rounded-xl transition-colors"
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
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-secondary rounded-xl transition-colors"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    Favorite Items
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        router.push('/my-bids');
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-secondary rounded-xl transition-colors"
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
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-secondary rounded-xl transition-colors"
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
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-secondary rounded-xl transition-colors"
                                                    >
                                                        <Grid3X3 className="w-4 h-4" />
                                                        Seller Dashboard
                                                    </button>
                                                )}
                                                <div className="my-2 border-t border-neutral-100"></div>
                                                <button
                                                    onClick={() =>
                                                        void handleLogout()
                                                    }
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
                                    variant="muted"
                                    size="md"
                                    className="px-8 shadow-md hover:shadow-lg"
                                >
                                    Log In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                {showNavigation && (
                    <nav className="hidden lg:block">
                        <div className="flex items-center justify-center space-x-1 py-2">
                            {navItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative group"
                                    onMouseEnter={() =>
                                        hasDropdown(item) &&
                                        setOpenDropdown(item)
                                    }
                                >
                                    <button
                                        onClick={(e) =>
                                            handleItemClick(item, e)
                                        }
                                        className={cn(
                                            'flex items-center gap-1 px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-300',
                                            activeItem === item ||
                                                openDropdown === item
                                                ? 'bg-dark-primary text-white shadow-md'
                                                : 'text-neutral-600 hover:bg-primary/50 hover:text-dark-primary',
                                        )}
                                    >
                                        {item}
                                        {hasDropdown(item) && (
                                            <ChevronDown
                                                className={cn(
                                                    'w-3 h-3 transition-transform duration-200',
                                                    openDropdown === item
                                                        ? 'rotate-180'
                                                        : '',
                                                )}
                                            />
                                        )}
                                    </button>

                                    {hasDropdown(item) &&
                                        openDropdown === item && (
                                            <div
                                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-neutral-100 shadow-xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                                                onMouseLeave={() =>
                                                    setOpenDropdown(null)
                                                }
                                            >
                                                <div className="p-2">
                                                    {dropdownData[
                                                        item as keyof typeof dropdownData
                                                    ].map(
                                                        (subItem, subIndex) => (
                                                            <button
                                                                key={subIndex}
                                                                onClick={() =>
                                                                    handleDropdownItemClick(
                                                                        item,
                                                                        subItem,
                                                                    )
                                                                }
                                                                className="w-full text-left block px-4 py-2.5 text-sm text-neutral-700 hover:bg-secondary rounded-xl transition-colors"
                                                            >
                                                                {subItem}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
