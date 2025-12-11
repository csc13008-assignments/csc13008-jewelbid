import { create } from 'zustand';
import { authApi, UserData, AuthResponse } from '../lib/api/auth';

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
            const response: AuthResponse = await authApi.signIn({
                email,
                password,
            });

            // Save auth data
            const { access_token, refresh_token, user } = response;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                accessToken: access_token,
                refreshToken: refresh_token,
                isLoading: false,
                error: null,
            });
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
            const response: AuthResponse = await authApi.verifyEmail({
                email,
                otp,
            });

            // After verification, auto login
            const { access_token, refresh_token, user } = response;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.removeItem('pendingVerificationEmail');

            set({
                user,
                accessToken: access_token,
                refreshToken: refresh_token,
                isLoading: false,
                error: null,
            });
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
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userStr = localStorage.getItem('user');

        if (accessToken && refreshToken && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({
                    user,
                    accessToken,
                    refreshToken,
                });
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('user');
            }
        }
    },
}));
