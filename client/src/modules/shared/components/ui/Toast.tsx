'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Provider Component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (type: ToastType, message: string, duration = 4000) => {
            const id = Date.now().toString();
            const newToast: Toast = { id, type, message, duration };

            setToasts((prev) => [...prev, newToast]);

            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast],
    );

    // Listen for custom toast events (for components that can't use hooks directly)
    useEffect(() => {
        const handleShowToast = (
            event: CustomEvent<{
                type: ToastType;
                message: string;
                duration?: number;
            }>,
        ) => {
            showToast(
                event.detail.type,
                event.detail.message,
                event.detail.duration,
            );
        };

        window.addEventListener('show-toast', handleShowToast as EventListener);
        return () => {
            window.removeEventListener(
                'show-toast',
                handleShowToast as EventListener,
            );
        };
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

// Hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Toast styles based on type
const getToastStyles = (type: ToastType) => {
    switch (type) {
        case 'success':
            return {
                container: 'bg-green-50 border-green-500 text-green-800',
                icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                closeBtn: 'hover:bg-green-100 focus:ring-green-400',
            };
        case 'error':
            return {
                container: 'bg-red-50 border-red-500 text-red-800',
                icon: <AlertCircle className="w-5 h-5 text-red-500" />,
                closeBtn: 'hover:bg-red-100 focus:ring-red-400',
            };
        case 'warning':
            return {
                container: 'bg-yellow-50 border-yellow-500 text-yellow-800',
                icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
                closeBtn: 'hover:bg-yellow-100 focus:ring-yellow-400',
            };
        case 'info':
        default:
            return {
                container: 'bg-blue-50 border-blue-500 text-blue-800',
                icon: <Info className="w-5 h-5 text-blue-500" />,
                closeBtn: 'hover:bg-blue-100 focus:ring-blue-400',
            };
    }
};

// Individual Toast Component
const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({
    toast,
    onClose,
}) => {
    const styles = getToastStyles(toast.type);

    return (
        <div
            className={`flex items-center p-4 mb-3 text-sm border-l-4 rounded-lg shadow-lg animate-slide-in ${styles.container}`}
            role="alert"
        >
            <div className="shrink-0">{styles.icon}</div>
            <div className="ms-3 font-medium flex-1">{toast.message}</div>
            <button
                type="button"
                onClick={onClose}
                className={`ms-3 -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 shrink-0 ${styles.closeBtn}`}
                aria-label="Close"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// Toast Container - renders all toasts
const ToastContainer: React.FC = () => {
    const context = useContext(ToastContext);
    if (!context) return null;

    const { toasts, removeToast } = context;

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] w-full max-w-sm">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default ToastProvider;
