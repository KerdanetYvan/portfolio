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
  RiCalendarLine,
} from 'react-icons/ri';
import projects from '../../../public/projets.json';

interface FeaturedProject {
  id: number;
  name: string;
  url: string;
  description: string;
  tech: string[];
  status: string;
  date: string;
  fonctionnalites?: string[];
  defis?: string[];
  evolution?: string[];
  images?: string[];
  site?: string;
  github?: string;
}

interface RepoDetail {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  default_branch: string;
  language: string | null;
}

interface PageProps {
  params: Promise<{ url: string }>;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572a5',
  PHP: '#4f5d95', CSS: '#563d7c', HTML: '#e34c26', Rust: '#dea584',
  Go: '#00add8', Java: '#b07219', 'C#': '#178600', 'C++': '#f34b7d',
  C: '#555555', Ruby: '#701516', Shell: '#89e051', Vue: '#41b883',
  SCSS: '#c6538c',
};

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
  'En cours':  { dot: 'bg-accent-bg',  text: 'text-accent-bg'  },
  'Terminé':   { dot: 'bg-muted',      text: 'text-muted'      },
  'En pause':  { dot: 'bg-pop-orange', text: 'text-pop-orange' },
  'Erreur':    { dot: 'bg-[#da3633]',  text: 'text-[#da3633]'  },
  'Abandonné': { dot: 'bg-muted',      text: 'text-muted'      },
};

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

function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

async function fetchReadme(owner: string, repo: string, branch: string): Promise<string | null> {
  const data = await fetchGitHub<{ content: string }>(`/repos/${owner}/${repo}/readme`);
  if (!data?.content) return null;
  const raw = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');
  return raw.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
    (_, alt, src) =>
      `![${alt}](https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${src})`
  );
}

