'use client';

import { useState, useEffect } from 'react';
import { Package, Loader2 } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/modules/admin/components/DataTable';
import ConfirmDialog from '@/modules/admin/components/ConfirmDialog';
import StatusBadge from '@/modules/admin/components/StatusBadge';
import { adminApi } from '@/lib/api/admin';
import toast from '@/lib/toast';

interface AdminProduct {
    id: string;
    name: string;
    categoryName: string;
    mainImage: string;
    currentPrice: number;
    buyNowPrice?: number;
    status: string;
    endDate: string;
    seller: { fullname: string };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState<'All' | 'Active' | 'Ended'>('All');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
        null,
    );
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        void fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getProducts();
            // Handle response from new admin endpoint
            const data = response?.products || [];
            // Map backend products to admin format
            const mapped = data.map((p: any) => ({
                id: p.id,
                name: p.name,
                categoryName:
                    p.category?.name || p.categoryName || 'Uncategorized',
                mainImage: p.mainImage || p.images?.[0] || '/placeholder.jpg',
                currentPrice: p.currentPrice || p.startingPrice || 0,
                buyNowPrice: p.buyNowPrice,
                status: p.status,
                endDate: p.endDate,
                seller: {
                    fullname: p.seller?.fullname || p.seller?.name || 'Unknown',
                },
            }));
            setProducts(mapped);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
    };

    const filteredProducts =
        filter === 'All'
            ? products
            : filter === 'Ended'
              ? products.filter((p) => new Date(p.endDate) < new Date())
              : products.filter(
                    (p) =>
                        p.status === filter &&
                        new Date(p.endDate) >= new Date(),
                );

    const columns = [
        {
            key: 'mainImage',
            label: 'Image',
            render: (_: any, product: AdminProduct) => (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-200">
                    <Image
                        src={product.mainImage}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-cover"
                    />
                </div>
            ),
        },
        { key: 'name', label: 'Product Name' },
        { key: 'categoryName', label: 'Category' },
        {
            key: 'currentPrice',
            label: 'Current Price',
            render: (value: number) => (
                <span className="font-bold text-dark-primary">
                    {formatCurrency(value)}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => <StatusBadge status={value} />,
        },
        {
            key: 'endDate',
            label: 'End Date',
            render: (value: string) =>
                new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
        },
        {
            key: 'seller',
            label: 'Seller',
            render: (value: { fullname: string }) => value.fullname,
        },
    ];

    const handleView = (product: AdminProduct) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    const handleDelete = (product: AdminProduct) => {
        setSelectedProduct(product);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;

        try {
            setSubmitting(true);
            await adminApi.deleteProduct(selectedProduct.id);
            toast.success('Product removed successfully!');
            setShowDeleteDialog(false);
            setSelectedProduct(null);
            await fetchProducts();
        } catch (error: any) {
            console.error('Error deleting product:', error);
            toast.error(
                error.response?.data?.message || 'Failed to remove product',
            );
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-primary p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-dark-primary mx-auto mb-4" />
                    <p className="text-neutral-500">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-primary p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-primary gap-4">
                <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-dark-primary rounded-full"></div>
                    <h1 className="font-heading text-3xl font-semibold text-neutral-900 flex items-center gap-3">
                        Product Management
                        <Package className="w-7 h-7 text-dark-primary" />
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Manage and monitor auction products
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 bg-neutral-100 p-1.5 rounded-xl w-fit border border-neutral-200">
                {(['All', 'Active', 'Ended'] as const).map((status) => {
                    const now = new Date();
                    const count =
                        status === 'All'
                            ? products.length
                            : status === 'Active'
                              ? products.filter(
                                    (p) =>
                                        p.status === 'Active' &&
                                        new Date(p.endDate) >= now,
                                ).length
                              : products.filter(
                                    (p) => new Date(p.endDate) < now,
                                ).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                                filter === status
                                    ? 'bg-white text-black shadow-sm border border-primary/20'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                            }`}
                        >
                            {status}
                            <span
                                className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${filter === status ? 'bg-primary/30 text-dark-primary' : 'bg-neutral-200 text-neutral-600'}`}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredProducts}
                onView={handleView}
                onDelete={handleDelete}
                searchable
                emptyMessage={`No ${filter.toLowerCase()} products found`}
            />

            {/* Detail Modal */}
            {showDetailModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-2xl w-full mx-4 rounded-2xl shadow-xl border border-primary max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                            Product Details
                        </h3>
                        <div className="space-y-4">
                            <div className="aspect-video relative rounded-xl overflow-hidden border border-neutral-200">
                                <Image
                                    src={selectedProduct.mainImage}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        Product Name
                                    </label>
                                    <p className="text-lg font-semibold text-neutral-900">
                                        {selectedProduct.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        Category
                                    </label>
                                    <p className="text-lg font-semibold text-neutral-900">
                                        {selectedProduct.categoryName}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        Current Price
                                    </label>
                                    <p className="text-lg font-semibold text-dark-primary">
                                        {formatCurrency(
                                            selectedProduct.currentPrice,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        Status
                                    </label>
                                    <div className="mt-1">
                                        <StatusBadge
                                            status={selectedProduct.status}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        Seller
                                    </label>
                                    <p className="text-lg font-semibold text-neutral-900">
                                        {selectedProduct.seller.fullname}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        End Date
                                    </label>
                                    <p className="text-lg font-semibold text-neutral-900">
                                        {new Date(
                                            selectedProduct.endDate,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedProduct(null);
                                }}
                                className="px-4 py-2 border border-primary rounded-xl hover:bg-primary transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Remove Product?"
                message={`Are you sure you want to remove "${selectedProduct?.name}"? This action cannot be undone.`}
                onConfirm={() => void confirmDelete()}
                onCancel={() => {
                    setShowDeleteDialog(false);
                    setSelectedProduct(null);
                }}
                type="danger"
                confirmText={submitting ? 'Removing...' : 'Remove'}
            />
        </div>
    );
}
