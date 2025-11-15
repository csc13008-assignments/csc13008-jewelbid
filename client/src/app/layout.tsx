import type { Metadata } from 'next';
import './globals.css';

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
            <body className="font-body antialiased">{children}</body>
        </html>
    );
}