function LanguagesBar({ languages }: { languages: Record<string, number> }) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  return (
    <div className="space-y-3">
      <div className="flex h-2 rounded-full overflow-hidden gap-px">
        {sorted.map(([lang, bytes]) => (
          <div
            key={lang}
            style={{ width: `${(bytes / total) * 100}%`, background: LANG_COLORS[lang] ?? '#8b949e' }}
            title={`${lang} ${((bytes / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
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
    if (className?.startsWith('language-')) {
      return <code className="block bg-surface-elevated rounded-md p-4 my-3 text-xs font-mono text-on-surface overflow-x-auto whitespace-pre">{children}</code>;
    }
    return <code className="bg-surface-elevated rounded px-1.5 py-0.5 text-xs font-mono text-accent">{children}</code>;
  },
  pre: ({ children }) => <>{children}</>,
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src, alt }) => <img src={src} alt={alt ?? ''} className="rounded-md max-w-full my-4 mx-auto" />,
  table: ({ children }) => <div className="overflow-x-auto my-4"><table className="w-full text-sm border-collapse">{children}</table></div>,
  th: ({ children }) => <th className="text-left px-3 py-2 border border-border text-on-surface font-semibold bg-surface-elevated">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 border border-border text-muted">{children}</td>,
  hr: () => <hr className="border-border my-6" />,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { url } = await params;
  const project = (projects as FeaturedProject[]).find((p) => p.url === url);
  if (!project) return { title: 'Projet — Yvan Kerdanet' };
  return {
    title: `${project.name} — Yvan Kerdanet`,
    description: project.description,
  };
}

export default async function FeaturedProjectPage({ params }: PageProps) {
  const { url } = await params;
  const project = (projects as FeaturedProject[]).find((p) => p.url === url);
  if (!project) notFound();

  const parsed = project.github ? parseGithubUrl(project.github) : null;
  const [repoData, languages] = parsed
    ? await Promise.all([
        fetchGitHub<RepoDetail>(`/repos/${parsed.owner}/${parsed.repo}`),
        fetchGitHub<Record<string, number>>(`/repos/${parsed.owner}/${parsed.repo}/languages`),
      ])
    : [null, null];

  const readme = repoData && parsed
    ? await fetchReadme(parsed.owner, parsed.repo, repoData.default_branch)
    : null;

  const status = STATUS_STYLES[project.status];
  const formattedDate = new Date(project.date).toLocaleDateString('fr-FR', {
    month: 'long', year: 'numeric',
  });
  const lastPushed = repoData
    ? new Date(repoData.pushed_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : null;

  return (
    <main id="main-content" className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-10">

        {/* Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-on-surface transition-colors mb-8"
        >
          <RiArrowLeftLine size={14} aria-hidden="true" />
          Retour
        </Link>

        {/* En-tête */}
        <div className="rounded-lg border bg-surface-raised p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-on-surface">{project.name}</h1>
                {status && (
                  <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded border border-border bg-surface ${status.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${project.status === 'En cours' ? 'animate-pulse' : ''}`} aria-hidden="true" />
                    {project.status}
                  </span>
                )}
              </div>

              <p className="text-muted max-w-xl leading-relaxed">{project.description}</p>

              {/* Stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="font-mono text-[11px] px-2 py-0.5 rounded border border-border text-muted bg-surface">
                    {t}
                  </span>
                ))}
              </div>

              {/* Date + activité */}
              <div className="flex items-center gap-4 font-mono text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <RiCalendarLine size={12} aria-hidden="true" />
                  {formattedDate}
                </span>
                {lastPushed && (
                  <span>· dernier push {lastPushed}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-on-surface hover:border-accent-bg hover:text-accent-bg transition-colors"
                >
                  <RiGithubFill size={15} aria-hidden="true" />
                  GitHub
                </a>
              )}
              {project.site && (
                <a
                  href={project.site}
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

          {/* Stats GitHub live */}
          {repoData && (repoData.stargazers_count > 0 || repoData.forks_count > 0) && (
            <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-border text-sm text-muted">
              {repoData.stargazers_count > 0 && (
                <span className="flex items-center gap-1.5">
                  <RiStarFill size={13} aria-hidden="true" />
                  {repoData.stargazers_count} étoile{repoData.stargazers_count > 1 ? 's' : ''}
                </span>
              )}
              {repoData.forks_count > 0 && (
                <span className="flex items-center gap-1.5">
                  <RiGitForkLine size={13} aria-hidden="true" />
                  {repoData.forks_count} fork{repoData.forks_count > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Langages */}
        {languages && Object.keys(languages).length > 0 && (
          <div className="rounded-lg border bg-surface-raised p-6 mb-6">
            <p className="font-mono text-xs text-accent-bg mb-4">// langages</p>
            <LanguagesBar languages={languages} />
          </div>
        )}

        {/* Fonctionnalités + Défis */}
        {(project.fonctionnalites || project.defis) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {project.fonctionnalites && (
              <div className="rounded-lg border bg-surface-raised p-6">
                <p className="font-mono text-xs text-accent-bg mb-4">// fonctionnalités</p>
                <ul className="space-y-2">
                  {project.fonctionnalites.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-accent-bg mt-0.5 shrink-0" aria-hidden="true">→</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.defis && (
              <div className="rounded-lg border bg-surface-raised p-6">
                <p className="font-mono text-xs text-pop-orange mb-4">// défis</p>
                <ul className="space-y-2">
                  {project.defis.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-pop-orange mt-0.5 shrink-0" aria-hidden="true">→</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Images */}
        {/* {project.images && project.images.length > 0 && (
          <div className="rounded-lg border bg-surface-raised p-6 mb-6">
            <p className="font-mono text-xs text-accent-bg mb-4">// aperçu</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.images.map((image, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={`/projects/${project.url}/${image}`}
                  alt={`Aperçu ${i + 1} — ${project.name}`}
                  className="rounded-md w-full object-cover border border-border"
                />
              ))}
            </div>
          </div>
        )} */}

        {/* Axes d'amélioration */}
        {project.evolution && project.evolution.length > 0 && (
          <div className="rounded-lg border bg-surface-raised p-6 mb-6">
            <p className="font-mono text-xs text-pop-blue mb-4">// axes d&apos;amélioration</p>
            <ul className="space-y-2">
              {project.evolution.map((axe, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-pop-blue mt-0.5 shrink-0" aria-hidden="true">→</span>
                  {axe}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* README GitHub */}
        {readme && (
          <div className="rounded-lg border bg-surface-raised p-6">
            <p className="font-mono text-xs text-accent-bg mb-6">// README</p>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={mdComponents}
            >
              {readme}
            </ReactMarkdown>
          </div>
        )}

      </div>
    </main>
  );
}
