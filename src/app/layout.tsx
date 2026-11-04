import './globals.css';

import type { Metadata } from 'next';
import { Lexend, Outfit } from 'next/font/google';

const outfit = Outfit({
    variable: '--font-outfit',
    subsets: ['latin'],
});

const lexend = Lexend({
    variable: '--font-lexend',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Github Profile',
    description: 'GitHub profile and personal widget system.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={`${outfit.variable} ${lexend.variable}`}>
            <body>{children}</body>
        </html>
    );
}
