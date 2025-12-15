import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'muted';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            children,
            icon,
            ...props
        },
        ref,
    ) => {
        const baseStyles =
            'group inline-flex items-center justify-center gap-2 font-body font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none hover:shadow-lg hover:-translate-y-0.5';

        const variants = {
            primary: 'bg-primary text-white hover:bg-dark-primary',
            outline:
                'border border-dark-primary text-dark-primary bg-white hover:bg-secondary hover:border-dark-primary hover:text-black',
            muted: 'bg-dark-primary text-white hover:bg-[#7D6D5A] hover:text-white',
        };

        const sizes = {
            sm: 'px-2 py-1 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-base',
        };

        return (
            <button
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className,
                )}
                ref={ref}
                {...props}
            >
                {children}
                {icon && <span className="ml-1">{icon}</span>}
            </button>
        );
    },
);

Button.displayName = 'Button';

export default Button;
