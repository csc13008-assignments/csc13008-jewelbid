import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                muted: 'var(--color-muted)',
                surface: 'var(--color-surface)',
                border: 'var(--color-border)',
                background: 'var(--color-background)',
                foreground: 'var(--color-foreground)',
                neutral: {
                    50: 'var(--color-neutral-50)',
                    100: 'var(--color-neutral-100)',
                    200: 'var(--color-neutral-200)',
                    300: 'var(--color-neutral-300)',
                    400: 'var(--color-neutral-400)',
                    500: 'var(--color-neutral-500)',
                    600: 'var(--color-neutral-600)',
                    700: 'var(--color-neutral-700)',
                    800: 'var(--color-neutral-800)',
                    900: 'var(--color-neutral-900)',
                    950: 'var(--color-neutral-950)',
                },
            },
            fontFamily: {
                heading: 'var(--font-heading)',
                body: 'var(--font-body)',
                sans: 'var(--font-body)',
                serif: 'var(--font-heading)',
            },
            fontSize: {
                display: [
                    '3.5rem',
                    { lineHeight: '1.1', letterSpacing: '-0.02em' },
                ],
                h1: [
                    '2.25rem',
                    { lineHeight: '1.2', letterSpacing: '-0.01em' },
                ],
                h2: [
                    '1.875rem',
                    { lineHeight: '1.2', letterSpacing: '-0.01em' },
                ],
                h3: ['1.5rem', { lineHeight: '1.3' }],
                h4: ['1.25rem', { lineHeight: '1.3' }],
                h5: ['1.125rem', { lineHeight: '1.4' }],
                h6: ['1rem', { lineHeight: '1.4' }],
                'body-lg': ['1.125rem', { lineHeight: '1.6' }],
                body: ['1rem', { lineHeight: '1.6' }],
                'body-sm': ['0.875rem', { lineHeight: '1.5' }],
                caption: ['0.75rem', { lineHeight: '1.4' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
        },
    },
    plugins: [],
};

export default config;
