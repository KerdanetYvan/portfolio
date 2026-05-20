import ProjectsClient from './ProjectsClient';
import type { Metadata } from 'next';
import { getGitHubRepos, getGitHubUser } from '@/lib/github/repos';

export { type GitHubRepo } from '@/lib/github/repos';

export const metadata: Metadata = {
  title: 'Projets — Yvan Kerdanet',
  description: 'Repos publics GitHub — projets personnels et contributions.',
};

interface PageProps {
  searchParams?: Promise<{ lang?: string }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const initialLang = params?.lang ?? null;

  const [repos, user] = await Promise.all([
    getGitHubRepos({ withFavicons: true }),
    getGitHubUser(),
  ]);

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

        <ProjectsClient repos={repos} userLogin={user?.login ?? ''} initialLang={initialLang} />
      </div>
    </main>
  );
}
