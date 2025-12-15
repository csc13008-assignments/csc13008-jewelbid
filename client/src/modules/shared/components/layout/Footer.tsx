'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Mail,
    ArrowRight,
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary/20 pt-20 border-t border-dark-primary/10">
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/logo.svg"
                                    alt="JewelBid Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h1 className="text-3xl font-heading font-normal text-neutral-900 tracking-wide">
                                JEWELBID
                            </h1>
                        </div>

                        <p className="font-body text-base text-neutral-600 leading-relaxed max-w-sm">
                            A trusted online jewelry auction platform where
                            timeless elegance meets modern bidding. Discover
                            unique pieces and bid with confidence.
                        </p>

                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter, Linkedin].map(
                                (Icon, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="w-10 h-10 rounded-full bg-white border border-primary flex items-center justify-center text-neutral-600 hover:bg-dark-primary hover:text-white hover:border-dark-primary transition-all duration-300 hover:-translate-y-1 shadow-sm"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 lg:col-start-6 space-y-6">
                        <h3 className="font-heading text-lg font-medium text-neutral-900">
                            Quick Links
                        </h3>
                        <nav className="flex flex-col space-y-4">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'All Items', href: '/search-result' },
                                {
                                    label: 'Ongoing Auction',
                                    href: '/search-result?sortBy=ending-soon',
                                },
                                { label: 'Contact Us', href: '/contact' },
                            ].map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="group flex items-center gap-2 text-neutral-600 hover:text-dark-primary transition-colors w-fit"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-dark-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-4 lg:col-start-9 space-y-6">
                        <h3 className="font-heading text-lg font-medium text-neutral-900">
                            Stay Updated
                        </h3>
                        <p className="text-neutral-600">
                            Subscribe to our newsletter for the latest auctions
                            and exclusive offers.
                        </p>

                        <form className="relative max-w-sm">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full h-12 pl-12 pr-14 rounded-xl border border-dark-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-dark-primary/50 focus:border-dark-primary transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    className="absolute right-1 top-1 bottom-1 w-10 bg-dark-primary text-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-dark-primary transition-colors"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-neutral-900 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-body text-sm text-neutral-400">
                        © 2025 JEWELBID Auction. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="#"
                            className="text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
