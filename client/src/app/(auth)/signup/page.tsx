'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/modules/shared/components/ui';
import { useAuthStore } from '@/stores/authStore';
import {
    isValidEmail,
    validatePassword,
    isValidPhone,
    normalizePhone,
    isValidBirthdate,
} from '@/lib/validation';

export default function SignUpPage() {
    const router = useRouter();
    const { signUp, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        birthdate: '',
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
            // Clear validation error for this field
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
            errors.phone =
                'Please enter a valid phone number (e.g., 0901234567 or +84901234567)';
        }

        if (!formData.address.trim()) {
            errors.address = 'Address is required';
        }

        const birthdateValidation = isValidBirthdate(formData.birthdate);
        if (!birthdateValidation.isValid) {
            errors.birthdate = birthdateValidation.message!;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await signUp({
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password,
                phone: normalizePhone(formData.phone),
                address: formData.address,
                birthdate: formData.birthdate,
            });

            // Navigate to verification page
            router.push('/verify-email');
        } catch (err) {
            console.error('Sign up error:', err);
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

            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                    <h1 className="font-heading text-5xl text-center font-medium text-black mb-8">
                        Sign Up
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
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.fullname}
                            onChange={handleInputChange('fullname')}
                            required
                            error={validationErrors.fullname}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            required
                            error={validationErrors.email}
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="0901234567 or +84901234567"
                            value={formData.phone}
                            onChange={handleInputChange('phone')}
                            required
                            error={validationErrors.phone}
                        />

                        <Input
                            label="Birthdate"
                            type="date"
                            value={formData.birthdate}
                            onChange={handleInputChange('birthdate')}
                            required
                            error={validationErrors.birthdate}
                        />

                        <Input
                            label="Address"
                            placeholder="123 Main St, City, Vietnam"
                            value={formData.address}
                            onChange={handleInputChange('address')}
                            required
                            error={validationErrors.address}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Min 8 chars, 1 uppercase, 1 number"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            required
                            error={validationErrors.password}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            required
                            error={validationErrors.confirmPassword}
                        />

                        <div className="pt-0">
                            <p className="font-body text-sm text-neutral-600 mb-6 text-center">
                                Already have an account?{' '}
                                <Link
                                    href="/signin"
                                    className="text-black hover:underline"
                                >
                                    Log In
                                </Link>
                            </p>

                            <Button
                                type="submit"
                                variant="muted"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
