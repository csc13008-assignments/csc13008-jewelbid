'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/modules/shared/components/ui';
import { useAuthStore } from '@/stores/authStore';

export default function SignInPage() {
    const router = useRouter();
    const { signIn, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange =
        (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({
                ...prev,
                [field]: e.target.value,
            }));
            if (error) clearError();
        };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        try {
            await signIn(formData.email, formData.password);

            // Successfully signed in, navigate to home
            router.push('/');
        } catch (err: unknown) {
            const apiError = err as {
                response?: { data?: { message?: string } };
            };
            const message = apiError.response?.data?.message || '';

            // Check if error is due to unverified email
            if (message.includes('email') && message.includes('verify')) {
                // Store email and redirect to verification page
                localStorage.setItem(
                    'pendingVerificationEmail',
                    formData.email,
                );
                router.push('/verify-email');
            } else {
                console.error('Login error:', err);
            }
        }
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
                    <h1 className="font-heading text-5xl text-center font-medium text-black mb-8">
                        Log In
                    </h1>

                    <form
                        onSubmit={(e) => void handleSubmit(e)}
                        className="space-y-6"
                    >
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            required
                        />

                        <div className="pt-0">
                            <div className="flex justify-between items-center mb-6">
                                <p className="font-body text-sm text-neutral-600">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="/signup"
                                        className="text-black hover:underline"
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                                <Link
                                    href="/forgot-password"
                                    className="font-body text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="muted"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
