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
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-amber-500" />;
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
                return 'text-green-700 bg-green-50 border-green-200';
            case 'rejected':
                return 'text-red-700 bg-red-50 border-red-200';
            default:
                return 'text-amber-700 bg-amber-50 border-amber-200';
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50/50 py-12 lg:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-neutral-500 hover:text-dark-primary mb-6 font-medium text-sm flex items-center transition-colors"
                    >
                        ← Back
                    </button>

                    <h1 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 mb-3">
                        Seller Application Status
                    </h1>
                    <p className="text-neutral-500 text-lg">
                        Track the progress of your seller account application
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-neutral-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-heading text-xl font-bold text-neutral-900">
                                    Application Overview
                                </h2>
                                <div
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(applicationStatus.status)}`}
                                >
                                    {getStatusText(applicationStatus.status)}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                                    <span className="text-neutral-500 font-medium">
                                        Application ID
                                    </span>
                                    <span className="font-bold text-neutral-900 font-mono">
                                        {applicationStatus.id}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                                    <span className="text-neutral-500 font-medium">
                                        Submitted Date
                                    </span>
                                    <span className="font-bold text-neutral-900">
                                        {applicationStatus.submittedDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                                    <span className="text-neutral-500 font-medium">
                                        Expected Review Time
                                    </span>
                                    <span className="font-bold text-neutral-900">
                                        3 business days
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-neutral-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                            <h3 className="font-heading text-xl font-bold text-neutral-900 mb-6">
                                Document Verification
                            </h3>
                            <div className="space-y-3">
                                {applicationStatus.documents.map(
                                    (doc, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:border-neutral-200 transition-colors bg-white"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100">
                                                    <FileText className="w-5 h-5 text-neutral-400" />
                                                </div>
                                                <span className="font-medium text-neutral-900">
                                                    {doc.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(doc.status)}
                                                <span
                                                    className={`text-sm font-bold ${
                                                        doc.status ===
                                                        'verified'
                                                            ? 'text-green-600'
                                                            : doc.status ===
                                                                'rejected'
                                                              ? 'text-red-600'
                                                              : 'text-amber-600'
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

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-neutral-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                            <h3 className="font-heading text-xl font-bold text-neutral-900 mb-6">
                                Review Timeline
                            </h3>
                            <div className="relative pl-4 border-l-2 border-neutral-100 space-y-8">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-green-500 rounded-full ring-4 ring-white"></div>
                                    <div>
                                        <p className="text-sm font-bold text-neutral-900">
                                            Application Submitted
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            Dec 1, 2025
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-amber-500 rounded-full ring-4 ring-white animate-pulse"></div>
                                    <div>
                                        <p className="text-sm font-bold text-neutral-900">
                                            Under Review
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            In progress
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-neutral-200 rounded-full ring-4 ring-white"></div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-400">
                                            Decision
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            Pending
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => router.push('/')}
                            variant="primary"
                            size="lg"
                            className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        >
                            Back to Homepage
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
