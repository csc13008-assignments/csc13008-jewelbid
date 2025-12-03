'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input, Button } from '@/modules/shared/components/ui';
import UserSidebar from '@/modules/shared/components/layout/UserSidebar';
import { Upload, Camera } from 'lucide-react';

export default function ProfileSettingsPage() {
    const [profileData, setProfileData] = useState({
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        email: 'john.doe@email.com',
        address: '123 Main Street, City',
        gender: 'male',
        avatar: '/avatars/user2.jpg',
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

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

    const handleProfileEdit = () => {
        if (isEditingProfile) {
            setIsEditingProfile(false);
        } else {
            setIsEditingProfile(true);
        }
    };

    const handlePasswordEdit = () => {
        if (isEditingPassword) {
            setIsEditingPassword(false);
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } else {
            setIsEditingPassword(true);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <UserSidebar />
                    </div>

                    <div className="lg:col-span-3">
                        <h1 className="font-heading text-5xl font-medium text-black mb-8">
                            Profile Settings
                        </h1>
                        <div className="bg-white border border-neutral-200 p-8">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-dark-primary mb-8">
                                    Personal Information
                                </h2>

                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-black mb-3">
                                        Profile Picture
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                                                <Image
                                                    src={profileData.avatar}
                                                    alt="Profile"
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {isEditingProfile && (
                                                <label
                                                    htmlFor="avatar-upload"
                                                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full cursor-pointer flex items-center justify-center hover:bg-blue-700 transition-colors"
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
                                                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        Choose Photo
                                                    </label>
                                                    <p className="text-xs text-gray-500">
                                                        JPG, PNG up to 5MB.
                                                        Recommended size:
                                                        400x400px
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-600">
                                                    Click edit to change your
                                                    profile picture
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-3">
                                                Full Name
                                            </label>
                                            {isEditingProfile ? (
                                                <Input
                                                    name="fullName"
                                                    placeholder="Enter your full name"
                                                    value={profileData.fullName}
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full h-12"
                                                />
                                            ) : (
                                                <div className="w-full h-12 px-3 py-2 border border-neutral-300 bg-neutral-50 flex items-center text-neutral-700">
                                                    {profileData.fullName}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-black mb-3">
                                                Phone Number
                                            </label>
                                            {isEditingProfile ? (
                                                <Input
                                                    name="phoneNumber"
                                                    placeholder="Enter your phone number"
                                                    value={
                                                        profileData.phoneNumber
                                                    }
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full h-12"
                                                />
                                            ) : (
                                                <div className="w-full h-12 px-3 py-2 border border-neutral-300 bg-neutral-50 flex items-center text-neutral-700">
                                                    {profileData.phoneNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-3">
                                                Email
                                            </label>
                                            {isEditingProfile ? (
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    value={profileData.email}
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full h-12"
                                                />
                                            ) : (
                                                <div className="w-full h-12 px-3 py-2 border border-neutral-300 bg-neutral-50 flex items-center text-neutral-700">
                                                    {profileData.email}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-black mb-3">
                                                Address
                                            </label>
                                            {isEditingProfile ? (
                                                <Input
                                                    name="address"
                                                    placeholder="Enter your address"
                                                    value={profileData.address}
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full h-12"
                                                />
                                            ) : (
                                                <div className="w-full h-12 px-3 py-2 border border-neutral-300 bg-neutral-50 flex items-center text-neutral-700">
                                                    {profileData.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-black mb-3">
                                            Gender
                                        </label>
                                        {isEditingProfile ? (
                                            <div className="flex gap-8">
                                                <label className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="female"
                                                        checked={
                                                            profileData.gender ===
                                                            'female'
                                                        }
                                                        onChange={
                                                            handleProfileChange
                                                        }
                                                        className="w-4 h-4 text-black border-2 border-neutral-300 focus:ring-0 focus:ring-offset-0"
                                                    />
                                                    <span className="text-sm font-medium">
                                                        Female
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="male"
                                                        checked={
                                                            profileData.gender ===
                                                            'male'
                                                        }
                                                        onChange={
                                                            handleProfileChange
                                                        }
                                                        className="w-4 h-4 text-black border-2 border-neutral-300 focus:ring-0 focus:ring-offset-0"
                                                    />
                                                    <span className="text-sm font-medium">
                                                        Male
                                                    </span>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="w-[409px] h-12 px-3 py-2 border border-neutral-300 bg-neutral-50 flex items-center">
                                                <span className="text-black capitalize">
                                                    {profileData.gender ===
                                                    'male'
                                                        ? 'Male'
                                                        : profileData.gender ===
                                                            'female'
                                                          ? 'Female'
                                                          : 'Not specified'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="button"
                                            onClick={handleProfileEdit}
                                            variant="primary"
                                            className={`px-8 ${
                                                isEditingProfile
                                                    ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                                                    : 'bg-neutral-200 text-black border-neutral-200 hover:bg-neutral-300'
                                            }`}
                                        >
                                            {isEditingProfile ? 'Save' : 'Edit'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="bg-white border border-neutral-200 p-8 mt-10">
                            <div>
                                <h2 className="text-3xl font-bold text-dark-primary mb-8">
                                    Change Password
                                </h2>

                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-3">
                                            Old Password
                                        </label>
                                        <Input
                                            name="oldPassword"
                                            type="password"
                                            placeholder="Enter old password"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full max-w-lg h-12"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-black mb-3">
                                            New Password
                                        </label>
                                        <Input
                                            name="newPassword"
                                            type="password"
                                            placeholder="Enter new password"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full max-w-lg h-12"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-black mb-3">
                                            Confirm Password
                                        </label>
                                        <Input
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full max-w-lg h-12"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-end">
                                        <div className="space-y-2 text-xs text-neutral-600">
                                            <div className="flex items-start gap-2">
                                                <span className="text-black">
                                                    •
                                                </span>
                                                <span>
                                                    Password must be between
                                                    8-50 characters.
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-black">
                                                    •
                                                </span>
                                                <span>
                                                    Password cannot be the same
                                                    as your phone number or
                                                    username.
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-black">
                                                    •
                                                </span>
                                                <span>
                                                    Password must include at
                                                    least one lowercase letter,
                                                    one uppercase letter, and
                                                    one number.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="button"
                                            onClick={handlePasswordEdit}
                                            variant="outline"
                                            className=" bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
