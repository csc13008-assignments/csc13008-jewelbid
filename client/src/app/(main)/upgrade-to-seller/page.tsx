'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/modules/shared/components/ui';
import { Upload, X } from 'lucide-react';

export default function UpgradeToSellerPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        idOrPassport: '',
    });
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setUploadedFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            router.push('/upgrade-to-seller/success');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white border border-neutral-200 p-8">
                    <div className="mb-8">
                        <h1 className="font-heading text-4xl font-bold text-black mb-2">
                            Upgrade to Seller Account
                        </h1>
                        <p className="text-black font-body text-base">
                            Become a verified seller to start listing your own
                            items for auction.
                        </p>
                        <p className="text-black font-body text-base">
                            Please provide the required information and
                            documents for verification.
                        </p>

                        <p className="text-red-400 text-sm font-body font-bold italic">
                            All documents are used for identity verification
                            only and will not be shared publicly.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-black mb-3">
                                    Full Name
                                </label>
                                <Input
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 text-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-3">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 text-base"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-black mb-3">
                                    Phone number
                                </label>
                                <Input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Enter your phone number"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 text-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-3">
                                    Address
                                </label>
                                <Input
                                    name="address"
                                    placeholder="Enter your address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 text-base"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-black mb-3">
                                    ID / Passport (front & back)
                                </label>

                                <div className="border-2 border-dashed border-neutral-300 p-6 text-center hover:border-neutral-400 transition-colors">
                                    <input
                                        type="file"
                                        id="idUpload"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="idUpload"
                                        className="cursor-pointer"
                                    >
                                        <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                                        <p className="text-neutral-600 font-body">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-sm text-neutral-500 font-body">
                                            PNG, JPG, JPEG up to 10MB
                                        </p>
                                    </label>
                                </div>

                                {uploadedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {uploadedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-neutral-50 p-3 rounded"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-neutral-700">
                                                        {file.name}
                                                    </span>
                                                    <span className="text-xs text-neutral-500">
                                                        (
                                                        {(
                                                            file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{' '}
                                                        MB)
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-end">
                                <div className="space-y-3 text-sm text-neutral-700 font-body">
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-500 mt-0.5">
                                            🔸
                                        </span>
                                        <span>
                                            Your application will be reviewed by
                                            our admin team within 7 business
                                            days.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-500 mt-0.5">
                                            🔸
                                        </span>
                                        <span>
                                            Please check your email regularly
                                            for status updates or additional
                                            verification requests.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-500 mt-0.5">
                                            🔸
                                        </span>
                                        <span>
                                            You&apos;ll receive a confirmation
                                            once your seller account is
                                            approved.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-500 mt-0.5">
                                            🔸
                                        </span>
                                        <span>
                                            Incomplete or unclear submissions
                                            may cause delays in approval.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="px-12 py-3 text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
