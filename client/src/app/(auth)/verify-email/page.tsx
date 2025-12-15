'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { OTPInput } from '@/components/OTPInput';
import { useAuthStore } from '@/stores/authStore';
import { ArrowLeft, MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const { verifyEmail, resendVerification, isLoading, error, clearError } =
        useAuthStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const pendingEmail = localStorage.getItem('pendingVerificationEmail');
        if (!pendingEmail) {
            router.push('/signup');
        } else {
            setTimeout(() => setEmail(pendingEmail), 0);
        }
    }, [router]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setTimeout(() => setCanResend(true), 0);
        }
    }, [countdown]);

    const handleOtpComplete = async (value: string) => {
        if (!email) return;

        try {
            await verifyEmail(email, value);
            router.push('/');
        } catch (err) {
            console.error('Verification error:', err);
        }
    };

    const handleResend = async () => {
        if (!canResend || !email) return;

        try {
            clearError();
            await resendVerification(email);
            setCanResend(false);
            setCountdown(60);
            setOtp('');
        } catch (err) {
            console.error('Resend error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-dark-primary/10 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div
                className={`w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-primary/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {/* Left: Image */}
                <div className="lg:w-1/2 bg-primary/5 p-8 relative hidden lg:block overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
                    <div className="h-full flex items-center justify-center relative z-10">
                        <div
                            className={`relative w-full aspect-square max-w-sm rounded-2xl overflow-hidden shadow-lg transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        >
                            <Image
                                src="/img1.png"
                                alt="Jewelry"
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                    <MailCheck className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
                    <Link
                        href="/signup"
                        className="absolute top-8 left-8 text-neutral-500 hover:text-dark-primary transition-colors flex items-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Sign Up
                    </Link>

                    <div
                        className={`max-w-md mx-auto w-full mt-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                    >
                        <div className="text-center mb-8">
                            <h1 className="font-heading text-4xl font-medium text-neutral-900 mb-3">
                                Verify Email
                            </h1>
                            <p className="text-neutral-500">
                                We&apos;ve sent a 6-digit code to <br />
                                <span className="font-semibold text-neutral-900">
                                    {email}
                                </span>
                            </p>
                        </div>

                        <div className="space-y-8">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-shake">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    <p className="text-sm font-medium">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-center">
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    onComplete={(value) =>
                                        void handleOtpComplete(value)
                                    }
                                    disabled={isLoading}
                                    error={!!error}
                                />
                            </div>

                            <div className="space-y-4 text-center">
                                <p className="text-sm text-neutral-600">
                                    Didn&apos;t receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={() => void handleResend()}
                                        disabled={!canResend || isLoading}
                                        className="text-dark-primary font-medium hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
                                    >
                                        {countdown > 0
                                            ? `Resend in ${countdown}s`
                                            : 'Resend Code'}
                                    </button>
                                </p>

                                {isLoading && (
                                    <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm">
                                        <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
                                        Verifying...
                                    </div>
                                )}
                            </div>
                        </div>
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
