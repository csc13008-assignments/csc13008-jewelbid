'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import { Input, Button } from '@/modules/shared/components/ui';
import { useAuthStore } from '@/stores/authStore';
import {
    isValidEmail,
    validatePassword,
    isValidPhone,
    normalizePhone,
} from '@/lib/validation';
import toast from '@/lib/toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
    const router = useRouter();
    const { signUp, isLoading, error, clearError } = useAuthStore();
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
    });

    const [validationErrors, setValidationErrors] = useState<
        Record<string, string>
    >({});

    const handleInputChange =
        (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({
                ...prev,
                [field]: e.target.value,
            }));
            if (validationErrors[field]) {
                setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
            if (error) clearError();
        };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.fullname.trim()) {
            errors.fullname = 'Full name is required';
        }

        if (!isValidEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.message!;
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!isValidPhone(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        if (!formData.address.trim()) {
            errors.address = 'Address is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        // Validate reCAPTCHA if site key is configured
        if (recaptchaSiteKey && !recaptchaToken) {
            toast.error('Please complete the reCAPTCHA verification');
            return;
        }

        try {
            await signUp({
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password,
                phone: normalizePhone(formData.phone),
                address: formData.address,
                birthdate: '',
                recaptchaToken: recaptchaToken || undefined,
            });

            toast.success('Account created! Please verify your email.');
            router.push('/verify-email');
        } catch (err) {
            console.error('Sign up error:', err);
            toast.error('Failed to create account. Please try again.');
            // Reset reCAPTCHA on error
            recaptchaRef.current?.reset();
            setRecaptchaToken(null);
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
                className={`w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-primary/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {/* Left: Images (Sticky) */}
                <div className="lg:w-1/2 bg-primary/5 p-8 relative hidden lg:block overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
                    <div className="h-full flex flex-col justify-center relative z-10">
                        <div
                            className={`relative h-[500px] rounded-2xl overflow-hidden shadow-lg transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        >
                            <Image
                                src="/img2.png"
                                alt="Jewelry collection"
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 text-white max-w-xs">
                                <h2 className="font-heading text-3xl font-medium mb-2">
                                    Join JewelBid
                                </h2>
                                <p className="text-white/90 leading-relaxed">
                                    Start your journey to discover and bid on
                                    exclusive, handcrafted jewelry pieces from
                                    around the world.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative">
                    <Link
                        href="/"
                        className="absolute top-8 left-8 text-neutral-500 hover:text-dark-primary transition-colors flex items-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div
                        className={`max-w-md mx-auto w-full mt-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                    >
                        <div className="text-center mb-8">
                            <h1 className="font-heading text-4xl font-medium text-neutral-900 mb-2">
                                Create Account
                            </h1>
                            <p className="text-neutral-500">
                                Join our community of jewelry enthusiasts
                            </p>
                        </div>

                        <form
                            onSubmit={(e) => void handleSubmit(e)}
                            className="space-y-5"
                        >
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-shake">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    <p className="text-sm font-medium">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                value={formData.fullname}
                                onChange={handleInputChange('fullname')}
                                required
                                error={validationErrors.fullname}
                                className="rounded-xl"
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                required
                                error={validationErrors.email}
                                className="rounded-xl"
                            />

                            <Input
                                label="Phone Number"
                                type="tel"
                                placeholder="0901234567"
                                value={formData.phone}
                                onChange={handleInputChange('phone')}
                                required
                                error={validationErrors.phone}
                                className="rounded-xl"
                            />

                            <Input
                                label="Address"
                                placeholder="123 Main St, City, Vietnam"
                                value={formData.address}
                                onChange={handleInputChange('address')}
                                required
                                error={validationErrors.address}
                                className="rounded-xl"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-body text-base font-medium text-black mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Min 8 chars"
                                            value={formData.password}
                                            onChange={handleInputChange(
                                                'password',
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
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {validationErrors.password && (
                                        <p className="text-sm text-red-600 mt-1">
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
                                            placeholder="Re-enter password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange(
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
                                        <p className="text-sm text-red-600 mt-1">
                                            {validationErrors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* reCAPTCHA */}
                            {recaptchaSiteKey && (
                                <div className="flex justify-center">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={recaptchaSiteKey}
                                        onChange={handleRecaptchaChange}
                                        theme="light"
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="muted"
                                size="lg"
                                className="w-full h-12 rounded-xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Sign Up'
                                )}
                            </Button>

                            <p className="text-center text-neutral-600 mt-6">
                                Already have an account?{' '}
                                <Link
                                    href="/signin"
                                    className="text-dark-primary font-medium hover:text-primary transition-colors hover:underline"
                                >
                                    Log In
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
