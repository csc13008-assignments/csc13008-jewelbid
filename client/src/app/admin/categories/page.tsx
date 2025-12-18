'use client';

import { useState, useEffect } from 'react';
import { Plus, Grid3X3, Loader2 } from 'lucide-react';
import Button from '@/modules/shared/components/ui/Button';
import DataTable from '@/modules/admin/components/DataTable';
import ConfirmDialog from '@/modules/admin/components/ConfirmDialog';
import Input from '@/modules/shared/components/ui/Input';
import { adminApi, type Category } from '@/lib/api/admin';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    );
    const [formData, setFormData] = useState({ name: '', description: '' });

    // Fetch categories on mount
    useEffect(() => {
        void fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        {
            key: 'createdAt',
            label: 'Created',
            render: (value: string) =>
                new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
        },
    ];

    const handleAdd = async () => {
        if (!formData.name.trim()) return;

        try {
            setSubmitting(true);
            // Generate slug from name
            const slug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            await adminApi.createCategory({
                name: formData.name,
                description: formData.description,
                slug: slug,
            });
            alert('Category created successfully!');
            setFormData({ name: '', description: '' });
            setShowAddModal(false);
            await fetchCategories();
        } catch (error: any) {
            console.error('Error creating category:', error);
            alert(error.response?.data?.message || 'Failed to create category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setFormData({ name: category.name, description: category.description });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!selectedCategory || !formData.name.trim()) return;

        try {
            setSubmitting(true);
            await adminApi.updateCategory(selectedCategory.id, {
                name: formData.name,
                description: formData.description,
            });
            alert('Category updated successfully!');
            setFormData({ name: '', description: '' });
            setShowEditModal(false);
            setSelectedCategory(null);
            await fetchCategories();
        } catch (error: any) {
            console.error('Error updating category:', error);
            alert(error.response?.data?.message || 'Failed to update category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedCategory) return;

        try {
            setSubmitting(true);
            await adminApi.deleteCategory(selectedCategory.id);
            alert('Category deleted successfully!');
            setShowDeleteDialog(false);
            setSelectedCategory(null);
            await fetchCategories();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            alert(
                error.response?.data?.message ||
                    'Failed to delete category. It may contain products.',
            );
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-primary p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-dark-primary mx-auto mb-4" />
                    <p className="text-neutral-500">Loading categories...</p>
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
                        Category Management
                        <Grid3X3 className="w-7 h-7 text-dark-primary" />
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Manage product categories
                    </p>
                </div>
                <Button
                    variant="muted"
                    onClick={() => setShowAddModal(true)}
                    className="rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchable
                emptyMessage="No categories found"
            />

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-md w-full mx-4 rounded-2xl shadow-xl border border-primary">
                        <h3 className="text-xl font-bold text-neutral-900 mb-4">
                            Add New Category
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Category Name
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter category name"
                                    className="w-full"
                                    disabled={submitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Enter description"
                                    className="w-full border border-primary rounded-lg p-3 focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none"
                                    rows={3}
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setFormData({ name: '', description: '' });
                                }}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="muted"
                                onClick={() => void handleAdd()}
                                disabled={!formData.name.trim() || submitting}
                            >
                                {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                {submitting ? 'Creating...' : 'Add Category'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-md w-full mx-4 rounded-2xl shadow-xl border border-primary">
                        <h3 className="text-xl font-bold text-neutral-900 mb-4">
                            Edit Category
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Category Name
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter category name"
                                    className="w-full"
                                    disabled={submitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Enter description"
                                    className="w-full border border-primary rounded-lg p-3 focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none"
                                    rows={3}
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setFormData({ name: '', description: '' });
                                    setSelectedCategory(null);
                                }}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="muted"
                                onClick={() => void handleUpdate()}
                                disabled={!formData.name.trim() || submitting}
                            >
                                {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Delete Category?"
                message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
                onConfirm={() => void confirmDelete()}
                onCancel={() => {
                    setShowDeleteDialog(false);
                    setSelectedCategory(null);
                }}
                type="danger"
                confirmText={submitting ? 'Deleting...' : 'Delete'}
            />
        </div>
    );
}
