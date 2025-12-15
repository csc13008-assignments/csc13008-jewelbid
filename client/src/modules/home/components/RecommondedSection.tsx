'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import CategoryCard from '@/modules/shared/components/ui/CategoryCard';
import Button from '@/modules/shared/components/ui/Button';
import { getCategoriesData } from '@/lib/categories';

const RecommondedSection = () => {
    const router = useRouter();
    const categories = getCategoriesData();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCategoryClick = (categoryId: string) => {
        const categoryName = categories
            .find((cat) => cat.id === categoryId)
            ?.name.toLowerCase();
        if (categoryName) {
            router.push(
                `/search-result?category=${encodeURIComponent(categoryName)}`,
            );
        }
    };

    // Alternating lively colors for categories - Darker/Richer versions
    const cardStyles = [
        'bg-[#E2DCD5] border border-[#B9B0A5] shadow-md hover:bg-[#D6CFC7]', // Primary
        'bg-[#F5F5F4] border border-[#D6D3D1] shadow-md hover:bg-[#E7E5E4]', // Stone
    ];

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                {/* Left Content */}
                <div
                    className={`flex-1 max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                >
                    <h2 className="font-heading text-4xl lg:text-5xl font-medium text-black mb-6">
                        Recommended Categories
                    </h2>
                    <p className="font-body text-base text-neutral-600 mb-8 leading-relaxed">
                        Handpicked jewelry categories to help you find your next
                        winning bid. Explore rings, necklaces, earrings, and
                        more.
                    </p>

                    <Link href="/search-result">
                        <Button variant="muted" size="md">
                            Explore All Bids
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* Right - Categories Grid */}
                <div
                    className={`grid grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                >
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            style={{
                                animation: isVisible
                                    ? `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                    : 'none',
                            }}
                        >
                            <CategoryCard
                                id={category.id}
                                name={category.name}
                                image={category.image}
                                onClick={handleCategoryClick}
                                className={
                                    cardStyles[index % cardStyles.length]
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
};

export default RecommondedSection;
