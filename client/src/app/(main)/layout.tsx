'use client';

import { useEffect } from 'react';
import { Header, Footer } from '@/modules/shared/components/layout';
import { useWatchlistStore } from '@/stores/watchlistStore';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const fetchWatchlist = useWatchlistStore((state) => state.fetchWatchlist);

    useEffect(() => {
        // Fetch watchlist if user is logged in
        const userStr = localStorage.getItem('user');
        if (userStr) {
            void fetchWatchlist();
        }
    }, [fetchWatchlist]);

    return (
        <>
            <Header />
            <main className="font-body">{children}</main>
            <Footer />
        </>
    );
}
