'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RiGithubFill, RiExternalLinkLine, RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import projects from '../../../public/projets.json';

interface Project {
  id: number;
  name: string;
  url: string;
  description: string;
  tech: string[];
  status: string;
  site?: string;
  github?: string;
}

const STATUS_COLORS: Record<string, string> = {
  'En cours':  'text-accent-bg',
  'Terminé':   'text-muted',
  'En pause':  'text-pop-orange',
  'Abandonné': 'text-muted',
  'Erreur':    'text-[#da3633]',
};

export default function FeaturedProjects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateButtons();
  }, [updateButtons]);

  function scroll(dir: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <section aria-labelledby="projects-title" className="mx-auto max-w-[1200px] px-4 py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-accent-bg mb-1">// projets</p>
          <h2 id="projects-title" className="text-2xl font-bold text-on-surface">
            Projets phares
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            disabled={!canPrev}
            className="p-2 rounded-md border border-border text-muted hover:text-on-surface hover:border-accent-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Projets précédents"
          >
            <RiArrowLeftLine size={14} aria-hidden="true" />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canNext}
            className="p-2 rounded-md border border-border text-muted hover:text-on-surface hover:border-accent-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Projets suivants"
          >
            <RiArrowRightLine size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateButtons}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {(projects as Project[]).map((project) => (
          <Link
            key={project.id}
            href={`/portfolio/${project.url}`}
            className="card-hover group snap-start shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc((100%-32px)/3)] flex flex-col gap-3 rounded-lg border bg-surface-raised p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-on-surface group-hover:text-accent transition-colors leading-tight">
                {project.name}
              </h3>
              <span className={`font-mono text-xs shrink-0 mt-0.5 ${STATUS_COLORS[project.status] ?? 'text-muted'}`}>
                {project.status}
              </span>
            </div>

            <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto">
              {project.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="font-mono text-[11px] px-2 py-0.5 rounded border border-border text-muted bg-surface"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1 border-t border-border">
              {project.github && (
                <span className="flex items-center gap-1 text-xs text-muted">
                  <RiGithubFill size={12} aria-hidden="true" /> GitHub
                </span>
              )}
              {project.site && (
                <span className="flex items-center gap-1 text-xs text-muted">
                  <RiExternalLinkLine size={12} aria-hidden="true" /> Live
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
