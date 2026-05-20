'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  RiGithubFill,
  RiExternalLinkLine,
  RiStarFill,
  RiGitRepositoryLine,
  RiGitForkLine,
} from 'react-icons/ri';
import type { GitHubRepo } from '@/lib/github/repos';

const LANG_COLORS: Record<string, string> = {
  TypeScript:  '#3178c6',
  JavaScript:  '#f1e05a',
  Python:      '#3572a5',
  PHP:         '#4f5d95',
  CSS:         '#563d7c',
  HTML:        '#e34c26',
  Rust:        '#dea584',
  Go:          '#00add8',
  Java:        '#b07219',
  'C#':        '#178600',
  'C++':       '#f34b7d',
  C:           '#555555',
  Ruby:        '#701516',
  Shell:       '#89e051',
  Vue:         '#41b883',
  Kotlin:      '#a97bff',
  Swift:       '#f05138',
  Dart:        '#00b4ab',
  SCSS:        '#c6538c',
};

function formatPushed(iso: string): string {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (diffDays === 0) return "aujourd'hui";
  if (diffDays === 1) return 'hier';
  if (diffDays < 30)  return `il y a ${diffDays} j`;
  if (diffDays < 365) return `il y a ${Math.floor(diffDays / 30)} mois`;
  const y = Math.floor(diffDays / 365);
  return `il y a ${y} an${y > 1 ? 's' : ''}`;
}

interface ProjectsClientProps {
  repos: GitHubRepo[];
  userLogin: string;
  initialLang?: string | null;
}

export default function ProjectsClient({ repos, userLogin, initialLang }: ProjectsClientProps) {
  const [selectedLang, setSelectedLang] = useState<string | null>(initialLang ?? null);
  const [showForks, setShowForks] = useState(false);

  const languages = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);
  }, [repos]);

  const filtered = useMemo(() =>
    repos
      .filter((r) => showForks || !r.fork)
      .filter((r) => !selectedLang || r.language === selectedLang),
    [repos, showForks, selectedLang]
  );

  if (repos.length === 0) {
    return (
      <div className="rounded-lg border bg-surface-raised p-10 text-center">
        <RiGithubFill size={32} className="mx-auto mb-3 text-muted" aria-hidden="true" />
        <p className="text-muted">Impossible de charger les dépôts GitHub.</p>
        <p className="font-mono text-xs text-muted mt-1">token manquant ou expiré</p>
      </div>
    );
  }

  return (
    <>
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setSelectedLang(null)}
          className={`font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
            selectedLang === null
              ? 'bg-accent-bg text-[#0a0a0a] border-accent-bg'
              : 'border-border text-muted hover:border-accent-bg hover:text-on-surface'
          }`}
        >
          Tous
        </button>

        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang === selectedLang ? null : lang)}
            className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
              selectedLang === lang
                ? 'bg-accent-bg text-[#0a0a0a] border-accent-bg'
                : 'border-border text-muted hover:border-accent-bg hover:text-on-surface'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: LANG_COLORS[lang] ?? '#8b949e' }}
              aria-hidden="true"
            />
            {lang}
          </button>
        ))}

        <button
          onClick={() => setShowForks((v) => !v)}
          className={`ml-auto flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
            showForks
              ? 'bg-accent-bg text-[#0a0a0a] border-accent-bg'
              : 'border-border text-muted hover:border-accent-bg hover:text-on-surface'
          }`}
        >
          <RiGitForkLine size={12} aria-hidden="true" />
          Forks
        </button>
      </div>

      <p className="font-mono text-xs text-muted mb-4">
        {filtered.length} dépôt{filtered.length > 1 ? 's' : ''}
      </p>

      {/* Grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((repo) => (
          <RepoCard key={repo.id} repo={repo} userLogin={userLogin} />
        ))}
      </div>
    </>
  );
}

function RepoIcon({ favicon }: { favicon?: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!favicon || failed) {
    return <RiGitRepositoryLine size={15} className="text-muted shrink-0" aria-hidden="true" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={favicon}
      alt=""
      width={16}
      height={16}
      className="shrink-0 rounded-sm"
      onError={() => setFailed(true)}
      aria-hidden="true"
    />
  );
}

function RepoCard({ repo, userLogin }: { repo: GitHubRepo; userLogin: string }) {
  const isContrib = repo.owner.login !== userLogin;

  return (
    <div className="card-hover group relative flex flex-col gap-3 rounded-lg border bg-surface-raised p-5">
      {/* Lien principal — couvre toute la carte */}
      <Link
        href={`/projects/${repo.owner.login}/${repo.name}`}
        className="absolute inset-0 rounded-lg"
        aria-label={`Voir les détails de ${repo.name}`}
      />

      {/* En-tête */}
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <RepoIcon favicon={repo.resolvedFavicon} />
          <span className="font-semibold text-sm text-on-surface group-hover:text-accent transition-colors leading-tight truncate">
            {repo.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-surface ${
            isContrib ? 'text-pop-blue' : 'text-accent'
          }`}>
            {repo.owner.login}
          </span>
          {repo.fork && <RiGitForkLine size={12} className="text-muted" aria-label="Fork" />}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 text-muted hover:text-on-surface transition-colors"
            aria-label={`Ouvrir ${repo.name} sur GitHub`}
            onClick={(e) => e.stopPropagation()}
          >
            <RiGithubFill size={14} />
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 text-sm text-muted leading-relaxed line-clamp-2 flex-1">
        {repo.description ?? 'Pas de description'}
      </p>

      {/* Tags */}
      {(repo.language || repo.topics.length > 0) && (
        <div className="relative z-10 flex flex-wrap gap-1.5">
          {repo.language && (
            <span className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded border border-border text-muted bg-surface">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: LANG_COLORS[repo.language] ?? '#8b949e' }}
                aria-hidden="true"
              />
              {repo.language}
            </span>
          )}
          {repo.topics.slice(0, 3).map((t) => (
            <span key={t} className="font-mono text-[11px] px-2 py-0.5 rounded border border-border text-muted bg-surface">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Pied de carte */}
      <div className="relative z-10 flex items-center gap-3 pt-1 border-t border-border text-xs text-muted">
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <RiStarFill size={11} aria-hidden="true" />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <RiGitForkLine size={11} aria-hidden="true" />
            {repo.forks_count}
          </span>
        )}
        <span className="ml-auto text-[11px]">{formatPushed(repo.pushed_at)}</span>
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 hover:text-on-surface transition-colors"
            aria-label={`Voir le site de ${repo.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <RiExternalLinkLine size={13} />
          </a>
        )}
      </div>
    </div>
  );
}
