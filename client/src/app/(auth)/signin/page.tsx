'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input, Button } from '@/modules/shared/components/ui';

export default function SignInPage() {
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
        };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Sign in form data:', formData);
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            required
                        />

                        <div className="pt-0">
                            <p className="font-body text-sm text-neutral-600 mb-6 text-center">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/signup"
                                    className="text-black hover:underline"
                                >
                                    Sign Up
                                </Link>
                            </p>

                            <Button
                                type="submit"
                                variant="muted"
                                size="lg"
                                className="w-full"
                            >
                                Log In
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
