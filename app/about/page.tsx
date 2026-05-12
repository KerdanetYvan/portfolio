import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'À propos — Yvan Kerdanet',
  description: 'Dev fullstack basé à Paris. Parcours, méthodes de travail et centres d\'intérêt.',
};

export default function AboutPage() {
  return <AboutClient />;
}
