'use client';

import { X } from 'lucide-react';
import Button from '@/modules/shared/components/ui/Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
}

const typeStyles = {
    danger: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'text-amber-600',
        button: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
    },
};

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    type = 'warning',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const styles = typeStyles[type];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white p-6 max-w-md w-full mx-4 rounded-2xl shadow-xl border border-primary animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div
                        className={`w-12 h-12 rounded-xl ${styles.bg} border ${styles.border} flex items-center justify-center`}
                    >
                        <svg
                            className={`w-6 h-6 ${styles.icon}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-full hover:bg-neutral-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {title}
                </h3>
                <p className="text-neutral-600 mb-6">{message}</p>

                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="rounded-xl"
                    >
                        {cancelText}
                    </Button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-xl text-white font-medium transition-colors ${styles.button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
