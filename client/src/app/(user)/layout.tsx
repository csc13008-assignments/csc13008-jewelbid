'use client';

import { ReactNode } from 'react';
import Header from '@/modules/shared/components/layout/Header';
import Footer from '@/modules/shared/components/layout/Footer';

interface UserLayoutProps {
    children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-secondary/30">
            <Header showNavigation={false} />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
