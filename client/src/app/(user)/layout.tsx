'use client';

import { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    Heart,
    User,
    Settings,
    Star,
    Trophy,
    Grid3X3,
    LogOut,
    ChevronDown,
} from 'lucide-react';
import Button from '@/modules/shared/components/ui/Button';
import Footer from '@/modules/shared/components/layout/Footer';
import type { User as UserType } from '@/types';

interface UserLayoutProps {
    children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [mounted, setMounted] = useState(false);

    // Handle mounting and user loading
    useEffect(() => {
        // Use a function to avoid direct setState calls in effect
        const initializeUser = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
            } finally {
                setMounted(true);
            }
        };

        initializeUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        void router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col">
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
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
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
                            </Link>
                        </div>

                        <div className="flex-1 flex justify-end items-center gap-4">
                            {mounted && currentUser ? (
                                <>
                                    {currentUser.role === 'seller' ? (
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="px-6"
                                        >
                                            Sell Your Jewelry
                                        </Button>
                                    ) : currentUser.role === 'bidder' ? (
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
                                                {currentUser.username ||
                                                    currentUser.name}
                                            </span>
                                            <ChevronDown className="w-4 h-4" />
                                        </button>

                                        {/* User Dropdown Menu */}
                                        {openDropdown === 'user' && (
                                            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-neutral-200 shadow-lg rounded z-50">
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => {
                                                            router.push(
                                                                '/profile-settings',
                                                            );
                                                            setOpenDropdown(
                                                                null,
                                                            );
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
                                                            setOpenDropdown(
                                                                null,
                                                            );
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
                                                            setOpenDropdown(
                                                                null,
                                                            );
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                    >
                                                        <Heart className="w-4 h-4" />
                                                        Favorite Items
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            router.push(
                                                                '/my-bids',
                                                            );
                                                            setOpenDropdown(
                                                                null,
                                                            );
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
                                                            setOpenDropdown(
                                                                null,
                                                            );
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                    >
                                                        <Trophy className="w-4 h-4" />
                                                        Won Auctions
                                                    </button>

                                                    {currentUser.role ===
                                                        'seller' && (
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
                                                        onClick={handleLogout}
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
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}
