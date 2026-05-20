const HIDDEN_TOPICS = ['github-config'];

export type GitHubRepo = {
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
};

async function fetchGitHub<T>(path: string): Promise<T | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
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

export async function getGitHubRepos(options?: { withFavicons?: boolean }): Promise<GitHubRepo[]> {
  const repos = await fetchGitHub<GitHubRepo[]>('/user/repos?type=all&sort=pushed&per_page=100');
  if (!repos) return [];

  const filtered = repos.filter((r) => !r.topics.some((t) => HIDDEN_TOPICS.includes(t)));

  if (!options?.withFavicons) return filtered;

  return Promise.all(
    filtered.map(async (repo) => ({
      ...repo,
      resolvedFavicon: repo.homepage ? await resolveFavicon(repo.homepage) : null,
    }))
  );
}

export type RepoWithMeta<TMeta> = GitHubRepo & { meta: TMeta | null };

export async function getGitHubUser(): Promise<{ login: string } | null> {
  return fetchGitHub<{ login: string }>('/user');
}
