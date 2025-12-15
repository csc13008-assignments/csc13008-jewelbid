'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from '@/modules/shared/components/ui/Button';

const HeroSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="bg-white mt-10 flex items-center overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Left - Main Images */}
                    <div
                        className={`grid grid-cols-2 gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                    >
                        <div className="relative w-full h-[400px] lg:h-[480px] mt-12 overflow-hidden shadow-xl rounded-2xl group">
                            <Image
                                src="/Rectangle 1.png"
                                alt="Gold chain jewelry"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                        </div>

                        <div className="relative w-full h-[400px] lg:h-[480px] overflow-hidden shadow-xl rounded-2xl group">
                            <Image
                                src="/img1.png"
                                alt="Luxury Jewelry"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div
                        className={`space-y-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                    >
                        <div className="space-y-6">
                            <h1 className="text-5xl font-heading text-black leading-tight">
                                &ldquo;Where Jewelry Meets Passion&rdquo;
                            </h1>

                            <p className="text-lg text-neutral-600 font-body leading-relaxed max-w-lg">
                                An online auction platform connecting jewelry
                                lovers and sellers — transparent, secure, and
                                elegant.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/search-result">
                                <Button variant="muted" size="md">
                                    Explore All Bids
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>

                            <Link href="/signin">
                                <Button
                                    variant="outline"
                                    size="md"
                                    className="h-[48px]"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 pt-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-dark-primary">
                                    500+
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Active Auctions
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-dark-primary">
                                    10K+
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Happy Bidders
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-dark-primary">
                                    99%
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Satisfaction
                                </p>
                            </div>
                        </div>

                        {/* Small Images Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div
                                className={`relative h-40 overflow-hidden shadow-lg rounded-xl group transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            >
                                <Image
                                    src="/Rectangle 2.png"
                                    alt="Gold jewelry accessories"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div
                                className={`relative h-40 overflow-hidden shadow-lg rounded-xl group transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            >
                                <Image
                                    src="/Rectangle 3.png"
                                    alt="Ring collection"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
