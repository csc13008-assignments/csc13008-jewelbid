'use client';

import Image from 'next/image';
import Link from 'next/link';
import Input from '@/modules/shared/components/ui/Input';

const Footer = () => {
    return (
        <footer className="bg-primary pt-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-3 gap-20 justify-between items-start">
                    <div className="flex-1 max-w-md">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/logo.svg"
                                alt="JewelBid Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                            <h1 className="text-3xl font-heading font-normal text-neutral-900">
                                JEWELBID
                            </h1>
                        </div>

                        <p className="font-body text-base text-neutral-600 mt-8 leading-relaxed">
                            A trusted online jewelry auction platform where
                            timeless elegance meets modern bidding.
                        </p>
                    </div>

                    <div className="mb-8">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Fill with your email"
                        />
                    </div>

                    <nav className="space-y-4">
                        <Link
                            href="/"
                            className="block font-body text-lg text-black hover:text-neutral-600 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/search-result"
                            className="block font-body text-lg text-black hover:text-neutral-600 transition-colors"
                        >
                            All Items
                        </Link>
                        <Link
                            href="/search-result?sortBy=ending-soon"
                            className="block font-body text-lg text-black hover:text-neutral-600 transition-colors"
                        >
                            Ongoing Auction
                        </Link>
                        <Link
                            href="/contact"
                            className="block font-body text-lg text-black hover:text-neutral-600 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </nav>
                </div>
            </div>

            <div className=" pt-8">
                <div className="bg-[#929292] py-2 px-6">
                    <div className="text-center">
                        <p className="font-body text-xs text-white">
                            © 2025 JEWELBID Auction. All rights reserved.
                        </p>
                        <p className="font-body text-xs text-white mt-1">
                            Designed & developed by Team30 - PTUDW.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
