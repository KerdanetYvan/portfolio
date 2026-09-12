import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { Analytics } from './components/Analytics';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

import { Providers } from './providers';
import ConditionalNav from './ConditionalNav';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const TITLE = 'Yvan Kerdanet — Concepteur Développeur Digital';
const DESCRIPTION = 'Portfolio de Yvan Kerdanet, développeur fullstack freelance basé à Paris — projets, articles techniques et contact.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/Yvan_portrait.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/Yvan_portrait.webp'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/Yvan_portrait.webp`,
  jobTitle: 'Développeur fullstack freelance',
  email: 'mailto:kerdanety@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
  sameAs: ['https://github.com/KerdanetYvan', 'https://linkedin.com/in/yvankerdanet'],
  knowsAbout: ['Développement web fullstack', 'Next.js', 'n8n', 'Conception 3D'],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get('theme')?.value;
  const themeClass =
    savedTheme === 'dark' ? 'dark' : savedTheme === 'light' ? 'light' : '';

  return (
    <html lang="fr" className={themeClass} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
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
