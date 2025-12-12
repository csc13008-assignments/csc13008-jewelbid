import { apiClient } from './client';

export interface BackendRating {
    id: string;
    raterId: string;
    ratedUserId: string;
    productId: string;
    isPositive: boolean;
    comment: string;
    created_at: string;
    updated_at: string;
    rater?: {
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
    positiveRatings: number;
    negativeRatings: number;
    totalRatings: number;
    positivePercentage: number;
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
};
