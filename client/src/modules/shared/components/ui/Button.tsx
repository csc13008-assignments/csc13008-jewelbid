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
            'inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary: 'bg-primary text-black hover:bg-dark-primary',
            outline:
                'border border-dark-primary text-dark-primary bg-white hover:bg-secondary hover:border-dark-primary hover:text-black',
            muted: 'bg-dark-primary text-white hover:bg-[#7D6D5A] hover:text-white',
        };

        const sizes = {
            sm: 'h-7 py-2 px-2 text-sm',
            md: 'h-9 py-3 px-3 text-base',
            lg: 'h-11 py-4 px-4 text-base',
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
