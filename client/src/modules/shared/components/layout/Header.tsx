'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const Header = () => {
    const [activeItem, setActiveItem] = useState('Home');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const dropdownData = {
        'Jewelry Type': [
            'Ring ',
            'Necklace',
            'Watches',
            'Earrings',
            'Anklet',
            'Pendant',
            'Charm',
        ],
        Brand: [
            'Cartier',
            'Tiffany & Co.',
            'Pandora',
            'Gucci',
            'Dior',
            'Local Artisan Brands',
        ],
        Material: [
            'Gold',
            'Silver',
            'Platinum',
            'Diamond',
            'Gemstone',
            'Leather',
        ],
        'Target Audience': [
            'For Men',
            'For Women',
            'For Couples',
            'For Kids',
            'Unisex',
        ],
        'Ongoing Auction': [
            'Ending Soon',
            'Most Bids',
            'Highest Price',
            'Newly Listed',
        ],
    };

    const navItems = [
        'Home',
        'All Items',
        'Jewelry Type',
        'Brand',
        'Material',
        'Target Audience',
        'Ongoing Auction',
        'Contact Us',
    ];

    const hasDropdown = (item: string) => {
        return Object.keys(dropdownData).includes(item);
    };

    const handleItemClick = (item: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (hasDropdown(item)) {
            setOpenDropdown(openDropdown === item ? null : item);
        } else {
            setActiveItem(item);
            setOpenDropdown(null);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-secondary font-body border-b border-dark-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-1 max-w-sm">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <Search
                                    className="h-5 w-5 text-black"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for brand, categories..."
                                className="block w-92 h-11 pl-10 pr-3 border border-dark-primary bg-white text-black placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-dark-primary font-body"
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
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
                    </div>

                    <div className="flex-1 flex justify-end">
                        <Link href="/signin">
                            <Button
                                variant="primary"
                                size="lg"
                                className="px-8"
                            >
                                Log In
                            </Button>
                        </Link>
                    </div>
                </div>

                <nav>
                    <div className="flex items-center justify-center space-x-8 py-4">
                        {navItems.map((item, index) => (
                            <div
                                key={index}
                                className="relative group"
                                onMouseEnter={() =>
                                    hasDropdown(item) && setOpenDropdown(item)
                                }
                            >
                                <button
                                    onClick={(e) => handleItemClick(item, e)}
                                    className={`
                                        flex items-center gap-1 font-body text-base font-medium transition-all duration-200 pb-1 border-b-2
                                        ${
                                            activeItem === item ||
                                            openDropdown === item
                                                ? 'text-dark-primary border-dark-primary'
                                                : 'text-black border-transparent hover:text-dark-primary hover:border-dark-primary'
                                        }
                                    `}
                                >
                                    {item}
                                    {hasDropdown(item) && (
                                        <ChevronDown className="w-4 h-4 transition-transform" />
                                    )}
                                </button>

                                {hasDropdown(item) && openDropdown === item && (
                                    <div
                                        className="absolute top-full left-0 mt-2 w-48 bg-primary border border-neutral-200 shadow-lg z-50"
                                        onMouseLeave={() =>
                                            setOpenDropdown(null)
                                        }
                                    >
                                        <div className="py-2">
                                            {dropdownData[
                                                item as keyof typeof dropdownData
                                            ].map((subItem, subIndex) => (
                                                <a
                                                    key={subIndex}
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="block px-4 py-2 text-sm text-black hover:bg-neutral-50 transition-colors"
                                                >
                                                    {subItem}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
