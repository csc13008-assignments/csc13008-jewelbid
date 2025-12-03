'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Button from '@/modules/shared/components/ui/Button';

const HeroSection = () => {
    return (
        <section className="bg-white mt-20 flex items-center">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <div className="relative">
                        <div className="relative mb-8">
                            <div className="relative w-full h-107 overflow-hidden shadow-lg">
                                <Image
                                    src="/Rectangle 1.png"
                                    alt="Gold chain jewelry"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-4xl font-heading text-black leading-tight">
                                &ldquo;Where Jewelry Meets Passion&rdquo;
                            </h1>

                            <p className="text-lg text-neutral-600 font-body leading-relaxed max-w-lg">
                                An online auction platform connecting jewelry
                                lovers and sellers — transparent, secure, and
                                elegant.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/search-result">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="px-8 py-4 text-base flex items-center gap-2"
                                >
                                    Explore All Bids
                                    <ArrowUpRight className="w-5 h-5" />
                                </Button>
                            </Link>

                            <Link href="/signin">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-4 text-base"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative h-40  overflow-hidden shadow-md">
                                <Image
                                    src="/Rectangle 2.png"
                                    alt="Gold jewelry accessories"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="relative h-40  overflow-hidden shadow-md">
                                <Image
                                    src="/Rectangle 3.png"
                                    alt="Ring collection"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
