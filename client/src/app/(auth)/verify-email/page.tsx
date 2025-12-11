'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { OTPInput } from '@/components/OTPInput';
import { useAuthStore } from '@/stores/authStore';

export default function VerifyEmailPage() {
    const router = useRouter();
    const { verifyEmail, resendVerification, isLoading, error, clearError } =
        useAuthStore();

    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        // Get email from localStorage
        const pendingEmail = localStorage.getItem('pendingVerificationEmail');
        if (!pendingEmail) {
            // No pending verification, redirect to signup
            router.push('/signup');
        } else {
            setEmail(pendingEmail);
        }
    }, [router]);

    useEffect(() => {
        // Countdown timer for resend button
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleOtpComplete = async (value: string) => {
        if (!email) return;

        try {
            await verifyEmail(email, value);
            // Successfully verified, navigate to home
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
            setCountdown(60); // 60 seconds cooldown
            setOtp(''); // Clear OTP input
        } catch (err) {
            console.error('Resend error:', err);
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
                    <h1 className="font-heading text-5xl text-center font-medium text-black mb-4">
                        Verify Email
                    </h1>

                    <p className="font-body text-base text-neutral-600 text-center mb-8">
                        We've sent a 6-digit code to
                        <br />
                        <span className="font-semibold text-black">
                            {email}
                        </span>
                    </p>

                    <div className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                <p className="text-sm text-center">{error}</p>
                            </div>
                        )}

                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            onComplete={(value) =>
                                void handleOtpComplete(value)
                            }
                            disabled={isLoading}
                            error={!!error}
                        />

                        <div className="pt-4 space-y-4">
                            <p className="font-body text-sm text-neutral-600 text-center">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={() => void handleResend()}
                                    disabled={!canResend || isLoading}
                                    className="text-black hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {countdown > 0
                                        ? `Resend in ${countdown}s`
                                        : 'Resend Code'}
                                </button>
                            </p>

                            <Link
                                href="/signin"
                                className="block text-center text-sm text-neutral-600 hover:text-black transition-colors"
                            >
                                Back to Sign In
                            </Link>
                        </div>

                        {isLoading && (
                            <div className="text-center">
                                <p className="text-sm text-neutral-600">
                                    Verifying...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
