'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block font-body text-base font-medium text-black">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        'w-full px-4 py-2 bg-secondary border border-dark-primary font-body text-base placeholder-neutral-400',
                        'focus:outline-none focus:border-dark-primary focus:ring-1 duration-200',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-red-500 focus:border-red-500',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-600 font-body">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-neutral-500 font-body">
                        {helperText}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
