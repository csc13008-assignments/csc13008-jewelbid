'use client';

import {
    useState,
    useRef,
    KeyboardEvent,
    ClipboardEvent,
    ChangeEvent,
} from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export function OTPInput({
    length = 6,
    value,
    onChange,
    onComplete,
    disabled = false,
    error = false,
}: OTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Ensure value is always the correct length
    const digits = value.padEnd(length, ' ').slice(0, length).split('');

    const focusInput = (index: number) => {
        if (index >= 0 && index < length) {
            inputRefs.current[index]?.focus();
        }
    };

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // Only allow digits
        if (input && !/^\d$/.test(input)) {
            return;
        }

        const newDigits = [...digits];
        newDigits[index] = input || ' ';
        const newValue = newDigits.join('').trim();

        onChange(newValue);

        // Auto-focus next input
        if (input && index < length - 1) {
            focusInput(index + 1);
        }

        // Check if complete
        if (newValue.length === length) {
            onComplete?.(newValue);
        }
    };

    const handleKeyDown = (
        index: number,
        e: KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Backspace') {
            const newDigits = [...digits];

            if (digits[index] === ' ' && index > 0) {
                // If empty, go back and clear previous
                newDigits[index - 1] = ' ';
                onChange(newDigits.join('').trim());
                focusInput(index - 1);
            } else {
                // Clear current
                newDigits[index] = ' ';
                onChange(newDigits.join('').trim());
            }
            e.preventDefault();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            focusInput(index - 1);
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, length);

        if (pastedData) {
            onChange(pastedData);

            // Focus last filled input
            const nextIndex = Math.min(pastedData.length, length - 1);
            focusInput(nextIndex);

            // Check if complete
            if (pastedData.length === length) {
                onComplete?.(pastedData);
            }
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit === ' ' ? '' : digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    disabled={disabled}
                    className={cn(
                        'w-12 h-14 text-center text-2xl font-semibold',
                        'border-2 rounded-lg transition-all',
                        'bg-white text-black',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2',
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : focusedIndex === index
                              ? 'border-black focus:border-black focus:ring-black'
                              : 'border-neutral-300',
                        disabled &&
                            'opacity-50 cursor-not-allowed bg-neutral-100',
                    )}
                />
            ))}
        </div>
    );
}
