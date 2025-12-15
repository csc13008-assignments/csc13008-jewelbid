'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input, Button } from '@/modules/shared/components/ui';
import { Upload, CheckCircle, FileText } from 'lucide-react';

export default function UpgradeToSellerPage() {
    const [formData, setFormData] = useState({
        businessName: '',
        taxId: '',
        address: '',
        phone: '',
        description: '',
        idCardFront: null as File | null,
        idCardBack: null as File | null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'idCardFront' | 'idCardBack',
    ) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({
                ...prev,
                [field]: e.target.files![0],
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
        }, 2000);
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                        Application Submitted!
                    </h2>
                    <p className="text-neutral-600 mb-8 leading-relaxed">
                        Thank you for applying to become a seller. Our team will
                        review your documents and get back to you within 2-3
                        business days.
                    </p>
                    <Link href="/application-status">
                        <Button
                            variant="primary"
                            className="w-full rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all py-3"
                        >
                            Check Application Status
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 py-12 lg:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white shadow-sm border border-neutral-100 rounded-2xl p-8 lg:p-10">
                    <div className="mb-8">
                        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                            Become a Seller
                        </h1>
                        <p className="text-neutral-600 text-lg">
                            Join our exclusive community of jewelry sellers.
                            Please provide your business details and
                            identification documents for verification.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                                Business Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Business Name *
                                    </label>
                                    <Input
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                        placeholder="Enter business name"
                                        className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Tax ID / Business Reg. No. *
                                    </label>
                                    <Input
                                        name="taxId"
                                        value={formData.taxId}
                                        onChange={handleInputChange}
                                        placeholder="Enter tax ID"
                                        className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Business Address *
                                    </label>
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter full business address"
                                        className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number"
                                        className="w-full rounded-xl bg-neutral-50 border-neutral-200 focus:border-dark-primary"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        Business Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all resize-none"
                                        placeholder="Tell us about your business and the type of jewelry you sell..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                                Identity Verification
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        ID Card (Front) *
                                    </label>
                                    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-dark-primary hover:bg-neutral-50 transition-all cursor-pointer group h-48 flex flex-col items-center justify-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e,
                                                    'idCardFront',
                                                )
                                            }
                                            className="hidden"
                                            id="id-front"
                                            required
                                        />
                                        <label
                                            htmlFor="id-front"
                                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                        >
                                            {formData.idCardFront ? (
                                                <div className="flex flex-col items-center">
                                                    <FileText className="w-10 h-10 text-green-500 mb-2" />
                                                    <span className="text-sm font-medium text-green-700 truncate max-w-[200px]">
                                                        {
                                                            formData.idCardFront
                                                                .name
                                                        }
                                                    </span>
                                                    <span className="text-xs text-green-600 mt-1">
                                                        Click to change
                                                    </span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="w-10 h-10 text-neutral-400 group-hover:text-dark-primary mb-3 transition-colors" />
                                                    <span className="text-dark-primary font-bold">
                                                        Upload Front Side
                                                    </span>
                                                    <span className="text-xs text-neutral-500 mt-1">
                                                        JPG, PNG or PDF
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                                        ID Card (Back) *
                                    </label>
                                    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-dark-primary hover:bg-neutral-50 transition-all cursor-pointer group h-48 flex flex-col items-center justify-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e,
                                                    'idCardBack',
                                                )
                                            }
                                            className="hidden"
                                            id="id-back"
                                            required
                                        />
                                        <label
                                            htmlFor="id-back"
                                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                        >
                                            {formData.idCardBack ? (
                                                <div className="flex flex-col items-center">
                                                    <FileText className="w-10 h-10 text-green-500 mb-2" />
                                                    <span className="text-sm font-medium text-green-700 truncate max-w-[200px]">
                                                        {
                                                            formData.idCardBack
                                                                .name
                                                        }
                                                    </span>
                                                    <span className="text-xs text-green-600 mt-1">
                                                        Click to change
                                                    </span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="w-10 h-10 text-neutral-400 group-hover:text-dark-primary mb-3 transition-colors" />
                                                    <span className="text-dark-primary font-bold">
                                                        Upload Back Side
                                                    </span>
                                                    <span className="text-xs text-neutral-500 mt-1">
                                                        JPG, PNG or PDF
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                            <p className="text-sm text-neutral-500">
                                By submitting, you agree to our{' '}
                                <Link
                                    href="/terms"
                                    className="text-dark-primary hover:underline"
                                >
                                    Seller Terms & Conditions
                                </Link>
                            </p>
                            <Button
                                type="submit"
                                variant="muted"
                                size="md"
                                disabled={isSubmitting}
                                className="px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
