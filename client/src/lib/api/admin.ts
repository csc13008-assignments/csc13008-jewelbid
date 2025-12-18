import { apiClient } from './client';

// ===== CATEGORIES =====

export interface Category {
    id: string;
    name: string;
    description: string;
    slug: string;
    parentId?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    productCount?: number; // May be populated by backend
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
    slug: string;
    parentId?: string | null;
}

export interface UpdateCategoryRequest {
    name?: string;
    description?: string;
    slug?: string;
    parentId?: string | null;
    isActive?: boolean;
}

// ===== USERS =====

export interface AdminUser {
    id: string;
    fullname: string;
    email: string;
    role: 'Bidder' | 'Seller' | 'Admin';
    profileImage?: string;
    phone?: string;
    address?: string;
    birthdate?: string;
    positiveRatings: number;
    negativeRatings: number;
    created_at: string;
}

export interface UpgradeRequest {
    id: string;
    userId: string;
    user: {
        fullname: string;
        email: string;
        profileImage?: string;
    };
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
    updatedAt: string;
}

// ===== ADMIN API =====

export const adminApi = {
    // ===== CATEGORIES =====

    // GET /categories - List all categories
    getCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    // POST /categories - Create category [ADMIN]
    createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
        const response = await apiClient.post('/categories', data);
        return response.data;
    },

    // PATCH /categories/:id - Update category [ADMIN]
    updateCategory: async (
        id: string,
        data: UpdateCategoryRequest,
    ): Promise<Category> => {
        const response = await apiClient.patch(`/categories/${id}`, data);
        return response.data;
    },

    // DELETE /categories/:id - Delete category [ADMIN]
    deleteCategory: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`/categories/${id}`);
        return response.data;
    },

    // ===== PRODUCTS =====

    // GET /products - List products (can filter by status, etc.)
    getProducts: async (params?: { status?: string }): Promise<any[]> => {
        const response = await apiClient.get('/products', { params });
        return response.data;
    },

    // DELETE /products/:id - Delete product [ADMIN/SELLER]
    deleteProduct: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    },

    // ===== USERS =====

    // GET /users?role=... - List users by role [ADMIN]
    getUsers: async (
        role?: 'Bidder' | 'Seller' | 'Admin',
    ): Promise<AdminUser[]> => {
        const params = role ? { role } : {};
        const response = await apiClient.get('/users', { params });
        return response.data;
    },

    // PATCH /users/user - Update user profile (uses existing endpoint)
    // Note: For admin editing other users, we'd need a new endpoint

    // ===== UPGRADE REQUESTS =====

    // GET /users/upgrade-requests - List upgrade requests [ADMIN]
    getUpgradeRequests: async (): Promise<UpgradeRequest[]> => {
        const response = await apiClient.get('/users/upgrade-requests');
        return response.data;
    },

    // POST /users/upgrade-requests/:id/approve - Approve request [ADMIN]
    approveUpgradeRequest: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.post(
            `/users/upgrade-requests/${id}/approve`,
        );
        return response.data;
    },

    // POST /users/upgrade-requests/:id/reject - Reject request [ADMIN]
    rejectUpgradeRequest: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.post(
            `/users/upgrade-requests/${id}/reject`,
        );
        return response.data;
    },
};
