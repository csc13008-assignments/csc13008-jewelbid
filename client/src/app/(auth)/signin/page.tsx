'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/modules/shared/components/ui';
import { useAuthStore } from '@/stores/authStore';
import toast from '@/lib/toast';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
    const router = useRouter();
    const { signIn, isLoading, error, clearError } = useAuthStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

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

            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user: { id: string; role: string } = JSON.parse(userStr);

                toast.success('Login successful! Welcome back.');

                if (user.role.toLowerCase() === 'admin') {
                    router.push('/admin/categories');
                } else {
                    router.push('/');
                }
            } else {
                throw new Error('User not found');
            }
        } catch (err: unknown) {
            const apiError = err as {
                response?: { data?: { message?: string } };
            };
            const message = apiError.response?.data?.message || '';

            if (message.includes('email') && message.includes('verify')) {
                localStorage.setItem(
                    'pendingVerificationEmail',
                    formData.email,
                );
                toast.warning('Please verify your email first');
                router.push('/verify-email');
            } else {
                toast.error(
                    message || 'Login failed. Please check your credentials.',
                );
            }
        }
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-dark-primary/10 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div
                className={`w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-primary/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {/* Left: Images */}
                <div className="lg:w-1/2 bg-primary/5 p-8 relative hidden lg:block overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>

                    <div className="grid grid-cols-2 gap-4 h-full relative z-10">
                        <div
                            className={`relative h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        >
                            <Image
                                src="/img1.png"
                                alt="Jewelry collection"
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="font-heading text-xl font-medium">
                                    Timeless Elegance
                                </p>
                                <p className="text-sm text-white/80">
                                    Discover unique pieces
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 h-full">
                            <div
                                className={`relative flex-1 rounded-2xl overflow-hidden shadow-lg transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                            >
                                <Image
                                    src="/img2.png"
                                    alt="Necklace"
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div
                                className={`relative flex-1 rounded-2xl overflow-hidden shadow-lg transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                            >
                                <Image
                                    src="/img3.png"
                                    alt="Earrings"
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
                    <Link
                        href="/"
                        className="absolute top-8 left-8 text-neutral-500 hover:text-dark-primary transition-colors flex items-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div
                        className={`max-w-md mx-auto w-full transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                    >
                        <div className="text-center mb-6">
                            <h1 className="font-heading mt-4 text-4xl lg:text-5xl font-medium text-neutral-900 mb-3">
                                Welcome Back
                            </h1>
                            <p className="text-neutral-500">
                                Enter your details to access your account
                            </p>
                        </div>

                        <form
                            onSubmit={(e) => void handleSubmit(e)}
                            className="space-y-6"
                        >
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-shake">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    <p className="text-sm font-medium">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-5">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    required
                                    className="h-12 rounded-xl"
                                />

                                <div>
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange('password')}
                                        required
                                        className="h-12 rounded-xl"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-dark-primary hover:text-primary font-medium transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="muted"
                                size="lg"
                                className="w-full h-12 rounded-xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Logging in...
                                    </div>
                                ) : (
                                    'Log In'
                                )}
                            </Button>

                            <p className="text-center text-neutral-600 mt-8">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/signup"
                                    className="text-dark-primary font-medium hover:text-primary transition-colors hover:underline"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-5px);
                    }
                    75% {
                        transform: translateX(5px);
                    }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
}
