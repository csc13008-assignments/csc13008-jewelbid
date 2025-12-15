import { ToastType } from '@/modules/shared/components/ui/Toast';

/**
 * Helper function to show toast from anywhere in the app
 * Works by dispatching a custom event that ToastProvider listens to
 */
export const showToast = (
    type: ToastType,
    message: string,
    duration?: number,
) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('show-toast', {
                detail: { type, message, duration },
            }),
        );
    }
};

// Convenience methods
export const toast = {
    success: (message: string, duration?: number) =>
        showToast('success', message, duration),
    error: (message: string, duration?: number) =>
        showToast('error', message, duration),
    warning: (message: string, duration?: number) =>
        showToast('warning', message, duration),
    info: (message: string, duration?: number) =>
        showToast('info', message, duration),
};

export default toast;
