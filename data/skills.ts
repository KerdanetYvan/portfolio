export type Level = 'Daily driver' | 'Comfortable' | 'Familiar' | 'Exploring';

export interface Skill {
  name: string;
  level: Level;
  githubLanguage?: string;
  githubTopics?: string[];
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React',         level: 'Daily driver', githubTopics: ['react', 'reactjs'] },
      { name: 'Next.js',       level: 'Daily driver', githubTopics: ['nextjs', 'next-js'] },
      { name: 'TypeScript',    level: 'Daily driver', githubLanguage: 'TypeScript' },
      { name: 'Tailwind CSS',  level: 'Comfortable',  githubTopics: ['tailwindcss', 'tailwind-css'] },
      { name: 'JavaScript',    level: 'Daily driver', githubLanguage: 'JavaScript' },
      { name: 'HTML / CSS',    level: 'Daily driver', githubLanguage: 'HTML' },
      { name: 'Three.js',      level: 'Exploring',   githubTopics: ['threejs', 'three-js'] },
      { name: 'Framer Motion', level: 'Exploring',   githubTopics: ['framer-motion'] },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js',      level: 'Daily driver', githubTopics: ['nodejs', 'node-js'] },
      { name: 'Express',      level: 'Daily driver', githubTopics: ['express', 'expressjs'] },
      { name: 'REST APIs',    level: 'Comfortable' },
      { name: 'PHP',          level: 'Comfortable',  githubLanguage: 'PHP' },
      { name: 'NextAuth v5',  level: 'Exploring',    githubTopics: ['nextauth', 'next-auth'] },
    ],
  },
  {
    id: 'databases',
    label: 'Bases de données',
    skills: [
      { name: 'PostgreSQL',   level: 'Familiar',     githubTopics: ['postgresql', 'postgres'] },
      { name: 'Prisma ORM',   level: 'Exploring',    githubTopics: ['prisma', 'prisma-orm'] },
      { name: 'MongoDB',      level: 'Daily driver', githubTopics: ['mongodb'] },
      { name: 'MySQL',        level: 'Comfortable',  githubTopics: ['mysql'] },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Outillage',
    skills: [
      { name: 'Git',              level: 'Daily driver' },
      { name: 'Vercel',           level: 'Comfortable', githubTopics: ['vercel'] },
      { name: 'npm / pnpm',       level: 'Comfortable' },
      { name: 'Docker',           level: 'Comfortable', githubTopics: ['docker', 'docker-compose'] },
      { name: 'GitHub Actions',   level: 'Familiar',    githubTopics: ['github-actions'] },
      { name: 'Linux / SSH',      level: 'Comfortable' },
    ],
  },
];
