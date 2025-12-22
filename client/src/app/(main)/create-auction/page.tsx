'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/modules/shared/components/ui';
import {
    X,
    Image as ImageIcon,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link,
} from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import toast from '@/lib/toast';

export default function CreateAuctionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        productName: '',
        startingPrice: '',
        bidIncrement: '',
        buyNowPrice: '',
        description: '',
        enableAutoExtension: false,
        images: [] as File[],
        era: '',
        material: '',
        totalWeight: '',
        mainStoneCaratWeight: '',
        fineness: '',
        brand: '',
        condition: '',
        gender: '',
        category: '',
        surroundingStonesCaratWeight: '',
        size: '',
        endDate: '',
        allowNewBidders: true,
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = e.target;
        const checked = 'checked' in e.target ? e.target.checked : false;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEditorChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            description: content,
        }));
    };

    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef) {
            handleEditorChange(editorRef.innerHTML);
        }
    };

    const addLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            executeCommand('createLink', url);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const remainingSlots = 10 - formData.images.length;
        const filesToAdd = files.slice(0, remainingSlots);

        const newPreviews: string[] = [];
        filesToAdd.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                newPreviews.push(event.target?.result as string);
                if (newPreviews.length === filesToAdd.length) {
                    setImagePreviews((prev) => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...filesToAdd],
        }));
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Map frontend form fields to backend DTO structure
            const categoryMap: Record<string, string> = {
                ring: 'Ring',
                necklace: 'Necklace',
                earring: 'Earring',
                bracelet: 'Bracelet',
                watch: 'Watch',
                pendant: 'Pendant',
                brooch: 'Brooch',
                cufflink: 'Cufflink',
                other: 'Other',
            };

            // For now, use placeholder URLs for images
            // TODO: Implement proper image upload to cloud storage
            const imageUrls = formData.images.map(
                (_, index) =>
                    `https://via.placeholder.com/800x600?text=Product+Image+${index + 1}`,
            );

            const productData = {
                name: formData.productName,
                description: formData.description,
                category: categoryMap[formData.category] || formData.category,
                startingPrice: parseFloat(formData.startingPrice),
                stepPrice: parseFloat(formData.bidIncrement),
                buyNowPrice: formData.buyNowPrice
                    ? parseFloat(formData.buyNowPrice)
                    : undefined,
                endDate: formData.endDate,
                autoRenewal: formData.enableAutoExtension,
                mainImage: imageUrls[0] || '',
                additionalImages: imageUrls.slice(1),
                allowNewBidders: formData.allowNewBidders,
            };

            const createdProduct = await productsApi.createProduct(productData);

            // Success - show toast and redirect
            toast.success('Product created successfully!');
            router.push(`/auction/${createdProduct.id}`);
        } catch (error: any) {
            console.error('Error creating product:', error);
            const errorMessage =
                error.response?.data?.message ||
                'Failed to create product. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50/50 py-12 lg:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white shadow-sm border border-neutral-100 rounded-2xl p-8 lg:p-10">
                    <h1 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 mb-8">
                        Create a New Auction Listing
                    </h1>

                    <form
                        onSubmit={(e) => void handleSubmit(e)}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Product Name *
                                </label>
                                <Input
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                    placeholder="Product Name"
                                    className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Starting Price *
                                </label>
                                <Input
                                    name="startingPrice"
                                    type="number"
                                    value={formData.startingPrice}
                                    onChange={handleInputChange}
                                    placeholder="Starting Price"
                                    className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Bid Increment *
                                </label>
                                <Input
                                    name="bidIncrement"
                                    type="number"
                                    value={formData.bidIncrement}
                                    onChange={handleInputChange}
                                    placeholder="Bid Increment"
                                    className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Buy Now Price (optional)
                                </label>
                                <Input
                                    name="buyNowPrice"
                                    type="number"
                                    value={formData.buyNowPrice}
                                    onChange={handleInputChange}
                                    placeholder="Buy Now Price"
                                    className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Auction End Date *
                                </label>
                                <Input
                                    name="endDate"
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                    required
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    When should this auction end?
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">
                                    Allow New Bidders
                                </label>
                                <div className="flex items-center h-[42px]">
                                    <input
                                        type="checkbox"
                                        id="allowNewBidders"
                                        name="allowNewBidders"
                                        checked={formData.allowNewBidders}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-dark-primary border-neutral-300 rounded focus:ring-dark-primary"
                                    />
                                    <label
                                        htmlFor="allowNewBidders"
                                        className="ml-2 text-sm text-neutral-600 cursor-pointer"
                                    >
                                        Allow bidders with no rating history
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-4">
                                Product Details
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                        required
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        <option value="ring">Ring</option>
                                        <option value="necklace">
                                            Necklace
                                        </option>
                                        <option value="earring">Earring</option>
                                        <option value="bracelet">
                                            Bracelet
                                        </option>
                                        <option value="watch">Watch</option>
                                        <option value="pendant">Pendant</option>
                                        <option value="brooch">Brooch</option>
                                        <option value="cufflink">
                                            Cufflink
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Brand
                                    </label>
                                    <Input
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Cartier, Tiffany & Co"
                                        className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Era
                                    </label>
                                    <select
                                        name="era"
                                        value={formData.era}
                                        onChange={handleInputChange}
                                        className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                    >
                                        <option value="">Select Era</option>
                                        <option value="vintage">
                                            Vintage (1920-1980)
                                        </option>
                                        <option value="antique">
                                            Antique (before 1920)
                                        </option>
                                        <option value="modern">
                                            Modern (1980-present)
                                        </option>
                                        <option value="contemporary">
                                            Contemporary (2000-present)
                                        </option>
                                        <option value="art-deco">
                                            Art Deco (1920-1940)
                                        </option>
                                        <option value="victorian">
                                            Victorian (1837-1901)
                                        </option>
                                        <option value="edwardian">
                                            Edwardian (1901-1915)
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Material
                                    </label>
                                    <select
                                        name="material"
                                        value={formData.material}
                                        onChange={handleInputChange}
                                        className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                    >
                                        <option value="">
                                            Select Material
                                        </option>
                                        <option value="gold">Gold</option>
                                        <option value="silver">Silver</option>
                                        <option value="platinum">
                                            Platinum
                                        </option>
                                        <option value="titanium">
                                            Titanium
                                        </option>
                                        <option value="stainless-steel">
                                            Stainless Steel
                                        </option>
                                        <option value="leather">Leather</option>
                                        <option value="fabric">Fabric</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Fineness (for precious metals)
                                    </label>
                                    <select
                                        name="fineness"
                                        value={formData.fineness}
                                        onChange={handleInputChange}
                                        className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                    >
                                        <option value="">
                                            Select Fineness
                                        </option>
                                        <option value="24k">24K Gold</option>
                                        <option value="22k">22K Gold</option>
                                        <option value="18k">18K Gold</option>
                                        <option value="14k">14K Gold</option>
                                        <option value="10k">10K Gold</option>
                                        <option value="925">
                                            925 Sterling Silver
                                        </option>
                                        <option value="950">
                                            950 Platinum
                                        </option>
                                        <option value="999">
                                            999 Fine Silver
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Condition
                                    </label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                    >
                                        <option value="">
                                            Select Condition
                                        </option>
                                        <option value="new">New</option>
                                        <option value="like-new">
                                            Like New
                                        </option>
                                        <option value="excellent">
                                            Excellent
                                        </option>
                                        <option value="very-good">
                                            Very Good
                                        </option>
                                        <option value="good">Good</option>
                                        <option value="fair">Fair</option>
                                        <option value="poor">Poor</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="unisex">Unisex</option>
                                        <option value="men">Men</option>
                                        <option value="women">Women</option>
                                        <option value="children">
                                            Children
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Total Weight
                                    </label>
                                    <Input
                                        name="totalWeight"
                                        value={formData.totalWeight}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 15.5g"
                                        className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Size
                                    </label>
                                    <Input
                                        name="size"
                                        value={formData.size}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Ring size 7, 18mm width"
                                        className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Total Carat Weight of Main Stone
                                    </label>
                                    <Input
                                        name="mainStoneCaratWeight"
                                        value={formData.mainStoneCaratWeight}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 2.5ct"
                                        className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                                        Total Carat Weight of Surrounding Stones
                                    </label>
                                    <Input
                                        name="surroundingStonesCaratWeight"
                                        value={
                                            formData.surroundingStonesCaratWeight
                                        }
                                        onChange={handleInputChange}
                                        placeholder="e.g. 0.75ct"
                                        className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2">
                                Product Images * (Minimum 3 images)
                            </label>

                            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-dark-primary hover:bg-neutral-50 transition-all cursor-pointer group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center w-full h-full"
                                >
                                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-8 h-8 text-neutral-400 group-hover:text-dark-primary transition-colors" />
                                    </div>
                                    <span className="text-dark-primary font-bold text-lg mb-1">
                                        Click to upload or drag and drop
                                    </span>
                                    <span className="text-sm text-neutral-500">
                                        PNG, JPG, GIF up to 10MB (Max 10 images)
                                    </span>
                                </label>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-sm font-medium text-neutral-700 mb-3">
                                        Uploaded Images ({imagePreviews.length}
                                        /10):
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group aspect-square"
                                            >
                                                <Image
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className="object-cover rounded-xl border border-neutral-200 shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md transform hover:scale-110"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2">
                                Product Description
                            </label>

                            <div className="border border-neutral-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-dark-primary/20 focus-within:border-dark-primary transition-all">
                                <div className="flex items-center gap-1 flex-wrap bg-neutral-50 p-2 border-b border-neutral-200">
                                    <button
                                        type="button"
                                        onClick={() => executeCommand('bold')}
                                        className="p-2 hover:bg-white rounded-lg text-neutral-600 hover:text-dark-primary transition-colors"
                                        title="Bold"
                                    >
                                        <Bold className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => executeCommand('italic')}
                                        className="p-2 hover:bg-white rounded-lg text-neutral-600 hover:text-dark-primary transition-colors"
                                        title="Italic"
                                    >
                                        <Italic className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            executeCommand('underline')
                                        }
                                        className="p-2 hover:bg-white rounded-lg text-neutral-600 hover:text-dark-primary transition-colors"
                                        title="Underline"
                                    >
                                        <Underline className="w-4 h-4" />
                                    </button>

                                    <div className="w-px h-6 bg-neutral-300 mx-1" />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            executeCommand(
                                                'insertUnorderedList',
                                            )
                                        }
                                        className="p-2 hover:bg-white rounded-lg text-neutral-600 hover:text-dark-primary transition-colors"
                                        title="Bullet List"
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            executeCommand('insertOrderedList')
                                        }
                                        className="p-2 hover:bg-white rounded-lg text-neutral-600 hover:text-dark-primary transition-colors"
                                        title="Numbered List"
                                    >
                                        <ListOrdered className="w-4 h-4" />
                                    </button>

                                    <div className="w-px h-6 bg-neutral-300 mx-1" />

                                    <button
                                        type="button"
                                        onClick={addLink}
                                        className="p-2 hover:bg-white rounded-lg text-neutral-600 hover:text-dark-primary transition-colors"
                                        title="Add Link"
                                    >
                                        <Link className="w-4 h-4" />
                                    </button>

                                    <select
                                        onChange={(e) =>
                                            executeCommand(
                                                'fontSize',
                                                e.target.value,
                                            )
                                        }
                                        className="ml-2 text-sm border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-dark-primary"
                                        defaultValue="3"
                                    >
                                        <option value="1">10px</option>
                                        <option value="2">12px</option>
                                        <option value="3">14px</option>
                                        <option value="4">16px</option>
                                        <option value="5">18px</option>
                                        <option value="6">20px</option>
                                        <option value="7">24px</option>
                                    </select>
                                </div>

                                <div
                                    ref={setEditorRef}
                                    contentEditable
                                    className="w-full min-h-[200px] p-4 focus:outline-none bg-white"
                                    style={{
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                    }}
                                    onInput={(e) =>
                                        handleEditorChange(
                                            e.currentTarget.innerHTML,
                                        )
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: formData.description,
                                    }}
                                    data-placeholder="Describe your product in detail..."
                                />

                                <style jsx>{`
                                    [contenteditable]:empty:before {
                                        content: attr(data-placeholder);
                                        color: #9ca3af;
                                        pointer-events: none;
                                    }
                                `}</style>
                            </div>
                        </div>

                        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="autoExtension"
                                    name="enableAutoExtension"
                                    checked={formData.enableAutoExtension}
                                    onChange={handleInputChange}
                                    className="mt-1 w-4 h-4 text-dark-primary border-neutral-300 rounded focus:ring-dark-primary"
                                />
                                <div className="flex-1">
                                    <label
                                        htmlFor="autoExtension"
                                        className="font-bold text-neutral-900 cursor-pointer"
                                    >
                                        Enable Auto-Extension
                                    </label>
                                    <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                                        Automatically extend auction by 10
                                        minutes when a new bid is placed within
                                        the last 5 minutes before ending.
                                        Extension parameters can be adjusted by
                                        administrators and apply to all
                                        products.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-100">
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-8 rounded-xl"
                                    disabled={isSubmitting}
                                >
                                    Save as Draft
                                </Button>
                                <Button
                                    type="submit"
                                    variant="muted"
                                    className={`px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ${
                                        formData.images.length < 3 ||
                                        !formData.productName ||
                                        !formData.startingPrice ||
                                        !formData.bidIncrement ||
                                        !formData.category ||
                                        !formData.endDate ||
                                        isSubmitting
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    disabled={
                                        formData.images.length < 3 ||
                                        !formData.productName ||
                                        !formData.startingPrice ||
                                        !formData.bidIncrement ||
                                        !formData.category ||
                                        !formData.endDate ||
                                        isSubmitting
                                    }
                                >
                                    {isSubmitting
                                        ? 'Publishing...'
                                        : 'Publish Auction'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
