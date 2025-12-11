'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
    const { user, signOut, hydrate } = useAuthStore();

    useEffect(() => {
        // Hydrate store from localStorage on mount
        hydrate();
    }, [hydrate]);

    return {
        currentUser: user,
        isLoading: false, // Zustand is synchronous, no loading state needed for hydration
        isAuthenticated: !!user,
        logout: signOut,
    };
};
