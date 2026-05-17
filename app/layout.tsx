import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { Analytics } from './components/Analytics';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

import { Providers } from './providers';
import ConditionalNav from './ConditionalNav';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kerdanet Yvan',
  description: 'Coded by Yvan Kerdanet',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get('theme')?.value;
  const themeClass =
    savedTheme === 'dark' ? 'dark' : savedTheme === 'light' ? 'light' : '';

  return (
    <html lang="fr" className={themeClass} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-accent focus:text-white focus:font-medium"
          >
            Aller au contenu principal
          </a>
          <ConditionalNav>{children}</ConditionalNav>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
