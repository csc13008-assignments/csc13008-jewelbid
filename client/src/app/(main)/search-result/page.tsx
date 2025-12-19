'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/modules/shared/components/ui';
import { useProductsStore } from '@/stores/productsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useFiltersStore } from '@/stores/filtersStore';
import { BreadcrumbItem, SearchFilters } from '@/types';
import { cn } from '@/lib/utils';

function SearchResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [sortBy, setSortBy] = useState('newest');

    const {
        searchResults,
        searchTotal,
        isLoading: isLoadingProducts,
        fetchProducts,
        searchProducts,
    } = useProductsStore();

    const {
        categoryFilterOptions,
        fetchCategories,
        isLoading: isLoadingCategories,
    } = useCategoriesStore();

    const {
        brandOptions,
        materialOptions,
        targetAudienceOptions,
        auctionStatusOptions,
        fetchAllFilters,
        getFilterLabel,
        isLoading: isLoadingFilters,
    } = useFiltersStore();

    const filters: SearchFilters = {
        category: searchParams.get('category') || undefined,
        brand: searchParams.get('brand') || undefined,
        material: searchParams.get('material') || undefined,
        targetAudience: searchParams.get('target') || undefined,
        auctionStatus: searchParams.get('status') || undefined,
    };

    // Get search query from URL
    const searchQuery = searchParams.get('q') || '';

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
    const itemsPerPage = 9; // Increased for better grid layout

    // Fetch filters on mount
    useEffect(() => {
        void fetchAllFilters();
    }, [fetchAllFilters]);

    // Fetch products when filters, search query or page changes
    const fetchData = useCallback(() => {
        if (searchQuery) {
            // Search by query with optional filters
            void searchProducts({
                q: searchQuery,
                category: filters.category,
                page: currentPage,
                limit: itemsPerPage,
            });
        } else {
            // Fetch products with all filters
            const apiFilters: {
                category?: string;
                brand?: string;
                material?: string;
                targetAudience?: string;
                auctionStatus?: string;
            } = {};

            // Capitalize category to match backend enum
            if (filters.category) {
                apiFilters.category =
                    filters.category.charAt(0).toUpperCase() +
                    filters.category.slice(1);
            }
            if (filters.brand) {
                apiFilters.brand = filters.brand;
            }
            if (filters.material) {
                apiFilters.material = filters.material;
            }
            if (filters.targetAudience) {
                apiFilters.targetAudience = filters.targetAudience;
            }
            if (filters.auctionStatus) {
                apiFilters.auctionStatus = filters.auctionStatus;
            }

            void fetchProducts(currentPage, itemsPerPage, apiFilters);
        }
    }, [
        searchQuery,
        filters.category,
        filters.brand,
        filters.material,
        filters.targetAudience,
        filters.auctionStatus,
        currentPage,
        fetchProducts,
        searchProducts,
    ]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    // Fetch categories on mount
    useEffect(() => {
        void fetchCategories();
    }, [fetchCategories]);

    const getSortedAuctions = () => {
        const sorted = [...searchResults];

        switch (sortBy) {
            case 'newest':
                return sorted.sort(
                    (a, b) =>
                        new Date(b.endDate).getTime() -
                        new Date(a.endDate).getTime(),
                );
            case 'oldest':
                return sorted.sort(
                    (a, b) =>
                        new Date(a.endDate).getTime() -
                        new Date(b.endDate).getTime(),
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

    const totalItems = searchTotal || sortedAuctions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = sortedAuctions;

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
        if (searchQuery) {
            return `Search results for "${searchQuery}"`;
        } else if (filters.category) {
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

    const isLoading =
        isLoadingProducts || isLoadingCategories || isLoadingFilters;

    const filterOptions = {
        category: categoryFilterOptions,
        brand: brandOptions,
        material: materialOptions,
        targetAudience: targetAudienceOptions,
        auctionStatus: auctionStatusOptions,
    };

    const sortOptions = [
        { label: 'Newest Arrivals', value: 'newest' },
        { label: 'Ending Soonest', value: 'oldest' },
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

    // Check if any filter is active
    const hasActiveFilters = Object.values(filters).some(
        (value) => value !== undefined,
    );

    // Clear all filters
    const handleClearFilters = () => {
        router.push('/search-result');
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-secondary/30">
            {/* Breadcrumb Section */}
            <div className="bg-white border-b border-neutral-100 sticky top-[80px] z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm overflow-x-auto no-scrollbar">
                        {breadcrumbs.map((crumb, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 whitespace-nowrap"
                            >
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                                )}
                                {crumb.href ? (
                                    <a
                                        href={crumb.href}
                                        className="text-neutral-500 hover:text-dark-primary transition-colors"
                                    >
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="text-neutral-900 font-medium">
                                        {crumb.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Banner Section */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <Image
                    src="/bia.png"
                    alt="Banner"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-center text-white p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="font-heading !text-white text-5xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                            {pageTitle}
                        </h1>
                        <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-md">
                            Discover unique pieces and find your perfect match
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-64 shrink-0 hidden lg:block">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                                <h3 className="font-heading text-lg font-bold text-neutral-900">
                                    Filters
                                </h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {[
                                    {
                                        id: 'category',
                                        label: 'Jewelry Type',
                                        options: filterOptions.category,
                                    },
                                    {
                                        id: 'brand',
                                        label: 'Brand',
                                        options: filterOptions.brand,
                                    },
                                    {
                                        id: 'material',
                                        label: 'Material',
                                        options: filterOptions.material,
                                    },
                                    {
                                        id: 'targetAudience',
                                        label: 'Target Audience',
                                        options: filterOptions.targetAudience,
                                    },
                                    {
                                        id: 'auctionStatus',
                                        label: 'Auction Status',
                                        options: filterOptions.auctionStatus,
                                    },
                                ].map((section) => (
                                    <div
                                        key={section.id}
                                        className="border-b border-neutral-200 pb-4 last:border-0 last:pb-0"
                                    >
                                        <button
                                            onClick={() =>
                                                toggleFilter(section.id)
                                            }
                                            className="flex items-center justify-between w-full font-body font-bold text-neutral-900 mb-3 hover:text-dark-primary transition-colors"
                                        >
                                            {section.label}
                                            <ChevronDown
                                                className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${openFilters.has(section.id) ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        <div
                                            className={cn(
                                                'space-y-2 overflow-hidden transition-all duration-300 ease-in-out',
                                                openFilters.has(section.id)
                                                    ? 'max-h-[500px] opacity-100'
                                                    : 'max-h-0 opacity-0',
                                            )}
                                        >
                                            {section.options.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center gap-3 cursor-pointer group py-1"
                                                >
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={section.id}
                                                            value={option.value}
                                                            checked={
                                                                // @ts-expect-error - filters type is dynamic
                                                                filters[
                                                                    section.id
                                                                ] ===
                                                                option.value
                                                            }
                                                            onChange={(e) =>
                                                                handleFilterChange(
                                                                    section.id,
                                                                    e.target
                                                                        .value,
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            className="peer appearance-none w-4 h-4 border border-neutral-300 rounded-full checked:border-dark-primary checked:bg-dark-primary transition-all"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
                                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-neutral-600 group-hover:text-dark-primary transition-colors">
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-neutral-500">
                                Showing{' '}
                                <span className="font-medium text-neutral-900">
                                    {currentItems.length}
                                </span>{' '}
                                results
                            </p>

                            <div className="hidden lg:flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm">
                                <span className="text-sm text-neutral-500">
                                    Sort by:
                                </span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="text-sm font-medium text-neutral-900 bg-transparent border-none focus:ring-0 cursor-pointer pr-8"
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

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-2xl h-[400px] animate-pulse border border-neutral-100 shadow-sm"
                                    ></div>
                                ))}
                            </div>
                        ) : currentItems.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
                                    <span className="text-4xl">💎</span>
                                </div>
                                <h3 className="font-heading text-2xl font-medium text-neutral-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-neutral-500 max-w-md mx-auto mb-8">
                                    We couldn&apos;t find any jewelry matching
                                    your criteria. Try adjusting your filters or
                                    search for something else.
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-6 py-2.5 bg-dark-primary text-white rounded-xl font-medium hover:bg-primary hover:text-dark-primary transition-all shadow-md hover:shadow-lg"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentItems.map((auction, index) => (
                                    <div
                                        key={auction.id}
                                        className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <ProductCard auction={auction} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12 animate-in fade-in duration-700 delay-300">
                                <button
                                    onClick={() =>
                                        currentPage > 1 &&
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className={cn(
                                        'w-10 h-10 flex items-center justify-center rounded-xl border transition-all',
                                        currentPage === 1
                                            ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
                                            : 'border-neutral-300 text-neutral-600 hover:bg-white hover:border-dark-primary hover:text-dark-primary hover:shadow-md',
                                    )}
                                >
                                    <ChevronRight className="w-5 h-5 rotate-180" />
                                </button>

                                {getPageNumbers().map((page, index) =>
                                    page === '...' ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="w-10 h-10 flex items-center justify-center text-neutral-400"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page as number)
                                            }
                                            className={cn(
                                                'w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-all',
                                                currentPage === page
                                                    ? 'bg-dark-primary text-white shadow-md scale-110'
                                                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-dark-primary hover:text-dark-primary hover:shadow-sm',
                                            )}
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
                                    className={cn(
                                        'w-10 h-10 flex items-center justify-center rounded-xl border transition-all',
                                        currentPage === totalPages
                                            ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
                                            : 'border-neutral-300 text-neutral-600 hover:bg-white hover:border-dark-primary hover:text-dark-primary hover:shadow-md',
                                    )}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

// Wrapper component with Suspense for useSearchParams
export default function SearchResultPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-dark-primary rounded-full animate-spin"></div>
                </div>
            }
        >
            <SearchResultContent />
        </Suspense>
    );
}
