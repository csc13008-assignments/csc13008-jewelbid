'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Grid3X3,
    Package,
    Users,
    ChevronRight,
    LogOut,
    Loader2,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { useAuthStore } from '@/stores/authStore';

const navItems: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
    badge?: number;
}[] = [
    {
        href: '/admin/categories',
        icon: Grid3X3,
        label: 'Categories',
        description: 'Manage product categories',
    },
    {
        href: '/admin/products',
        icon: Package,
        label: 'Products',
        description: 'Manage auction products',
    },
    {
        href: '/admin/users',
        icon: Users,
        label: 'Users',
        description: 'Manage users & upgrades',
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useAuthStore();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeProducts: 0,
        totalCategories: 0,
        upgradeRequests: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [users, products, categories, upgrades] = await Promise.all([
                adminApi.getUsers().catch(() => []),
                adminApi.getProducts().catch(() => []),
                adminApi.getCategories().catch(() => []),
                adminApi.getUpgradeRequests().catch(() => []),
            ]);

            const usersData = Array.isArray(users)
                ? users
                : (users as any).data || [];
            // Handle products response - can be array or object with products/data
            let productsData: any[] = [];
            if (Array.isArray(products)) {
                productsData = products;
            } else if ((products as any).products) {
                productsData = (products as any).products;
            } else if ((products as any).data) {
                productsData = (products as any).data;
            }
            const categoriesData = Array.isArray(categories)
                ? categories
                : (categories as any).data || [];

            const upgradesData = Array.isArray(upgrades) ? upgrades : [];

            setStats({
                totalUsers: usersData.length,
                activeProducts: productsData.filter(
                    (p: any) => p.status === 'Active',
                ).length,
                totalCategories: categoriesData.length,
                upgradeRequests: upgradesData.length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const dynamicNavItems = navItems.map((item) => {
        if (item.label === 'Users') {
            return {
                ...item,
                badge:
                    stats.upgradeRequests > 0
                        ? stats.upgradeRequests
                        : undefined,
            };
        }
        return item;
    });

    const handleLogout = () => {
        void signOut();
        router.push('/signin');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-primary p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dark-primary to-amber-600 flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-heading text-xl font-bold text-neutral-900">
                            Admin Panel
                        </h2>
                        <p className="text-xs text-neutral-500">
                            Management Dashboard
                        </p>
                    </div>
                </div>
            </div>

            <nav className="space-y-2">
                {dynamicNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group flex items-center justify-between p-3 rounded-xl transition-all duration-200
                                ${
                                    isActive
                                        ? 'bg-dark-primary text-white shadow-md'
                                        : 'hover:bg-primary text-neutral-700 hover:text-dark-primary'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <Icon
                                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-dark-primary'}`}
                                />
                                <div>
                                    <div
                                        className={`font-medium text-sm ${isActive ? 'text-white' : 'text-neutral-900'}`}
                                    >
                                        {item.label}
                                    </div>
                                    <div
                                        className={`text-xs ${isActive ? 'text-white/80' : 'text-neutral-500'}`}
                                    >
                                        {item.description}
                                    </div>
                                </div>
                            </div>

                            {item.badge && (
                                <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                                    {item.badge}
                                </span>
                            )}

                            {isActive && (
                                <ChevronRight className="w-4 h-4 text-white" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 pt-6 border-t border-primary">
                <div className="text-xs text-neutral-500 mb-2">Quick Stats</div>
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-dark-primary" />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-600">
                                Total Users
                            </span>
                            <span className="font-bold text-dark-primary">
                                {stats.totalUsers}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-600">
                                Active Products
                            </span>
                            <span className="font-bold text-dark-primary">
                                {stats.activeProducts}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-600">Categories</span>
                            <span className="font-bold text-dark-primary">
                                {stats.totalCategories}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-600">
                                Upgrade Requests
                            </span>
                            <span className="font-bold text-red-500">
                                {stats.upgradeRequests}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Logout Button */}
            <div className="mt-6 pt-6 border-t border-primary">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 group"
                >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
}
