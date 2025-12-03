'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/modules/shared/components/ui';
import { mockAuctions } from '@/lib/mockData';
import { BreadcrumbItem, SearchFilters } from '@/types';
import { getFilterLabel } from '@/lib/searchUtils';

export default function SearchResultPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [sortBy, setSortBy] = useState('newest');

    const filters: SearchFilters = {
        category: searchParams.get('category') || undefined,
        brand: searchParams.get('brand') || undefined,
        material: searchParams.get('material') || undefined,
        targetAudience: searchParams.get('target') || undefined,
        auctionStatus: searchParams.get('status') || undefined,
    };

    const [openFilters, setOpenFilters] = useState<Set<string>>(
        new Set([
            'category',
            'brand',
            'material',
            'targetAudience',
            'auctionStatus',
        ]),
    );
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const getSortedAuctions = () => {
        const sorted = [...mockAuctions];

        switch (sortBy) {
            case 'newest':
                return sorted.sort(
                    (a, b) => b.endDate.getTime() - a.endDate.getTime(),
                );
            case 'oldest':
                return sorted.sort(
                    (a, b) => a.endDate.getTime() - b.endDate.getTime(),
                );
            case 'price-asc':
                return sorted.sort((a, b) => a.currentBid - b.currentBid);
            case 'price-desc':
                return sorted.sort((a, b) => b.currentBid - a.currentBid);
            case 'popular':
                return sorted.sort((a, b) => b.bidCount - a.bidCount);
            default:
                return sorted;
        }
    };

    const sortedAuctions = getSortedAuctions();

    const totalItems = sortedAuctions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedAuctions.slice(startIndex, endIndex);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++)
                    pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', href: '/' },
            { label: 'All Items', href: '/search-result' },
        ];

        if (filters.category) {
            breadcrumbs.push({ label: 'Jewelry Type', href: '/search-result' });
            breadcrumbs.push({
                label: getFilterLabel('category', filters.category),
            });
        } else if (filters.brand) {
            breadcrumbs.push({ label: 'Brand', href: '/search-result' });
            breadcrumbs.push({ label: getFilterLabel('brand', filters.brand) });
        } else if (filters.material) {
            breadcrumbs.push({ label: 'Material', href: '/search-result' });
            breadcrumbs.push({
                label: getFilterLabel('material', filters.material),
            });
        } else if (filters.targetAudience) {
            breadcrumbs.push({
                label: 'Target Audience',
                href: '/search-result',
            });
            breadcrumbs.push({
                label: getFilterLabel('targetAudience', filters.targetAudience),
            });
        } else if (filters.auctionStatus) {
            breadcrumbs.push({
                label: 'Ongoing Auction',
                href: '/search-result',
            });
            breadcrumbs.push({
                label: getFilterLabel('auctionStatus', filters.auctionStatus),
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    const getPageTitle = (): string => {
        if (filters.category) {
            return getFilterLabel('category', filters.category);
        } else if (filters.brand) {
            return getFilterLabel('brand', filters.brand);
        } else if (filters.material) {
            return getFilterLabel('material', filters.material);
        } else if (filters.auctionStatus) {
            return getFilterLabel('auctionStatus', filters.auctionStatus);
        } else if (filters.targetAudience) {
            return getFilterLabel('targetAudience', filters.targetAudience);
        }
        return 'All Items';
    };

    const pageTitle = getPageTitle();

    const filterOptions = {
        category: [
            { label: 'Ring', value: 'ring' },
            { label: 'Necklace', value: 'necklace' },
            { label: 'Watch', value: 'watch' },
            { label: 'Earring', value: 'earring' },
            { label: 'Anklet', value: 'anklet' },
            { label: 'Pendant', value: 'pendant' },
            { label: 'Charm', value: 'charm' },
        ],
        brand: [
            { label: 'Cartier', value: 'cartier' },
            { label: 'Tiffany & Co.', value: 'tiffany' },
            { label: 'Pandora', value: 'pandora' },
            { label: 'Gucci', value: 'gucci' },
            { label: 'Dior', value: 'dior' },
            { label: 'Local Artisan Brands', value: 'local' },
        ],
        material: [
            { label: 'Gold', value: 'gold' },
            { label: 'Silver', value: 'silver' },
            { label: 'Platinum', value: 'platinum' },
            { label: 'Diamond', value: 'diamond' },
            { label: 'Gemstone', value: 'gemstone' },
            { label: 'Leather', value: 'leather' },
        ],
        targetAudience: [
            { label: 'For Men', value: 'for-men' },
            { label: 'For Women', value: 'for-women' },
            { label: 'For Couples', value: 'for-couples' },
            { label: 'For Kids', value: 'for-kids' },
            { label: 'Unisex', value: 'unisex' },
        ],
        auctionStatus: [
            { label: 'Ending Soon', value: 'ending-soon' },
            { label: 'Most Bids', value: 'most-bids' },
            { label: 'Highest Price', value: 'highest-price' },
            { label: 'Newly Listed', value: 'newly-listed' },
        ],
    };

    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
        { label: 'Price: Low to High', value: 'price-asc' },
        { label: 'Price: High to Low', value: 'price-desc' },
        { label: 'Most Popular', value: 'popular' },
    ];

    const toggleFilter = (filterName: string) => {
        setOpenFilters((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(filterName)) {
                newSet.delete(filterName);
            } else {
                newSet.add(filterName);
            }
            return newSet;
        });
    };

    const handleFilterChange = (
        filterType: string,
        value: string,
        checked: boolean,
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        const paramMap: Record<string, string> = {
            category: 'category',
            brand: 'brand',
            material: 'material',
            targetAudience: 'target',
            auctionStatus: 'status',
        };

        const paramName = paramMap[filterType];

        if (checked) {
            params.set(paramName, value);
        } else {
            params.delete(paramName);
        }

        const newUrl = params.toString()
            ? `/search-result?${params.toString()}`
            : '/search-result';
        router.push(newUrl);

        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-neutral-50 border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                                )}
                                {crumb.href ? (
                                    <a
                                        href={crumb.href}
                                        className="text-neutral-600 hover:text-black transition-colors"
                                    >
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="text-black font-medium">
                                        {crumb.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative h-48 bg-neutral-200">
                <Image
                    src="/bia.png"
                    alt="Banner"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    <aside className="w-64 shrink-0">
                        <div className="space-y-6">
                            <div className="border-b border-neutral-200 pb-4">
                                <button
                                    onClick={() => toggleFilter('category')}
                                    className="flex items-center justify-between w-full font-body font-bold text-black mb-3"
                                >
                                    Category
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${openFilters.has('category') ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFilters.has('category') && (
                                    <div className="space-y-2">
                                        {filterOptions.category.map(
                                            (option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        value={option.value}
                                                        checked={
                                                            filters.category ===
                                                            option.value
                                                        }
                                                        onChange={(e) =>
                                                            handleFilterChange(
                                                                'category',
                                                                e.target.value,
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm text-neutral-700">
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="border-b border-neutral-200 pb-4">
                                <button
                                    onClick={() => toggleFilter('brand')}
                                    className="flex items-center justify-between w-full font-body font-bold text-black mb-3"
                                >
                                    Brand
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${openFilters.has('brand') ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFilters.has('brand') && (
                                    <div className="space-y-2">
                                        {filterOptions.brand.map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="brand"
                                                    value={option.value}
                                                    checked={
                                                        filters.brand ===
                                                        option.value
                                                    }
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            'brand',
                                                            e.target.value,
                                                            e.target.checked,
                                                        )
                                                    }
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-neutral-700">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-b border-neutral-200 pb-4">
                                <button
                                    onClick={() => toggleFilter('material')}
                                    className="flex items-center justify-between w-full font-body font-bold text-black mb-3"
                                >
                                    Material
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${openFilters.has('material') ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFilters.has('material') && (
                                    <div className="space-y-2">
                                        {filterOptions.material.map(
                                            (option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="material"
                                                        value={option.value}
                                                        checked={
                                                            filters.material ===
                                                            option.value
                                                        }
                                                        onChange={(e) =>
                                                            handleFilterChange(
                                                                'material',
                                                                e.target.value,
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm text-neutral-700">
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="border-b border-neutral-200 pb-4">
                                <button
                                    onClick={() =>
                                        toggleFilter('targetAudience')
                                    }
                                    className="flex items-center justify-between w-full font-body font-bold text-black mb-3"
                                >
                                    Target Audience
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${openFilters.has('targetAudience') ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFilters.has('targetAudience') && (
                                    <div className="space-y-2">
                                        {filterOptions.targetAudience.map(
                                            (option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="targetAudience"
                                                        value={option.value}
                                                        checked={
                                                            filters.targetAudience ===
                                                            option.value
                                                        }
                                                        onChange={(e) =>
                                                            handleFilterChange(
                                                                'targetAudience',
                                                                e.target.value,
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm text-neutral-700">
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="border-b border-neutral-200 pb-4">
                                <button
                                    onClick={() =>
                                        toggleFilter('auctionStatus')
                                    }
                                    className="flex items-center justify-between w-full font-body font-bold text-black mb-3"
                                >
                                    Auction Status
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${openFilters.has('auctionStatus') ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFilters.has('auctionStatus') && (
                                    <div className="space-y-2">
                                        {filterOptions.auctionStatus.map(
                                            (option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="auctionStatus"
                                                        value={option.value}
                                                        checked={
                                                            filters.auctionStatus ===
                                                            option.value
                                                        }
                                                        onChange={(e) =>
                                                            handleFilterChange(
                                                                'auctionStatus',
                                                                e.target.value,
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm text-neutral-700">
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-heading text-4xl font-bold text-black">
                                {pageTitle}
                            </h2>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-neutral-600">
                                        Sort by:
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="border border-primary px-3 py-1.5 text-sm focus:outline-none focus:border-black"
                                    >
                                        {sortOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {currentItems.map((auction) => (
                                <ProductCard
                                    key={auction.id}
                                    auction={auction}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <button
                                    onClick={() =>
                                        currentPage > 1 &&
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className={`w-8 h-8 flex items-center justify-center border border-primary ${
                                        currentPage === 1
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-secondary'
                                    }`}
                                >
                                    ‹
                                </button>

                                {getPageNumbers().map((page, index) =>
                                    page === '...' ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="px-2"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page as number)
                                            }
                                            className={`w-8 h-8 flex items-center justify-center ${
                                                currentPage === page
                                                    ? 'bg-dark-primary text-sm text-black'
                                                    : 'border border-primary hover:bg-secondary text-sm'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}

                                <button
                                    onClick={() =>
                                        currentPage < totalPages &&
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className={`w-8 h-8 flex items-center justify-center border border-primary ${
                                        currentPage === totalPages
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-secondary'
                                    }`}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
