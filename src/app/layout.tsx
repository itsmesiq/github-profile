import './globals.css';

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

const jetBrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Github Profile',
    description: 'GitHub profile and personal widget system.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
            <body>{children}</body>
        </html>
    );
}
