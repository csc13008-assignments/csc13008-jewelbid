'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Input, Button } from '@/modules/shared/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { isValidEmail } from '@/lib/validation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { passwordRecovery, isLoading, error, clearError } = useAuthStore();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        try {
            clearError();
            await passwordRecovery(email);

            // Navigate to reset password page
            router.push('/reset-password');
        } catch (err) {
            console.error('Password recovery error:', err);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError('');
        if (error) clearError();
    };

    return (
        <div className="min-h-screen bg-primary flex">
            <div className="flex-1 ">
                <div className="grid grid-cols-1 gap-6 h-full">
                    <div className="relative overflow-hidden">
                        <Image
                            src="/img1.png"
                            alt="Jewelry collection"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6 flex-1">
                        <div className="relative overflow-hidden">
                            <Image
                                src="/img2.png"
                                alt="Necklace"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="relative overflow-hidden">
                            <Image
                                src="/img3.png"
                                alt="Earrings"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h1 className="font-heading text-5xl text-center font-medium text-black mb-4">
                        Forgot Password
                    </h1>

                    <p className="font-body text-base text-neutral-600 text-center mb-8">
                        Enter your email and we'll send you a code to reset your
                        password
                    </p>

                    <form
                        onSubmit={(e) => void handleSubmit(e)}
                        className="space-y-6"
                    >
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                <p className="text-sm text-center">{error}</p>
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            error={emailError}
                        />

                        <div className="pt-4 space-y-4">
                            <Button
                                type="submit"
                                variant="muted"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Sending Code...'
                                    : 'Send Reset Code'}
                            </Button>

                            <Link
                                href="/signin"
                                className="block text-center text-sm text-neutral-600 hover:text-black transition-colors"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
