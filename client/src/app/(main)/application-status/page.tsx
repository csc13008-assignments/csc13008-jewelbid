'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/modules/shared/components/ui';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function ApplicationStatusPage() {
    const router = useRouter();
    const [applicationStatus] = useState({
        id: 'APP-2025-001234',
        status: 'pending',
        submittedDate: '2025-12-01',
        reviewDate: null,
        documents: [
            { name: 'ID/Passport Front', status: 'verified' },
            { name: 'ID/Passport Back', status: 'verified' },
            { name: 'Address Verification', status: 'pending' },
            { name: 'Phone Verification', status: 'verified' },
        ],
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-6 h-6 text-red-500" />;
            default:
                return <Clock className="w-6 h-6 text-yellow-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            default:
                return 'Under Review';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'text-green-600 bg-green-50';
            case 'rejected':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-yellow-600 bg-yellow-50';
        }
    };

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-neutral-600 hover:text-black mb-4 font-body text-sm"
                    >
                        ← Back
                    </button>

                    <h1 className="font-heading text-3xl font-medium text-black mb-2">
                        Seller Application Status
                    </h1>
                    <p className="text-neutral-600 font-body">
                        Track the progress of your seller account application
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-heading text-xl font-medium text-black">
                                    Application Overview
                                </h2>
                                <div
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicationStatus.status)}`}
                                >
                                    {getStatusText(applicationStatus.status)}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">
                                        Application ID:
                                    </span>
                                    <span className="font-medium">
                                        {applicationStatus.id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">
                                        Submitted Date:
                                    </span>
                                    <span className="font-medium">
                                        {applicationStatus.submittedDate}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">
                                        Expected Review Time:
                                    </span>
                                    <span className="font-medium">
                                        3 business days
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-lg p-6">
                            <h3 className="font-heading text-lg font-medium text-black mb-4">
                                Document Verification
                            </h3>
                            <div className="space-y-3">
                                {applicationStatus.documents.map(
                                    (doc, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-4 h-4 text-neutral-400" />
                                                <span className="text-black">
                                                    {doc.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(doc.status)}
                                                <span
                                                    className={`text-sm font-medium ${
                                                        doc.status ===
                                                        'verified'
                                                            ? 'text-green-600'
                                                            : doc.status ===
                                                                'rejected'
                                                              ? 'text-red-600'
                                                              : 'text-yellow-600'
                                                    }`}
                                                >
                                                    {doc.status === 'verified'
                                                        ? 'Verified'
                                                        : doc.status ===
                                                            'rejected'
                                                          ? 'Rejected'
                                                          : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white border border-neutral-200 rounded-lg p-6">
                            <h3 className="font-heading text-lg font-medium text-black mb-4">
                                Review Timeline
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-black">
                                            Application Submitted
                                        </p>
                                        <p className="text-xs text-neutral-600">
                                            Dec 1, 2025
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-black">
                                            Under Review
                                        </p>
                                        <p className="text-xs text-neutral-600">
                                            In progress
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-neutral-300 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm text-neutral-400">
                                            Decision
                                        </p>
                                        <p className="text-xs text-neutral-400">
                                            Pending
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                onClick={() => router.push('/')}
                                variant="primary"
                                size="lg"
                                className="w-full"
                            >
                                Back to Homepage
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
