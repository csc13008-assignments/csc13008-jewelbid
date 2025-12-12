import { CategoryItem } from '@/types';

// Static categories data - these rarely change
export const categories: CategoryItem[] = [
    {
        id: 'ring-category',
        name: 'Ring',
        image: '/rings.png',
    },
    {
        id: 'earring-jewelry',
        name: 'Earring',
        image: '/earings.png',
    },
    {
        id: 'gemstone-collection',
        name: 'Gemstone',
        image: '/gemstones.png',
    },
    {
        id: 'necklace-accessories',
        name: 'Necklace',
        image: '/necklaces.png',
    },
    {
        id: 'watch-timepieces',
        name: 'Watch',
        image: '/watches.png',
    },
    {
        id: 'diamond-precious',
        name: 'Diamond',
        image: '/diamond.png',
    },
];

export const getCategoriesData = (): CategoryItem[] => {
    return categories;
};
