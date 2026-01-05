import { apiClient } from './client';

export interface BackendRating {
    id: string;
    fromUserId: string;
    toUserId: string;
    productId: string;
    ratingType: 'Positive' | 'Negative'; // Backend uses enum, not boolean
    comment: string;
    created_at: string;
    updated_at: string;
    fromUser?: {
        // The person who gave the rating
        id: string;
        fullname: string;
        profileImage: string;
        positiveRatings?: number;
        negativeRatings?: number;
    };
    toUser?: {
        // The person who received the rating
        id: string;
        fullname: string;
        profileImage: string;
    };
    product?: {
        id: string;
        name: string;
        mainImage: string;
    };
}

export interface RatingStats {
    positive: number;
    negative: number;
    percentage: number;
}

export interface UpdateProfileData {
    fullname?: string;
    email?: string;
    phone?: string;
    address?: string;
    birthdate?: string;
    profileImage?: string;
}

export interface UserProfile {
    id: string;
    fullname?: string; // from localStorage fallback
    username?: string; // from API (contains fullname value)
    email: string;
    phone: string;
    address: string;
    birthdate?: string;
    profileImage?: string; // from localStorage fallback
    image?: string; // from API (contains profileImage value)
    role: string;
    positiveRatings?: number;
    negativeRatings?: number;
}

export const usersApi = {
    // GET /users/user/my-ratings - ratings given by current user
    getMyRatings: async (): Promise<BackendRating[]> => {
        const response = await apiClient.get('/users/user/my-ratings');
        return response.data;
    },

    // GET /users/:id/ratings - ratings for a specific user
    getRatingsForUser: async (userId: string): Promise<BackendRating[]> => {
        const response = await apiClient.get(`/users/${userId}/ratings`);
        return response.data;
    },

    // GET /users/:id/rating-stats
    getUserRatingStats: async (userId: string): Promise<RatingStats> => {
        const response = await apiClient.get(`/users/${userId}/rating-stats`);
        return response.data;
    },

    // POST /users/ratings - create a new rating
    createRating: async (data: {
        ratedUserId: string;
        productId: string;
        isPositive: boolean;
        comment: string;
    }): Promise<BackendRating> => {
        const response = await apiClient.post('/users/ratings', data);
        return response.data;
    },

    // PATCH /users/user - update current user's profile
    updateProfile: async (
        data: UpdateProfileData | FormData,
    ): Promise<UserProfile> => {
        // Check if data is FormData (for file uploads)
        const isFormData = data instanceof FormData;
        const response = await apiClient.patch('/users/user', data, {
            headers: isFormData
                ? { 'Content-Type': 'multipart/form-data' }
                : undefined,
        });
        return response.data;
    },

    // GET /users/user - get current user's profile
    getProfile: async (): Promise<UserProfile> => {
        const response = await apiClient.get('/users/user');
        return response.data;
    },

    // POST /users/upgrade-request - request upgrade to seller
    requestSellerUpgrade: async (): Promise<{ message: string }> => {
        const response = await apiClient.post('/users/upgrade-request');
        return response.data;
    },

    // GET /users/:id/ratings - get public profile basic info
    getPublicProfile: async (
        userId: string,
    ): Promise<{
        id: string;
        fullname: string;
        profileImage?: string;
        role: string;
        positiveRatings: number;
        negativeRatings: number;
        created_at: string;
    }> => {
        // Fetch rating stats and ratings to build profile
        const [stats, ratings] = await Promise.all([
            apiClient.get(`/users/${userId}/rating-stats`),
            apiClient.get(`/users/${userId}/ratings`),
        ]);

        // Extract user info from first rating if available
        const firstRating = ratings.data[0];
        const userInfo = firstRating?.toUser || {};

        return {
            id: userId,
            fullname: userInfo.fullname || 'Unknown User',
            profileImage: userInfo.profileImage,
            role: 'User',
            positiveRatings: stats.data.positive || 0,
            negativeRatings: stats.data.negative || 0,
            created_at: firstRating?.created_at || new Date().toISOString(),
        };
    },
};
