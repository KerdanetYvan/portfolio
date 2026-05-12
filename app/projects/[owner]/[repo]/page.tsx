import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';
import type { Metadata } from 'next';
import {
  RiArrowLeftLine,
  RiGithubFill,
  RiExternalLinkLine,
  RiStarFill,
  RiGitForkLine,
  RiAlertLine,
  RiEyeLine,
  RiScalesLine,
} from 'react-icons/ri';

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

interface RepoDetail {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  pushed_at: string;
  created_at: string;
  topics: string[];
  fork: boolean;
  owner: { login: string; avatar_url: string };
  license: { spdx_id: string; name: string } | null;
  default_branch: string;
}

interface PageProps {
  params: Promise<{ owner: string; repo: string }>;
}

async function fetchGitHub<T>(path: string): Promise<T | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

async function fetchReadme(owner: string, repo: string, branch: string): Promise<string | null> {
  const data = await fetchGitHub<{ content: string; encoding: string }>(
    `/repos/${owner}/${repo}/readme`
  );
  if (!data) return null;
  const raw = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');
  // Rewrite relative image paths to absolute raw GitHub URLs
  return raw.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
    (_, alt, src) =>
      `![${alt}](https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${src})`
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await params;
  const data = await fetchGitHub<RepoDetail>(`/repos/${owner}/${repo}`);
  return {
    title: data ? `${data.name} — Yvan Kerdanet` : 'Projet — Yvan Kerdanet',
    description: data?.description ?? undefined,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function LanguagesBar({ languages }: { languages: Record<string, number> }) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      {/* Barre segmentée */}
      <div className="flex h-2 rounded-full overflow-hidden gap-px">
        {sorted.map(([lang, bytes]) => (
          <div
            key={lang}
            style={{
              width: `${(bytes / total) * 100}%`,
              background: LANG_COLORS[lang] ?? '#8b949e',
            }}
            title={`${lang} ${((bytes / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      {/* Légende */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {sorted.map(([lang, bytes]) => (
          <span key={lang} className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: LANG_COLORS[lang] ?? '#8b949e' }}
              aria-hidden="true"
            />
            <span className="text-on-surface font-medium">{lang}</span>
            <span>{((bytes / total) * 100).toFixed(1)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const mdComponents: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-on-surface mt-8 mb-3 pb-2 border-b border-border">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold text-on-surface mt-6 mb-2 pb-1 border-b border-border">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold text-on-surface mt-4 mb-1">{children}</h3>,
  p:  ({ children }) => <p className="text-muted leading-relaxed my-3">{children}</p>,
  a:  ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{children}</a>,
  ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-muted">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-muted">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => <blockquote className="border-l-4 border-accent-bg pl-4 my-3 text-muted italic">{children}</blockquote>,
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-');
    if (isBlock) {
      return (
        <code className="block bg-surface-elevated rounded-md p-4 my-3 text-xs font-mono text-on-surface overflow-x-auto whitespace-pre">
          {children}
        </code>
      );
    }
    return <code className="bg-surface-elevated rounded px-1.5 py-0.5 text-xs font-mono text-accent">{children}</code>;
  },
  pre: ({ children }) => <>{children}</>,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt ?? ''} className="rounded-md max-w-full my-4 mx-auto" />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="text-left px-3 py-2 border border-border text-on-surface font-semibold bg-surface-elevated">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 border border-border text-muted">{children}</td>,
  hr: () => <hr className="border-border my-6" />,
};

export default async function RepoPage({ params }: PageProps) {
  const { owner, repo } = await params;

  const [repoData, languages] = await Promise.all([
    fetchGitHub<RepoDetail>(`/repos/${owner}/${repo}`),
    fetchGitHub<Record<string, number>>(`/repos/${owner}/${repo}/languages`),
  ]);

  if (!repoData) notFound();

  const readme = await fetchReadme(owner, repo, repoData.default_branch);

  return (
    <main id="main-content" className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-10">

        {/* Retour */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-on-surface transition-colors mb-8"
        >
          <RiArrowLeftLine size={14} aria-hidden="true" />
          Tous les projets
        </Link>

        {/* En-tête */}
        <div className="rounded-lg border bg-surface-raised p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-muted">{owner} /</span>
                <h1 className="text-2xl font-bold text-on-surface">{repoData.name}</h1>
                {repoData.fork && (
                  <span className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded border border-border text-muted bg-surface">
                    <RiGitForkLine size={11} aria-hidden="true" /> fork
                  </span>
                )}
              </div>
              {repoData.description && (
                <p className="text-muted max-w-xl">{repoData.description}</p>
              )}
              {repoData.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {repoData.topics.map((t) => (
                    <span key={t} className="font-mono text-[11px] px-2 py-0.5 rounded border border-border text-muted bg-surface">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={repoData.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-on-surface hover:border-accent-bg hover:text-accent-bg transition-colors"
              >
                <RiGithubFill size={15} aria-hidden="true" />
                GitHub
              </a>
              {repoData.homepage && (
                <a
                  href={repoData.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent-bg text-[#0a0a0a] text-sm font-medium hover:bg-accent-bg-hover transition-colors"
                >
                  <RiExternalLinkLine size={15} aria-hidden="true" />
                  Voir le site
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-border text-sm text-muted">
            {repoData.stargazers_count > 0 && (
              <span className="flex items-center gap-1.5">
                <RiStarFill size={14} aria-hidden="true" />
                {repoData.stargazers_count} étoile{repoData.stargazers_count > 1 ? 's' : ''}
              </span>
            )}
            {repoData.forks_count > 0 && (
              <span className="flex items-center gap-1.5">
                <RiGitForkLine size={14} aria-hidden="true" />
                {repoData.forks_count} fork{repoData.forks_count > 1 ? 's' : ''}
              </span>
            )}
            {repoData.open_issues_count > 0 && (
              <span className="flex items-center gap-1.5">
                <RiAlertLine size={14} aria-hidden="true" />
                {repoData.open_issues_count} issue{repoData.open_issues_count > 1 ? 's' : ''}
              </span>
            )}
            {repoData.watchers_count > 0 && (
              <span className="flex items-center gap-1.5">
                <RiEyeLine size={14} aria-hidden="true" />
                {repoData.watchers_count} watcher{repoData.watchers_count > 1 ? 's' : ''}
              </span>
            )}
            {repoData.license && (
              <span className="flex items-center gap-1.5">
                <RiScalesLine size={14} aria-hidden="true" />
                {repoData.license.spdx_id}
              </span>
            )}
            <span className="ml-auto text-xs">
              Créé le {formatDate(repoData.created_at)} · Dernière mise à jour {formatDate(repoData.pushed_at)}
            </span>
          </div>
        </div>

        {/* Langages */}
        {languages && Object.keys(languages).length > 0 && (
          <div className="rounded-lg border bg-surface-raised p-6 mb-6">
            <p className="font-mono text-xs text-accent-bg mb-4">// langages</p>
            <LanguagesBar languages={languages} />
          </div>
        )}

        {/* README */}
        {readme && (
          <div className="rounded-lg border bg-surface-raised p-6">
            <p className="font-mono text-xs text-accent-bg mb-6">// README</p>
            <div className="prose-custom">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={mdComponents}
              >
                {readme}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
