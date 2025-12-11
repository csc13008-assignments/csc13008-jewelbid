import { apiClient } from './client';

// Request/Response Types
export interface SignUpRequest {
    fullname: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    birthdate: string; // ISO format: YYYY-MM-DD
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface VerifyEmailRequest {
    email: string;
    otp: string;
}

export interface PasswordRecoveryRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: UserData;
}

export interface UserData {
    id: string;
    fullname: string;
    email: string;
    phone: string;
    address: string;
    birthdate: string;
    isEmailVerified: boolean;
    role: 'Bidder' | 'Seller' | 'Admin';
    profileImage?: string;
    positiveRatings: number;
    negativeRatings: number;
}

// Auth API Functions
export const authApi = {
    // POST /auth/sign-up - Register new account
    signUp: async (data: SignUpRequest): Promise<{ message: string }> => {
        const response = await apiClient.post('/auth/sign-up', data);
        return response.data;
    },

    // POST /auth/sign-in - Login
    signIn: async (data: SignInRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/sign-in', data);
        return response.data;
    },

    // DELETE /auth/sign-out - Logout
    signOut: async (): Promise<{ message: string }> => {
        const response = await apiClient.delete('/auth/sign-out');
        return response.data;
    },

    // POST /auth/verify-email - Verify email with OTP
    verifyEmail: async (data: VerifyEmailRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/verify-email', data);
        return response.data;
    },

    // POST /auth/resend-verification - Resend verification OTP
    resendVerification: async (email: string): Promise<{ message: string }> => {
        const response = await apiClient.post('/auth/resend-verification', {
            email,
        });
        return response.data;
    },

    // POST /auth/password-recovery - Request password reset OTP
    passwordRecovery: async (
        data: PasswordRecoveryRequest,
    ): Promise<{ message: string }> => {
        const response = await apiClient.post('/auth/password-recovery', data);
        return response.data;
    },

    // PATCH /auth/reset-password - Reset password with OTP
    resetPassword: async (
        data: ResetPasswordRequest,
    ): Promise<{ message: string }> => {
        const response = await apiClient.patch('/auth/reset-password', data);
        return response.data;
    },

    // PUT /auth/change-password - Change password (authenticated)
    changePassword: async (
        data: ChangePasswordRequest,
    ): Promise<{ message: string }> => {
        const response = await apiClient.put('/auth/change-password', data);
        return response.data;
    },

    // PUT /auth/refresh-token - Refresh access token
    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await apiClient.put(
            '/auth/refresh-token',
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            },
        );
        return response.data;
    },
};
