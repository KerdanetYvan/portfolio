import ProjectsClient from './ProjectsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets — Yvan Kerdanet',
  description: 'Repos publics GitHub — projets personnels et contributions.',
};

const HIDDEN_TOPICS = ['github-config'];

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  topics: string[];
  fork: boolean;
  owner: { login: string };
  resolvedFavicon?: string | null;
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

async function resolveFavicon(homepage: string): Promise<string | null> {
  try {
    const origin = new URL(homepage).origin;
    const res = await fetch(homepage, {
      headers: { Accept: 'text/html', 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const match =
      html.match(/<link[^>]+rel="[^"]*icon[^"]*"[^>]+href="([^"]+)"/i) ||
      html.match(/<link[^>]+href="([^"]+)"[^>]+rel="[^"]*icon[^"]*"/i) ||
      html.match(/<link[^>]+rel='[^']*icon[^']*'[^>]+href='([^']+)'/i) ||
      html.match(/<link[^>]+href='([^']+)'[^>]+rel='[^']*icon[^']*'/i);

    if (match?.[1]) {
      const href = match[1];
      if (href.startsWith('http')) return href;
      if (href.startsWith('//')) return `https:${href}`;
      return `${origin}${href.startsWith('/') ? '' : '/'}${href}`;
    }

    return `${origin}/favicon.ico`;
  } catch {
    return null;
  }
}

export default async function ProjectsPage() {
  const [repos, user] = await Promise.all([
    fetchGitHub<GitHubRepo[]>('/user/repos?type=all&sort=pushed&per_page=100'),
    fetchGitHub<{ login: string }>('/user'),
  ]);

  const repoList = (repos ?? []).filter(
    (r) => !r.topics.some((t) => HIDDEN_TOPICS.includes(t))
  );

  const reposWithFavicons = await Promise.all(
    repoList.map(async (repo) => ({
      ...repo,
      resolvedFavicon: repo.homepage ? await resolveFavicon(repo.homepage) : null,
    }))
  );

  return (
    <main id="main-content" className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="mb-10">
          <p className="font-mono text-xs text-accent-bg mb-2">// projets</p>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-3">
            Mes Projets
          </h1>
          <p className="text-muted max-w-xl">
            Repos publics GitHub — projets personnels et contributions. Mis à jour toutes les heures.
          </p>
        </div>

        <ProjectsClient repos={reposWithFavicons} userLogin={user?.login ?? ''} />
      </div>
    </main>
  );
}
