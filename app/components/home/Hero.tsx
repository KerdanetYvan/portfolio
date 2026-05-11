'use client';
import Link from 'next/link';
import { Suspense, lazy } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';

const Die = lazy(() => import('./Die'));

function DieSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <div className="border border-[#00D26A]/40 w-32 h-32 rotate-45 animate-pulse" />
    </div>
  );
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto max-w-[1200px] px-4 min-h-[calc(100vh-57px)] flex items-center"
    >
      {/* Dot grid background */}
      <div
        className="bg-dot-grid absolute inset-0 opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">

        {/* Left: text */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-mono text-xs text-accent-bg mb-3 tracking-wider">
              &gt; Yvan Kerdanet
            </p>
            <h1
              id="hero-title"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface leading-[1.1] tracking-tight"
            >
              Concepteur
              <br />
              développeur
              <br />
              <span className="text-accent-bg">digital.</span>
            </h1>
          </div>

          <p className="text-muted text-base md:text-lg leading-relaxed max-w-sm">
            Bachelor CDSD · Digital Campus Paris
            <br />
            Disponible en alternance — Nov. 2025
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent-bg text-[#0a0a0a] font-medium hover:bg-accent-bg-hover transition-colors"
            >
              Voir les projets
              <RiArrowRightLine size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-on-surface hover:border-accent-bg hover:text-accent-bg transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Right: D4 die */}
        <div className="h-[380px] md:h-[460px] w-full" aria-label="Dé tétraédrique interactif">
          <Suspense fallback={<DieSkeleton />}>
            <Die />
          </Suspense>
        </div>

      </div>
    </section>
  );
}
