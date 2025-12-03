'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, Heart, User, Trophy, LogOut, Grid3X3 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import type { User as UserType } from '@/types';

interface SidebarItem {
    id: string;
    icon: LucideIcon;
    label: string;
    href: string;
    requiresSeller?: boolean;
}

interface UserSidebarProps {
    className?: string;
}

export default function UserSidebar({ className = '' }: UserSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
            }
        };

        initializeUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        void router.push('/');
    };

    const sidebarItems: SidebarItem[] = [
        {
            id: 'profile',
            icon: Settings,
            label: 'Profile Settings',
            href: '/profile-settings',
        },
        {
            id: 'ratings',
            icon: User,
            label: 'My Ratings',
            href: '/my-ratings',
        },
        {
            id: 'favorites',
            icon: Heart,
            label: 'Favorite Items',
            href: '/favorites',
        },
        {
            id: 'bids',
            icon: User,
            label: 'My Bids',
            href: '/my-bids',
        },
        {
            id: 'auctions',
            icon: Trophy,
            label: 'Won Auctions',
            href: '/won-auctions',
        },
        {
            id: 'seller-dashboard',
            icon: Grid3X3,
            label: 'Seller Dashboard',
            href: '/seller-dashboard',
            requiresSeller: true,
        },
    ];

    // Filter items based on user role
    const filteredItems = sidebarItems.filter((item) => {
        if (item.requiresSeller && currentUser?.role !== 'seller') {
            return false;
        }
        return true;
    });

    const isActiveItem = (href: string) => {
        return pathname === href;
    };

    return (
        <div className={`bg-white border border-neutral-200 p-1 ${className}`}>
            <nav className="space-y-1">
                {filteredItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = isActiveItem(item.href);

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                isActive
                                    ? 'bg-neutral-100 text-black border-l-2 border-black'
                                    : 'text-neutral-600 hover:bg-neutral-50'
                            }`}
                        >
                            <IconComponent className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Log out
                </button>
            </nav>
        </div>
    );
}
