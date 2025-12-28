'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/modules/shared/components/ui';
import { OTPInput } from '@/components/OTPInput';
import { useAuthStore } from '@/stores/authStore';
import { validatePassword } from '@/lib/validation';
import { ArrowLeft, LockKeyhole, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const { resetPassword, isLoading, error, clearError } = useAuthStore();
    const [isVisible, setIsVisible] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string>
    >({});

    useEffect(() => {
        const resetEmail = localStorage.getItem('passwordResetEmail');
        if (!resetEmail) {
            router.push('/forgot-password');
        } else {
            setTimeout(() => setEmail(resetEmail), 0);
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
            await resetPassword(email, otp, newPassword, confirmPassword);
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
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-dark-primary/10 rounded-full blur-3xl opacity-50"></div>
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
                                src="/img2.png"
                                alt="Jewelry"
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                    <LockKeyhole className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
                    <Link
                        href="/forgot-password"
                        className="absolute top-8 left-8 text-neutral-500 hover:text-dark-primary transition-colors flex items-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>

                    <div
                        className={`max-w-md mx-auto w-full mt-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                    >
                        <div className="text-center mb-8">
                            <h1 className="font-heading text-4xl font-medium text-neutral-900 mb-3">
                                Reset Password
                            </h1>
                            <p className="text-neutral-500">
                                Enter the code sent to{' '}
                                <span className="font-semibold text-neutral-900">
                                    {email}
                                </span>{' '}
                                and set your new password.
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

                            <div>
                                <label className="block font-body text-sm font-medium text-neutral-700 mb-2">
                                    Verification Code
                                </label>
                                <div className="flex justify-center">
                                    <OTPInput
                                        value={otp}
                                        onChange={setOtp}
                                        disabled={isLoading}
                                        error={
                                            !!validationErrors.otp || !!error
                                        }
                                    />
                                </div>
                                {validationErrors.otp && (
                                    <p className="text-sm text-red-600 font-body mt-2 text-center">
                                        {validationErrors.otp}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block font-body text-base font-medium text-black mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showNewPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Min 8 chars, 1 uppercase, 1 number"
                                        value={newPassword}
                                        onChange={handlePasswordChange(
                                            'newPassword',
                                        )}
                                        required
                                        className={`w-full px-4 py-2 bg-secondary border rounded-xl font-body text-base placeholder-neutral-400 focus:outline-none focus:ring-1 focus:border-dark-primary transition-colors pr-12 ${
                                            validationErrors.password
                                                ? 'border-red-500'
                                                : 'border-dark-primary'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(!showNewPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.password && (
                                    <p className="text-sm text-red-600 font-body mt-2">
                                        {validationErrors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block font-body text-base font-medium text-black mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Re-enter your new password"
                                        value={confirmPassword}
                                        onChange={handlePasswordChange(
                                            'confirmPassword',
                                        )}
                                        required
                                        className={`w-full px-4 py-2 bg-secondary border rounded-xl font-body text-base placeholder-neutral-400 focus:outline-none focus:ring-1 focus:border-dark-primary transition-colors pr-12 ${
                                            validationErrors.confirmPassword
                                                ? 'border-red-500'
                                                : 'border-dark-primary'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.confirmPassword && (
                                    <p className="text-sm text-red-600 font-body mt-2">
                                        {validationErrors.confirmPassword}
                                    </p>
                                )}
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
                                        Resetting...
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
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
