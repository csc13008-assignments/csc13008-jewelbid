import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/modules/shared/components/ui/Toast';

export const metadata: Metadata = {
    title: 'JewelBid - Premium Jewelry Auction Platform',
    description:
        'Discover and bid on exquisite jewelry pieces from around the world',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-body antialiased">
                <ToastProvider>{children}</ToastProvider>
            </body>
        </html>
    );
}
