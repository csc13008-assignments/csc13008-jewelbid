'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Settings,
    Heart,
    User,
    Trophy,
    LogOut,
    Grid3X3,
    Gavel,
    Star,
    ChevronRight,
} from 'lucide-react';
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

        void initializeUser();
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
            icon: Star,
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
            icon: Gavel,
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
        if (
            item.requiresSeller &&
            currentUser?.role?.toLowerCase() !== 'seller'
        ) {
            return false;
        }
        return true;
    });

    const isActiveItem = (href: string) => {
        return pathname === href;
    };

    return (
        <div
            className={`bg-white rounded-2xl shadow-lg border border-primary/50 overflow-hidden ${className}`}
        >
            {/* User Header */}
            <div className="p-6 bg-gradient-to-br from-dark-primary to-[#8B7E6A] text-white relative overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-10 -mb-10 blur-xl"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-inner">
                        <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="font-heading font-medium text-white text-lg tracking-wide">
                            {currentUser?.name || 'User'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <p className="text-xs text-white/80 capitalize font-medium tracking-wider">
                                {currentUser?.role || 'Bidder'} Account
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
                {filteredItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = isActiveItem(item.href);

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 text-sm rounded-xl transition-all duration-300 group relative overflow-hidden ${
                                isActive
                                    ? 'bg-dark-primary text-white font-medium shadow-md translate-x-1'
                                    : 'text-neutral-600 hover:bg-primary/30 hover:text-dark-primary hover:translate-x-1'
                            }`}
                            style={{
                                animation: `fadeInLeft 0.4s ease-out ${index * 0.05}s both`,
                            }}
                        >
                            <IconComponent
                                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-dark-primary/70 group-hover:text-dark-primary'}`}
                            />
                            <span className="font-medium relative z-10">
                                {item.label}
                            </span>

                            {isActive && (
                                <ChevronRight className="w-4 h-4 ml-auto text-white/80" />
                            )}
                        </Link>
                    );
                })}

                {/* Divider */}
                <div className="my-4 border-t border-primary/30 mx-2"></div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium group hover:shadow-sm"
                >
                    <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    Log out
                </button>
            </nav>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
