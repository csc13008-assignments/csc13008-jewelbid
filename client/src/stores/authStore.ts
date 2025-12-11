import { create } from 'zustand';
import { authApi, UserData } from '../lib/api/auth';

interface AuthState {
    user: UserData | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    signUp: (data: {
        fullname: string;
        email: string;
        password: string;
        phone: string;
        address: string;
        birthdate: string;
    }) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    verifyEmail: (email: string, otp: string) => Promise<void>;
    resendVerification: (email: string) => Promise<void>;
    passwordRecovery: (email: string) => Promise<void>;
    resetPassword: (
        email: string,
        otp: string,
        newPassword: string,
    ) => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    clearError: () => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,

    signUp: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.signUp(data);
            // After signup, user needs to verify email
            // Store email temporarily for verification page
            localStorage.setItem('pendingVerificationEmail', data.email);
            set({ isLoading: false });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Sign up failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.signIn({
                email,
                password,
            });

            // Backend returns camelCase: accessToken, refreshToken
            const { accessToken, refreshToken } = response;

            // Save tokens
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);

            // Decode JWT to get user info (token payload contains id, email, fullname, role)
            try {
                const tokenPayload = JSON.parse(
                    atob(accessToken.split('.')[1]),
                );
                const user: UserData = {
                    id: tokenPayload.id,
                    fullname: tokenPayload.fullname,
                    email: tokenPayload.email,
                    phone: '',
                    address: '',
                    birthdate: '',
                    role: tokenPayload.role as 'Bidder' | 'Seller' | 'Admin',
                    isEmailVerified: true,
                    positiveRatings: 0,
                    negativeRatings: 0,
                };
                localStorage.setItem('user', JSON.stringify(user));

                set({
                    user,
                    accessToken,
                    refreshToken,
                    isLoading: false,
                    error: null,
                });
            } catch (decodeError) {
                console.error('Failed to decode token:', decodeError);
                set({
                    accessToken,
                    refreshToken,
                    isLoading: false,
                    error: null,
                });
            }
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Sign in failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    signOut: async () => {
        try {
            await authApi.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            // Clear all auth data
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                error: null,
            });
        }
    },

    verifyEmail: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.verifyEmail({
                email,
                otp,
            });

            // After verification, get tokens
            const { accessToken, refreshToken } = response;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.removeItem('pendingVerificationEmail');

            // Decode JWT to get user info
            try {
                const tokenPayload = JSON.parse(
                    atob(accessToken.split('.')[1]),
                );
                const user: UserData = {
                    id: tokenPayload.id,
                    fullname: tokenPayload.fullname,
                    email: tokenPayload.email,
                    phone: '',
                    address: '',
                    birthdate: '',
                    role: tokenPayload.role as 'Bidder' | 'Seller' | 'Admin',
                    isEmailVerified: true,
                    positiveRatings: 0,
                    negativeRatings: 0,
                };
                localStorage.setItem('user', JSON.stringify(user));

                set({
                    user,
                    accessToken,
                    refreshToken,
                    isLoading: false,
                    error: null,
                });
            } catch (decodeError) {
                console.error('Failed to decode token:', decodeError);
                set({
                    accessToken,
                    refreshToken,
                    isLoading: false,
                    error: null,
                });
            }
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Verification failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    resendVerification: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.resendVerification(email);
            set({ isLoading: false });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to resend verification';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    passwordRecovery: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.passwordRecovery({ email });
            // Store email for password reset page
            localStorage.setItem('passwordResetEmail', email);
            set({ isLoading: false });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Failed to send recovery email';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    resetPassword: async (email, otp, newPassword) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.resetPassword({ email, otp, newPassword });
            localStorage.removeItem('passwordResetEmail');
            set({ isLoading: false });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Password reset failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    changePassword: async (oldPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.changePassword({ oldPassword, newPassword });
            set({ isLoading: false });
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message || 'Password change failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    hydrate: () => {
        // Load auth data from localStorage on app start
        try {
            const accessToken = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');
            const userStr = localStorage.getItem('user');

            // Check if all required data exists and userStr is valid JSON
            if (
                accessToken &&
                refreshToken &&
                userStr &&
                userStr !== 'undefined' &&
                userStr !== 'null'
            ) {
                const user = JSON.parse(userStr);
                set({
                    user,
                    accessToken,
                    refreshToken,
                });
            }
        } catch (error) {
            console.error('Failed to parse user data:', error);
            // Clear invalid localStorage data
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    },
}));
