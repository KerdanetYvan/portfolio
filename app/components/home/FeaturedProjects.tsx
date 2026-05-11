import Link from 'next/link';
import { RiGithubFill, RiExternalLinkLine, RiArrowRightLine } from 'react-icons/ri';
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
  'En cours': 'text-accent-bg',
  'Terminé':  'text-muted',
  'En pause': 'text-yellow-500',
  'Erreur':   'text-red-500',
};

export default function FeaturedProjects() {
  const featured = (projects as Project[]).slice(0, 3);

  return (
    <section aria-labelledby="projects-title" className="mx-auto max-w-[1200px] px-4 py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-accent-bg mb-1">// projets</p>
          <h2 id="projects-title" className="text-2xl font-bold text-on-surface">
            Projets phares
          </h2>
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-1 text-sm text-muted hover:text-on-surface transition-colors"
        >
          Voir tout <RiArrowRightLine size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((project) => (
          <Link
            key={project.id}
            href={`/portfolio/${project.url}`}
            className="card-hover group flex flex-col gap-3 rounded-lg border bg-surface-raised p-5"
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

            <div className="flex items-center gap-3 pt-1 border-t">
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
