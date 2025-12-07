'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthUser {
    id: string;
    role: string;
    username?: string;
    email?: string;
}

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeUser = () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user: User = JSON.parse(userStr);
                    setCurrentUser({
                        id: user.id,
                        role: user.role,
                        username: user.username,
                        email: user.email,
                    });
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                setCurrentUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    return {
        currentUser,
        isLoading,
        isAuthenticated: !!currentUser,
        logout,
    };
};
