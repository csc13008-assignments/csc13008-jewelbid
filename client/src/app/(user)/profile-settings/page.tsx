'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input, Button } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import {
    Upload,
    Camera,
    User,
    Settings,
    Lock,
    Check,
    Shield,
    Eye,
    EyeOff,
} from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { authApi } from '@/lib/api/auth';
import toast from '@/lib/toast';

export default function ProfileSettingsPage() {
    const [profileData, setProfileData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        avatar: '/avatars/default.jpg',
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const loadUserData = () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setProfileData({
                        fullName: user.fullname || '',
                        phoneNumber: user.phone || '',
                        email: user.email || '',
                        address: user.address || '',
                        avatar: user.profileImage || '/avatars/default.jpg',
                    });
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            } finally {
                setIsLoading(false);
                setTimeout(() => setIsVisible(true), 100);
            }
        };

        loadUserData();
    }, []);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                setProfileData((prev) => ({
                    ...prev,
                    avatar: imageUrl,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileEdit = async () => {
        if (isEditingProfile) {
            setIsSavingProfile(true);
            try {
                const updateData: Record<string, string> = {};
                if (profileData.fullName)
                    updateData.fullname = profileData.fullName;
                if (profileData.email) updateData.email = profileData.email;
                if (profileData.address)
                    updateData.address = profileData.address;
                if (
                    profileData.phoneNumber &&
                    profileData.phoneNumber.match(/^(\+84|0)\d{9,10}$/)
                ) {
                    updateData.phone = profileData.phoneNumber;
                }

                const updatedUser = await usersApi.updateProfile(updateData);

                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    const updatedUserData = {
                        ...user,
                        fullname: updatedUser.fullname || profileData.fullName,
                        phone: updatedUser.phone || profileData.phoneNumber,
                        email: updatedUser.email || profileData.email,
                        address: updatedUser.address || profileData.address,
                        profileImage:
                            updatedUser.profileImage || profileData.avatar,
                    };
                    localStorage.setItem(
                        'user',
                        JSON.stringify(updatedUserData),
                    );
                }

                toast.success('Profile updated successfully!');
                setIsEditingProfile(false);
            } catch (error) {
                console.error('Failed to update profile:', error);
                toast.error('Failed to update profile');
            } finally {
                setIsSavingProfile(false);
            }
        } else {
            setIsEditingProfile(true);
        }
    };

    const handlePasswordSave = async () => {
        if (
            !passwordData.oldPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {
            toast.warning('Please fill in all password fields');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.warning('Password must be at least 6 characters');
            return;
        }

        setIsSavingPassword(true);
        try {
            await authApi.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword,
            });

            toast.success('Password changed successfully!');
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: unknown) {
            console.error('Failed to change password:', error);
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(
                err.response?.data?.message || 'Failed to change password',
            );
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-dark-primary animate-spin"></div>
                    <p className="mt-4 text-neutral-500 animate-pulse">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <UserSidebar />
                    </div>

                    <div className="lg:col-span-3 space-y-8">
                        {/* Personal Information Card */}
                        <div
                            className={`bg-white rounded-xl shadow-lg border border-primary p-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-primary">
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-dark-primary rounded-full"></div>
                                    <h1 className="font-heading text-2xl font-semibold text-neutral-900 flex items-center gap-3">
                                        <Settings className="w-6 h-6 text-dark-primary" />
                                        Personal Information
                                    </h1>
                                    <p className="text-neutral-500 mt-1">
                                        Manage your personal details
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => void handleProfileEdit()}
                                    disabled={isSavingProfile}
                                    variant="muted"
                                >
                                    {isSavingProfile ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </span>
                                    ) : isEditingProfile ? (
                                        <span className="flex items-center gap-2">
                                            <Check className="w-4 h-4" />
                                            Save Changes
                                        </span>
                                    ) : (
                                        'Edit Profile'
                                    )}
                                </Button>
                            </div>

                            {/* Avatar Section */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-neutral-700 mb-3">
                                    Profile Picture
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div
                                            className={`w-24 h-24 rounded-2xl overflow-hidden bg-primary border-2 transition-all duration-300 ${isEditingProfile ? 'border-dark-primary shadow-lg' : 'border-primary'}`}
                                        >
                                            {profileData.avatar &&
                                            profileData.avatar !==
                                                '/avatars/default.jpg' ? (
                                                <Image
                                                    src={profileData.avatar}
                                                    alt="Profile"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary">
                                                    <User className="w-10 h-10 text-dark-primary" />
                                                </div>
                                            )}
                                        </div>
                                        {isEditingProfile && (
                                            <label
                                                htmlFor="avatar-upload"
                                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-dark-primary rounded-full cursor-pointer flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                                            >
                                                <Camera className="w-4 h-4 text-white" />
                                            </label>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        {isEditingProfile ? (
                                            <div className="space-y-2">
                                                <input
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={
                                                        handleAvatarUpload
                                                    }
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="avatar-upload"
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary text-sm font-medium text-neutral-700 bg-white rounded-lg hover:bg-primary hover:border-dark-primary cursor-pointer transition-all duration-200"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Choose Photo
                                                </label>
                                                <p className="text-xs text-neutral-500">
                                                    JPG, PNG up to 5MB.
                                                    Recommended: 400x400px
                                                </p>
                                                <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block">
                                                    ⚠️ Avatar upload will be
                                                    available soon
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-neutral-500">
                                                Click &quot;Edit Profile&quot;
                                                to change your picture
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Full Name
                                        </label>
                                        {isEditingProfile ? (
                                            <Input
                                                name="fullName"
                                                placeholder="Enter your full name"
                                                value={profileData.fullName}
                                                onChange={handleProfileChange}
                                                className="w-full h-12 rounded-lg border-primary focus:border-dark-primary focus:ring-dark-primary/20 transition-all"
                                            />
                                        ) : (
                                            <div className="w-full h-12 px-4 py-3 border border-primary bg-secondary rounded-lg flex items-center text-neutral-700">
                                                {profileData.fullName || (
                                                    <span className="text-neutral-400">
                                                        Not set
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Phone Number
                                        </label>
                                        {isEditingProfile ? (
                                            <Input
                                                name="phoneNumber"
                                                placeholder="Enter phone number"
                                                value={profileData.phoneNumber}
                                                onChange={handleProfileChange}
                                                className="w-full h-12 rounded-lg border-primary focus:border-dark-primary focus:ring-dark-primary/20 transition-all"
                                            />
                                        ) : (
                                            <div className="w-full h-12 px-4 py-3 border border-primary bg-secondary rounded-lg flex items-center text-neutral-700">
                                                {profileData.phoneNumber || (
                                                    <span className="text-neutral-400">
                                                        Not set
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Email Address
                                        </label>
                                        {isEditingProfile ? (
                                            <Input
                                                name="email"
                                                type="email"
                                                placeholder="Enter email"
                                                value={profileData.email}
                                                onChange={handleProfileChange}
                                                className="w-full h-12 rounded-lg border-primary focus:border-dark-primary focus:ring-dark-primary/20 transition-all"
                                            />
                                        ) : (
                                            <div className="w-full h-12 px-4 py-3 border border-primary bg-secondary rounded-lg flex items-center text-neutral-700">
                                                {profileData.email || (
                                                    <span className="text-neutral-400">
                                                        Not set
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Address
                                        </label>
                                        {isEditingProfile ? (
                                            <Input
                                                name="address"
                                                placeholder="Enter address"
                                                value={profileData.address}
                                                onChange={handleProfileChange}
                                                className="w-full h-12 rounded-lg border-primary focus:border-dark-primary focus:ring-dark-primary/20 transition-all"
                                            />
                                        ) : (
                                            <div className="w-full h-12 px-4 py-3 border border-primary bg-secondary rounded-lg flex items-center text-neutral-700">
                                                {profileData.address || (
                                                    <span className="text-neutral-400">
                                                        Not set
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Password Card */}
                        <div
                            className={`bg-white rounded-xl shadow-lg border border-primary p-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            style={{ transitionDelay: '0.1s' }}
                        >
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-primary">
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-dark-primary rounded-full"></div>
                                    <h2 className="font-heading text-2xl font-semibold text-neutral-900 flex items-center gap-3">
                                        <Lock className="w-6 h-6 text-dark-primary" />
                                        Change Password
                                    </h2>
                                    <p className="text-neutral-500 mt-1">
                                        Keep your account secure
                                    </p>
                                </div>
                            </div>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                name="oldPassword"
                                                type={
                                                    showOldPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="Enter current password"
                                                value={passwordData.oldPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full h-12 rounded-lg border-primary focus:border-dark-primary focus:ring-dark-primary/20 transition-all pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowOldPassword(
                                                        !showOldPassword,
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-dark-primary transition-colors"
                                            >
                                                {showOldPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                name="newPassword"
                                                type={
                                                    showNewPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="Enter new password"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full h-12 rounded-lg border-primary focus:border-dark-primary focus:ring-dark-primary/20 transition-all pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword,
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-dark-primary transition-colors"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                name="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="Confirm new password"
                                                value={
                                                    passwordData.confirmPassword
                                                }
                                                onChange={handlePasswordChange}
                                                className="w-full h-12 rounded-lg border-primary focus:border-dark-primary focus:ring-dark-primary/20 transition-all pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword,
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-dark-primary transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="p-4 bg-secondary rounded-xl border border-primary">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shield className="w-4 h-4 text-dark-primary" />
                                        <span className="text-sm font-medium text-neutral-700">
                                            Password Requirements
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-dark-primary"></div>
                                            <span>8-50 characters long</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-dark-primary"></div>
                                            <span>
                                                Include uppercase & lowercase
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-dark-primary"></div>
                                            <span>
                                                Include at least one number
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            void handlePasswordSave()
                                        }
                                        disabled={isSavingPassword}
                                        variant="muted"
                                    >
                                        {isSavingPassword ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Updating...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Update Password
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
