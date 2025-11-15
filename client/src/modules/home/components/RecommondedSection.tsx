'use client';

import { ArrowRight } from 'lucide-react';
import CategoryCard from '@/modules/shared/components/ui/CategoryCard';
import Button from '@/modules/shared/components/ui/Button';
import { getCategoriesData } from '@/lib/mockData';

const RecommondedSection = () => {
    const categories = getCategoriesData();

    const handleCategoryClick = (categoryId: string) => {
        console.log('Category clicked:', categoryId);
    };

    return (
        <section className="py-16 px-6 max-w-6xl mx-auto">
            <div className="flex items-start justify-between">
                <div className="flex-1 max-w-md">
                    <h2 className="font-heading text-5xl font-medium text-black mb-4">
                        Recommended categories
                    </h2>
                    <p className="font-body text-base text-neutral-600 mb-8">
                        Handpicked jewelry categories to help you find your next
                        winning bid.
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        icon={<ArrowRight className="w-4 h-4" />}
                    >
                        Explore All Bids
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-2xl mt-8">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            id={category.id}
                            name={category.name}
                            image={category.image}
                            onClick={handleCategoryClick}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecommondedSection;
