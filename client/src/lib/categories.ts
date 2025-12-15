import { CategoryItem } from '@/types';

// Filter option type
export interface FilterOption {
    label: string;
    value: string;
}

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

// Static materials data
export const materials: FilterOption[] = [
    { label: 'Gold', value: 'gold' },
    { label: 'Silver', value: 'silver' },
    { label: 'Platinum', value: 'platinum' },
    { label: 'Diamond', value: 'diamond' },
    { label: 'Gemstone', value: 'gemstone' },
    { label: 'Leather', value: 'leather' },
];

export const getCategoriesData = (): CategoryItem[] => {
    return categories;
};

export const getMaterialsData = (): FilterOption[] => {
    return materials;
};
