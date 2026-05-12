import type { Metadata } from 'next';
import { SKILL_CATEGORIES } from '@/data/skills';
import type { SkillCategory } from '@/data/skills';
import { LEARNING_ITEMS } from '@/data/learning';
import SkillsGrid from './SkillsGrid';

export const metadata: Metadata = {
  title: 'Compétences — Yvan Kerdanet',
  description: 'Stack technique : Frontend, Backend, Bases de données, DevOps & Outillage.',
};

const HIDDEN_TOPICS = ['github-config'];

const PACKAGE_TO_SKILLS: Record<string, string[]> = {
  'react':                  ['React'],
  'react-dom':              ['React'],
  'next':                   ['Next.js', 'REST APIs'],
  'tailwindcss':            ['Tailwind CSS'],
  '@tailwindcss/postcss':   ['Tailwind CSS'],
  '@tailwindcss/vite':      ['Tailwind CSS'],
  'three':                  ['Three.js'],
  '@react-three/fiber':     ['Three.js'],
  '@react-three/drei':      ['Three.js'],
  'framer-motion':          ['Framer Motion'],
  'express':                ['Express', 'REST APIs'],
  'fastify':                ['REST APIs'],
  'prisma':                 ['Prisma ORM'],
  '@prisma/client':         ['Prisma ORM'],
  'mongoose':               ['MongoDB'],
  'mongodb':                ['MongoDB'],
  'mysql2':                 ['MySQL'],
  'mysql':                  ['MySQL'],
  'pg':                     ['PostgreSQL'],
  'postgres':               ['PostgreSQL'],
  'next-auth':              ['NextAuth v5'],
  '@auth/nextjs':           ['NextAuth v5'],
};

interface GitHubRepo {
  name: string;
  language: string | null;
  pushed_at: string;
  topics: string[];
  owner: { login: string };
}

export interface SkillStat {
  count: number;
  lastPushed: string;
  repos: { name: string; owner: string }[];
}

async function fetchGitHub<T>(path: string, revalidate = 3600): Promise<T | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    next: { revalidate },
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const data = await fetchGitHub<GitHubRepo[]>(
    '/user/repos?type=all&sort=pushed&per_page=100'
  );
  return data ?? [];
}

async function fetchPackageSkills(
  repos: GitHubRepo[]
): Promise<Map<string, Set<string>>> {
  const jsRepos = repos.filter(
    (r) => r.language === 'TypeScript' || r.language === 'JavaScript'
  );

  const results = await Promise.allSettled(
    jsRepos.map(async (repo) => {
      const data = await fetchGitHub<{ content: string }>(
        `/repos/${repo.owner.login}/${repo.name}/contents/package.json`,
        86400
      );
      if (!data?.content) return null;

      let pkg: Record<string, Record<string, string>>;
      try {
        pkg = JSON.parse(
          Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8')
        ) as Record<string, Record<string, string>>;
      } catch {
        return null;
      }

      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      const skills = new Set<string>(['Node.js']);
      for (const [packageName, skillNames] of Object.entries(PACKAGE_TO_SKILLS)) {
        if (packageName in allDeps) skillNames.forEach((s) => skills.add(s));
      }
      return { repoName: repo.name, skills };
    })
  );

  const map = new Map<string, Set<string>>();
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      map.set(result.value.repoName, result.value.skills);
    }
  }
  return map;
}

function computeSkillStats(
  repos: GitHubRepo[],
  categories: SkillCategory[],
  packageMap: Map<string, Set<string>>
): Record<string, SkillStat> {
  const stats: Record<string, SkillStat> = {};
  const seen: Record<string, Set<string>> = {};

  for (const repo of repos) {
    if (repo.topics.some((t) => HIDDEN_TOPICS.includes(t))) continue;

    for (const category of categories) {
      for (const skill of category.skills) {
        const matchesLang    = skill.githubLanguage && repo.language === skill.githubLanguage;
        const matchesTopic   = skill.githubTopics?.some((t) => repo.topics.includes(t));
        const matchesPackage = packageMap.get(repo.name)?.has(skill.name);
        if (!matchesLang && !matchesTopic && !matchesPackage) continue;

        if (!seen[skill.name]) seen[skill.name] = new Set();
        if (seen[skill.name].has(repo.name)) continue;
        seen[skill.name].add(repo.name);

        if (!stats[skill.name]) stats[skill.name] = { count: 0, lastPushed: repo.pushed_at, repos: [] };
        stats[skill.name].count++;
        if (repo.pushed_at > stats[skill.name].lastPushed) stats[skill.name].lastPushed = repo.pushed_at;
        stats[skill.name].repos.push({ name: repo.name, owner: repo.owner.login });
      }
    }
  }

  return stats;
}

export default async function SkillsPage() {
  const repos = await fetchRepos();
  const packageMap = await fetchPackageSkills(repos);
  const skillStats = computeSkillStats(repos, SKILL_CATEGORIES, packageMap);

  return (
    <main id="main-content" className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="mb-12">
          <p className="font-mono text-xs text-accent-bg mb-2">// compétences</p>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-3">
            Stack technique
          </h1>
          <p className="text-muted max-w-xl">
            Technologies et outils que j&apos;utilise au quotidien ou que j&apos;ai pratiqués en projet.
          </p>
        </div>

        <SkillsGrid
          categories={SKILL_CATEGORIES}
          skillStats={skillStats}
          learningItems={LEARNING_ITEMS}
        />
      </div>
    </main>
  );
}
