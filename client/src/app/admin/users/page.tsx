'use client';

import { useState, useEffect } from 'react';
import { Users, UserCog, Check, X, Loader2 } from 'lucide-react';
import toast from '@/lib/toast';
import Image from 'next/image';
import DataTable from '@/modules/admin/components/DataTable';
import ConfirmDialog from '@/modules/admin/components/ConfirmDialog';
import StatusBadge from '@/modules/admin/components/StatusBadge';
import { adminApi, type AdminUser, type UpgradeRequest } from '@/lib/api/admin';

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'users' | 'upgrades'>('users');
    const [roleFilter, setRoleFilter] = useState<
        'All' | 'Bidder' | 'Seller' | 'Admin'
    >('All');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [selectedRequest, setSelectedRequest] =
        useState<UpgradeRequest | null>(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState<
        'approve' | 'reject' | null
    >(null);

    useEffect(() => {
        void fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersResponse, requestsResponse] = await Promise.all([
                adminApi.getUsers(),
                adminApi.getUpgradeRequests(),
            ]);
            // Handle response - may be array or object with data property
            const usersData = Array.isArray(usersResponse)
                ? usersResponse
                : (usersResponse as any).data || [];
            const requestsData = Array.isArray(requestsResponse)
                ? requestsResponse
                : (requestsResponse as any).data || [];

            console.log('🔍 Upgrade Requests Response:', requestsResponse);
            console.log('🔍 Mapped Requests Data:', requestsData);

            setUsers(usersData);
            setUpgradeRequests(requestsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers =
        roleFilter === 'All'
            ? users
            : users.filter((u) => u.role === roleFilter);
    const pendingRequests = upgradeRequests.filter(
        (r) => r.status === 'Pending',
    );

    const userColumns = [
        {
            key: 'profileImage',
            label: 'Avatar',
            render: (_: unknown, user: AdminUser) => (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200">
                    <Image
                        src={user.profileImage || '/avatars/default.jpg'}
                        alt={user.fullname}
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                </div>
            ),
        },
        { key: 'fullname', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Role',
            render: (value: string) => <StatusBadge status={value} />,
        },
        {
            key: 'ratings',
            label: 'Rating',
            render: (_: unknown, user: AdminUser) => (
                <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">
                        +{user.positiveRatings}
                    </span>
                    <span className="text-neutral-400">/</span>
                    <span className="text-red-600 font-medium">
                        -{user.negativeRatings}
                    </span>
                </div>
            ),
        },
        {
            key: 'created_at',
            label: 'Joined',
            render: (value: string) =>
                new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: unknown, user: AdminUser) => (
                <button
                    onClick={() => void handleChangeRole(user)}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={`Change to ${user.role === 'Seller' ? 'Bidder' : 'Seller'}`}
                >
                    → {user.role === 'Seller' ? 'Bidder' : 'Seller'}
                </button>
            ),
        },
    ];

    const requestColumns = [
        {
            key: 'user',
            label: 'User',
            render: (_: unknown, request: UpgradeRequest) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200">
                        <Image
                            src={
                                request.user.profileImage ||
                                '/avatars/default.jpg'
                            }
                            alt={request.user.fullname}
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-medium text-neutral-900">
                            {request.user.fullname}
                        </p>
                        <p className="text-xs text-neutral-500">
                            {request.user.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'createdAt',
            label: 'Request Date',
            render: (value: string) =>
                new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => <StatusBadge status={value} />,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: unknown, request: UpgradeRequest) => (
                <div className="flex items-center gap-2">
                    {request.status === 'Pending' && (
                        <>
                            <button
                                onClick={() => handleApprove(request)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleReject(request)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => {
                            setSelectedRequest(request);
                            setShowRequestModal(true);
                        }}
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        View Details
                    </button>
                </div>
            ),
        },
    ];

    const handleView = (user: AdminUser) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    const handleChangeRole = async (user: AdminUser) => {
        const newRole = user.role === 'Seller' ? 'Bidder' : 'Seller';
        const confirmed = window.confirm(
            `Change ${user.fullname}'s role from ${user.role} to ${newRole}?`,
        );
        if (!confirmed) return;

        try {
            setSubmitting(true);
            await adminApi.updateUserRole(user.id, newRole);
            toast.success(`User role updated to ${newRole}`);
            await fetchData();
        } catch (error: unknown) {
            console.error('Failed to update role:', error);
            toast.error(
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Failed to update role',
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleApprove = (request: UpgradeRequest) => {
        setSelectedRequest(request);
        setConfirmAction('approve');
        setShowConfirmDialog(true);
    };

    const handleReject = (request: UpgradeRequest) => {
        setSelectedRequest(request);
        setConfirmAction('reject');
        setShowConfirmDialog(true);
    };

    const confirmUpgradeAction = async () => {
        if (!selectedRequest || !confirmAction) return;

        try {
            setSubmitting(true);
            if (confirmAction === 'approve') {
                await adminApi.approveUpgradeRequest(selectedRequest.id);
                toast.success('Upgrade request approved!');
            } else {
                await adminApi.rejectUpgradeRequest(selectedRequest.id);
                toast.success('Upgrade request rejected!');
            }
            setShowConfirmDialog(false);
            setSelectedRequest(null);
            setConfirmAction(null);
            await fetchData();
        } catch (error: unknown) {
            console.error('Error processing upgrade request:', error);
            toast.error(
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Failed to process request',
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-primary p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-dark-primary mx-auto mb-4" />
                    <p className="text-neutral-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-primary p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-primary gap-4">
                <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-dark-primary rounded-full"></div>
                    <h1 className="font-heading text-3xl font-semibold text-neutral-900 flex items-center gap-3">
                        User Management
                        <Users className="w-7 h-7 text-dark-primary" />
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Manage users and approval requests
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-neutral-100 p-1.5 rounded-xl w-fit border border-neutral-200">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                        activeTab === 'users'
                            ? 'bg-white text-black shadow-sm border border-primary/20'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                    }`}
                >
                    <Users className="w-4 h-4" />
                    All Users
                    <span
                        className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'users' ? 'bg-primary/30 text-dark-primary' : 'bg-neutral-200 text-neutral-600'}`}
                    >
                        {users.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('upgrades')}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                        activeTab === 'upgrades'
                            ? 'bg-white text-black shadow-sm border border-primary/20'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                    }`}
                >
                    <UserCog className="w-4 h-4" />
                    Upgrade Requests
                    {pendingRequests.length > 0 && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                            {pendingRequests.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <>
                    {/* Role Filter */}
                    <div className="flex gap-2 mb-4">
                        {(['All', 'Bidder', 'Seller', 'Admin'] as const).map(
                            (role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        roleFilter === role
                                            ? 'bg-dark-primary text-white'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                                >
                                    {role}
                                </button>
                            ),
                        )}
                    </div>

                    <DataTable
                        columns={userColumns}
                        data={filteredUsers}
                        onView={handleView}
                        searchable
                        emptyMessage={`No ${roleFilter.toLowerCase()} users found`}
                    />
                </>
            )}

            {/* Upgrade Requests Tab */}
            {activeTab === 'upgrades' && (
                <DataTable
                    columns={requestColumns}
                    data={upgradeRequests}
                    searchable
                    emptyMessage="No upgrade requests"
                />
            )}

            {/* User Detail Modal */}
            {showDetailModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-lg w-full mx-4 rounded-2xl shadow-xl border border-primary">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                            User Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dark-primary">
                                    <Image
                                        src={
                                            selectedUser.profileImage ||
                                            '/avatars/default.jpg'
                                        }
                                        alt={selectedUser.fullname}
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-neutral-900">
                                        {selectedUser.fullname}
                                    </h4>
                                    <p className="text-neutral-500">
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        Role
                                    </label>
                                    <div className="mt-1">
                                        <StatusBadge
                                            status={selectedUser.role}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        Joined
                                    </label>
                                    <p className="text-lg font-semibold text-neutral-900">
                                        {new Date(
                                            selectedUser.created_at,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        Positive Ratings
                                    </label>
                                    <p className="text-2xl font-bold text-green-600">
                                        +{selectedUser.positiveRatings}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-500">
                                        Negative Ratings
                                    </label>
                                    <p className="text-2xl font-bold text-red-600">
                                        -{selectedUser.negativeRatings}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 border border-primary rounded-xl hover:bg-primary transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Detail Modal */}
            {showRequestModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-lg w-full mx-4 rounded-2xl shadow-xl border border-primary">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                            Upgrade Request Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-dark-primary">
                                    <Image
                                        src={
                                            selectedRequest.user.profileImage ||
                                            '/avatars/default.jpg'
                                        }
                                        alt={selectedRequest.user.fullname}
                                        width={64}
                                        height={64}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-neutral-900">
                                        {selectedRequest.user.fullname}
                                    </h4>
                                    <p className="text-neutral-500 text-sm">
                                        {selectedRequest.user.email}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-500">
                                    Request Date
                                </label>
                                <p className="text-lg font-semibold text-neutral-900">
                                    {new Date(
                                        selectedRequest.createdAt,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-500">
                                    Status
                                </label>
                                <div className="mt-1">
                                    <StatusBadge
                                        status={selectedRequest.status}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowRequestModal(false);
                                    setSelectedRequest(null);
                                }}
                                className="px-4 py-2 border border-primary rounded-xl hover:bg-primary transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={showConfirmDialog}
                title={
                    confirmAction === 'approve'
                        ? 'Approve Upgrade Request?'
                        : 'Reject Upgrade Request?'
                }
                message={`Are you sure you want to ${confirmAction} the upgrade request from "${selectedRequest?.user.fullname}"?`}
                onConfirm={() => void confirmUpgradeAction()}
                onCancel={() => {
                    setShowConfirmDialog(false);
                    setSelectedRequest(null);
                    setConfirmAction(null);
                }}
                type={confirmAction === 'approve' ? 'info' : 'warning'}
                confirmText={
                    submitting
                        ? confirmAction === 'approve'
                            ? 'Approving...'
                            : 'Rejecting...'
                        : confirmAction === 'approve'
                          ? 'Approve'
                          : 'Reject'
                }
            />
        </div>
    );
}
