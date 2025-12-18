'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/modules/admin/components/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-secondary">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <AdminSidebar />
                    </div>
                    <div className="lg:col-span-3">{children}</div>
                </div>
            </div>
        </div>
    );
}
