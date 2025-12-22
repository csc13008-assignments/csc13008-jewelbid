'use client';

interface StatusBadgeProps {
    status: string;
    type?: 'success' | 'warning' | 'danger' | 'info';
}

const badgeStyles = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function StatusBadge({ status, type }: StatusBadgeProps) {
    // Auto-detect type based on status if not provided
    const badgeType =
        type ||
        (() => {
            const lower = status.toLowerCase();
            // Role-based colors
            if (lower === 'admin') return 'danger'; // Purple/Red for admin
            if (lower === 'seller') return 'info'; // Blue for seller
            if (lower === 'bidder') return 'success'; // Green for bidder
            // Status-based colors
            if (lower.includes('active') || lower.includes('approved'))
                return 'success';
            if (lower.includes('pending')) return 'warning';
            if (lower.includes('cancelled') || lower.includes('rejected'))
                return 'danger';
            return 'info';
        })();

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyles[badgeType]}`}
        >
            {status}
        </span>
    );
}
