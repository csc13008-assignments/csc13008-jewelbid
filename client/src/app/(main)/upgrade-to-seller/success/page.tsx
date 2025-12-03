'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/modules/shared/components/ui';

export default function UpgradeToSellerSuccessPage() {
    const router = useRouter();

    const handleBackToHomepage = () => {
        router.push('/');
    };

    const handleViewApplicationStatus = () => {
        router.push('/application-status');
    };

    return (
        <div className="min-h-screen bg-white py-30">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="font-heading text-4xl font-medium text-black mb-4">
                        Your application has been submitted successfully.
                    </h1>

                    <p className="text-neutral-600 font-body mb-2">
                        Our team will review your information within 3 business
                        days.
                    </p>
                    <p className="text-neutral-600 font-body">
                        You&apos;ll be notified via email once the review is
                        completed.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={handleBackToHomepage}
                        variant="outline"
                        size="lg"
                        className="px-6"
                    >
                        Back to Homepage
                    </Button>

                    <Button
                        onClick={handleViewApplicationStatus}
                        variant="primary"
                        size="lg"
                        className="px-6"
                    >
                        View My Application Status
                    </Button>
                </div>
            </div>
        </div>
    );
}
