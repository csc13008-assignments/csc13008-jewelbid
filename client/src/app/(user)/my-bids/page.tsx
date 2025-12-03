'use client';

import Link from 'next/link';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { mockBids } from '@/lib/mockData';

export default function MyBidsPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <UserSidebar />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white">
                            <h1 className="font-heading text-5xl font-normal text-black mb-8">
                                My Bids
                            </h1>

                            <div className="border border-gray-300">
                                <div className="grid grid-cols-5 bg-secondary border-b border-primary">
                                    <div className="px-6 py-4 text-left font-bold text-black border-r border-primary">
                                        Product
                                    </div>
                                    <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                        Current Bid
                                    </div>
                                    <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                        Your Bid
                                    </div>
                                    <div className="px-6 py-4 text-center font-bold text-black border-r border-primary">
                                        Time Left
                                    </div>
                                    <div className="px-6 py-4 text-center font-bold text-black">
                                        Status
                                    </div>
                                </div>

                                {mockBids.map((bid, index) => (
                                    <div
                                        key={bid.id}
                                        className={`grid grid-cols-5 ${
                                            index < mockBids.length - 1
                                                ? 'border-b border-gray-300'
                                                : ''
                                        }`}
                                    >
                                        <div className="px-6 py-6 flex items-center border-r border-gray-300">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src="/sample.png"
                                                    alt={bid.product}
                                                    className="w-16 h-16 object-cover bg-gray-200"
                                                />
                                                <div>
                                                    <Link
                                                        href={`/auction/${bid.id}`}
                                                        className="font-medium text-black text-sm mb-1 hover:underline"
                                                    >
                                                        {bid.product}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 py-6 text-center text-black border-r border-gray-300 flex items-center justify-center">
                                            {bid.currentBid}
                                        </div>
                                        <div className="px-6 py-6 text-center text-black border-r border-gray-300 flex items-center justify-center">
                                            {bid.yourBid}
                                        </div>
                                        <div className="px-6 py-6 text-center text-black border-r border-gray-300 flex items-center justify-center">
                                            {bid.timeLeft}
                                        </div>
                                        <div className="px-6 py-6 text-center flex items-center justify-center">
                                            <span
                                                className={`px-3 py-1 text-xs font-medium ${
                                                    bid.status === 'winning'
                                                        ? 'bg-green-100 text-green-800'
                                                        : bid.status ===
                                                            'outbid'
                                                          ? 'bg-red-100 text-red-800'
                                                          : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {bid.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
