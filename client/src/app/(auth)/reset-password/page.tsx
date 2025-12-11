'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Input, Button } from '@/modules/shared/components/ui';
import { OTPInput } from '@/components/OTPInput';
import { useAuthStore } from '@/stores/authStore';
import { validatePassword } from '@/lib/validation';

export default function ResetPasswordPage() {
    const router = useRouter();
    const { resetPassword, isLoading, error, clearError } = useAuthStore();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string>
    >({});

    useEffect(() => {
        // Get email from localStorage
        const resetEmail = localStorage.getItem('passwordResetEmail');
        if (!resetEmail) {
            // No pending reset, redirect to forgot password
            router.push('/forgot-password');
        } else {
            setEmail(resetEmail);
        }
    }, [router]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (otp.length !== 6) {
            errors.otp = 'Please enter the 6-digit code';
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.message!;
        }

        if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !email) {
            return;
        }

        try {
            clearError();
            await resetPassword(email, otp, newPassword);

            // Successfully reset, navigate to signin
            router.push('/signin');
        } catch (err) {
            console.error('Reset password error:', err);
        }
    };

    const handlePasswordChange =
        (field: 'newPassword' | 'confirmPassword') =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (field === 'newPassword') {
                setNewPassword(e.target.value);
            } else {
                setConfirmPassword(e.target.value);
            }

            if (validationErrors[field]) {
                setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
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
                        Reset Password
                    </h1>

                    <p className="font-body text-base text-neutral-600 text-center mb-8">
                        Enter the 6-digit code sent to
                        <br />
                        <span className="font-semibold text-black">
                            {email}
                        </span>
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

                        <div>
                            <label className="block font-body text-base font-medium text-black mb-2">
                                Verification Code
                            </label>
                            <OTPInput
                                value={otp}
                                onChange={setOtp}
                                disabled={isLoading}
                                error={!!validationErrors.otp || !!error}
                            />
                            {validationErrors.otp && (
                                <p className="text-sm text-red-600 font-body mt-2 text-center">
                                    {validationErrors.otp}
                                </p>
                            )}
                        </div>

                        <Input
                            label="New Password"
                            type="password"
                            placeholder="Min 8 chars, 1 uppercase, 1 number"
                            value={newPassword}
                            onChange={handlePasswordChange('newPassword')}
                            required
                            error={validationErrors.password}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter your new password"
                            value={confirmPassword}
                            onChange={handlePasswordChange('confirmPassword')}
                            required
                            error={validationErrors.confirmPassword}
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
                                    ? 'Resetting Password...'
                                    : 'Reset Password'}
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
