'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/modules/shared/components/ui';
import { CheckCircle, Info, Sparkles } from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import toast from '@/lib/toast';

export default function UpgradeToSellerPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleRequestUpgrade = async () => {
        setIsSubmitting(true);

        try {
            await usersApi.requestSellerUpgrade();
            setSubmitSuccess(true);
            toast.success('Upgrade request submitted successfully!');
        } catch (error: unknown) {
            console.error('Failed to submit upgrade request:', error);
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ||
                'Failed to submit request. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                        Request Submitted!
                    </h2>
                    <p className="text-neutral-600 mb-8 leading-relaxed">
                        Thank you for requesting to become a seller. Our admin
                        team will review your request and get back to you within
                        7 days.
                    </p>
                    <Link href="/">
                        <Button
                            variant="primary"
                            className="w-full rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all py-3"
                        >
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 py-12 lg:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white shadow-sm border border-neutral-100 rounded-2xl p-8 lg:p-10">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-dark-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                            Become a Seller
                        </h1>
                        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                            Join our community of jewelry sellers and start
                            listing your products for auction.
                        </p>
                    </div>

                    <div className="bg-secondary border border-primary rounded-xl p-6 mb-8">
                        <div className="flex items-start space-x-3">
                            <Info className="w-6 h-6 text-black mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-black mb-2">
                                    Important Information
                                </p>
                                <ul className="text-black space-y-2 text-sm">
                                    <li>
                                        • Your request will be valid for{' '}
                                        <strong>7 days</strong>
                                    </li>
                                    <li>
                                        • Admin will review and approve within
                                        this period
                                    </li>
                                    <li>
                                        • If not approved within 7 days, you can
                                        reapply
                                    </li>
                                    <li>
                                        • You'll receive an email notification
                                        about the decision
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-6 mb-8">
                        <p className="font-bold text-black mb-4">
                            Benefits of Being a Seller:
                        </p>
                        <ul className="space-y-3 text-black">
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>List unlimited products for auction</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>
                                    Reach thousands of jewelry enthusiasts
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>
                                    Manage your auctions with powerful tools
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>Build your seller reputation</span>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center pt-6 border-t border-neutral-100">
                        <Button
                            onClick={() => void handleRequestUpgrade()}
                            variant="muted"
                            size="lg"
                            disabled={isSubmitting}
                            className="px-12 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg font-semibold"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                    Submitting Request...
                                </>
                            ) : (
                                'Request Seller Upgrade'
                            )}
                        </Button>
                        <p className="text-sm text-neutral-500 mt-4">
                            By requesting, you agree to our{' '}
                            <Link
                                href="/terms"
                                className="text-dark-primary hover:underline"
                            >
                                Seller Terms & Conditions
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
