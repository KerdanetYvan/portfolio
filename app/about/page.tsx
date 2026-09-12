import type { Metadata } from 'next';
import AboutClient from './AboutClient';
import { buildMetadata } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'À propos — Yvan Kerdanet',
  description: 'Dev fullstack basé à Paris. Parcours, méthodes de travail et centres d\'intérêt.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutClient />;
}
