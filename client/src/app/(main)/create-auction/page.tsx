'use client';

import { useState } from 'react';
import Image from 'next/image';
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

export default function CreateAuctionPage() {
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
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white shadow-sm  border-neutral-200 border p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">
                        Create a New Auction Listing
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Product Name *
                                </label>
                                <Input
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                    placeholder="Product Name"
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Starting Price *
                                </label>
                                <Input
                                    name="startingPrice"
                                    type="number"
                                    value={formData.startingPrice}
                                    onChange={handleInputChange}
                                    placeholder="Starting Price"
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Bid Increment *
                                </label>
                                <Input
                                    name="bidIncrement"
                                    type="number"
                                    value={formData.bidIncrement}
                                    onChange={handleInputChange}
                                    placeholder="Bid Increment"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Buy Now Price (optional)
                                </label>
                                <Input
                                    name="buyNowPrice"
                                    type="number"
                                    value={formData.buyNowPrice}
                                    onChange={handleInputChange}
                                    placeholder="Buy Now Price"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Product Details
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Brand
                                    </label>
                                    <Input
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Cartier, Tiffany & Co"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Era
                                    </label>
                                    <select
                                        name="era"
                                        value={formData.era}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Material
                                    </label>
                                    <select
                                        name="material"
                                        value={formData.material}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fineness (for precious metals)
                                    </label>
                                    <select
                                        name="fineness"
                                        value={formData.fineness}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Condition
                                    </label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Weight
                                    </label>
                                    <Input
                                        name="totalWeight"
                                        value={formData.totalWeight}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 15.5g"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Size
                                    </label>
                                    <Input
                                        name="size"
                                        value={formData.size}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Ring size 7, 18mm width"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Carat Weight of Main Stone
                                    </label>
                                    <Input
                                        name="mainStoneCaratWeight"
                                        value={formData.mainStoneCaratWeight}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 2.5ct"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Carat Weight of Surrounding Stones
                                    </label>
                                    <Input
                                        name="surroundingStonesCaratWeight"
                                        value={
                                            formData.surroundingStonesCaratWeight
                                        }
                                        onChange={handleInputChange}
                                        placeholder="e.g. 0.75ct"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Product Images * (Minimum 3 images)
                            </label>

                            <div className="border-2 border-dashed border-primary p-8 text-center hover:border-primary-dark transition-colors">
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
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                                        Click to upload or drag and drop
                                    </span>
                                    <span className="text-sm text-gray-500 mt-1">
                                        PNG, JPG, GIF up to 10MB (Max 10 images)
                                    </span>
                                </label>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-black mb-3">
                                        Uploaded Images ({imagePreviews.length}
                                        /10):
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group"
                                            >
                                                <Image
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Product Description
                            </label>

                            <div className="border border-primary border-b-0 bg-secondary p-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => executeCommand('bold')}
                                        className="p-2 hover:bg-gray-200  border border-transparent hover:border-gray-300 transition-colors"
                                        title="Bold"
                                    >
                                        <Bold className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => executeCommand('italic')}
                                        className="p-2 hover:bg-gray-200 border border-transparent hover:border-gray-300 transition-colors"
                                        title="Italic"
                                    >
                                        <Italic className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            executeCommand('underline')
                                        }
                                        className="p-2 hover:bg-gray-200 border border-transparent hover:border-gray-300 transition-colors"
                                        title="Underline"
                                    >
                                        <Underline className="w-4 h-4" />
                                    </button>

                                    <div className="w-px h-6 bg-gray-300 mx-1" />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            executeCommand(
                                                'insertUnorderedList',
                                            )
                                        }
                                        className="p-2 hover:bg-gray-200 border border-transparent hover:border-gray-300 transition-colors"
                                        title="Bullet List"
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            executeCommand('insertOrderedList')
                                        }
                                        className="p-2 hover:bg-gray-200 border border-transparent hover:border-gray-300 transition-colors"
                                        title="Numbered List"
                                    >
                                        <ListOrdered className="w-4 h-4" />
                                    </button>

                                    <div className="w-px h-6 bg-gray-300 mx-1" />

                                    <button
                                        type="button"
                                        onClick={addLink}
                                        className="p-2 hover:bg-gray-200 border border-transparent hover:border-gray-300 transition-colors"
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
                                        className="ml-2 text-sm border border-gray-300 px-2 py-1"
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
                            </div>

                            <div
                                ref={setEditorRef}
                                contentEditable
                                className="w-full min-h-[200px] border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{ fontSize: '14px', lineHeight: '1.5' }}
                                onInput={(e) =>
                                    handleEditorChange(
                                        e.currentTarget.innerHTML,
                                    )
                                }
                                dangerouslySetInnerHTML={{
                                    __html: formData.description,
                                }}
                                data-placeholder="Mô tả chi tiết về sản phẩm của bạn..."
                            />

                            <style jsx>{`
                                [contenteditable]:empty:before {
                                    content: attr(data-placeholder);
                                    color: #9ca3af;
                                    pointer-events: none;
                                }
                            `}</style>
                        </div>

                        <div className="border border-primary p-6 bg-secondary">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="autoExtension"
                                    name="enableAutoExtension"
                                    checked={formData.enableAutoExtension}
                                    onChange={handleInputChange}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                    <label
                                        htmlFor="autoExtension"
                                        className="font-medium text-black cursor-pointer"
                                    >
                                        Enable Auto-Extension
                                    </label>
                                    <p className="text-sm text-gray-600 mt-1">
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

                        <div className="pt-6 border-t">
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-8"
                                >
                                    Save as Draft
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className={`px-8 ${
                                        formData.images.length < 3 ||
                                        !formData.productName ||
                                        !formData.startingPrice ||
                                        !formData.bidIncrement ||
                                        !formData.category
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    disabled={
                                        formData.images.length < 3 ||
                                        !formData.productName ||
                                        !formData.startingPrice ||
                                        !formData.bidIncrement ||
                                        !formData.category
                                    }
                                >
                                    Publish Auction
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
