import { Suspense } from 'react';
import type { Metadata } from 'next';
import Hero from './components/home/Hero';
import StatusBar from './components/home/StatusBar';
import FeaturedProjects from './components/home/FeaturedProjects';
import TechStack from './components/home/TechStack';
import ContactCTA from './components/home/ContactCTA';
import CommandPalette from './components/home/CommandPalette';

export const metadata: Metadata = {
  title: 'Yvan Kerdanet — Concepteur Développeur Digital',
  description:
    'Portfolio de Yvan Kerdanet — développeur fullstack, spécialiste n8n, conception 3D. Disponible en alternance septembre 2025.',
};

export default function Home() {
  return (
    <>
      <CommandPalette />

      <Hero />

      <Suspense fallback={<div className="h-10 border-y bg-surface-raised animate-pulse" />}>
        <StatusBar />
      </Suspense>

      <FeaturedProjects />

      <TechStack />

      <ContactCTA />
    </>
  );
}
