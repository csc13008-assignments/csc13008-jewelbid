'use client';

import Image from 'next/image';
import { CategoryItem } from '@/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface CategoryCardProps extends CategoryItem {
    onClick?: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    id,
    name,
    image,
    onClick,
}) => {
    const handleClick = () => {
        onClick?.(id);
    };

    const bgColor = useMemo(() => {
        const colors = [
            'bg-primary',
            'bg-dark-primary',
            'bg-neutral-100',
            'bg-neutral-200',
            'bg-secondary',
            'bg-stone-100',
        ];
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            const char = id.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        hash = Math.abs(hash + id.length * 7 + id.charCodeAt(0) * 13);
        return colors[hash % colors.length];
    }, [id]);

    return (
        <div
            className={cn(
                ' overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group w-[220px] h-[104px]',
                bgColor,
            )}
            onClick={handleClick}
        >
            <div className="flex items-center h-full">
                <div className="flex-1 px-6">
                    <h3 className="font-heading text-lg font-medium text-black">
                        {name}
                    </h3>
                </div>
                <div className="relative w-[84px] h-[84px] shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                        <Image
                            src={image}
                            alt={name}
                            width={80}
                            height={80}
                            className="object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
