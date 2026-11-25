import type { IconType } from 'react-icons';
import {
  SiBlender, SiC, SiCaddy, SiCelery, SiClaude, SiCplusplus, SiCss3, SiDart, SiDjango, SiDocker,
  SiDotnet, SiElectron, SiExpo, SiExpress, SiFigma, SiFramer, SiGit, SiGithubactions, SiGnubash,
  SiGo, SiHtml5, SiJavascript, SiKotlin, SiLangchain, SiLaravel, SiLinux, SiMongodb, SiMongoose,
  SiMysql, SiN8N, SiNestjs, SiNextdotjs, SiNodedotjs, SiNpm, SiOpenai, SiOpenjdk, SiPhp, SiPnpm,
  SiPostgresql, SiPrisma, SiPwa, SiPytest, SiPython, SiQt, SiReact, SiRedis, SiRuby, SiRust,
  SiSass, SiSupabase, SiSwift, SiTailwindcss, SiTauri, SiThreedotjs, SiTypescript, SiVercel,
  SiVuedotjs,
} from 'react-icons/si';

export interface TechMeta {
  icon: IconType;
  /**
   * Couleur de marque (Simple Icons). Absente pour les logos noirs ou très
   * sombres : ils suivent alors la couleur du texte, pour rester visibles en
   * thème sombre.
   */
  color?: string;
  /** Site officiel (section Technologies de l'accueil). */
  href?: string;
}

/**
 * Registre des technos, indexé par le libellé exact utilisé dans le site
 * (section Technologies, `tech` de public/projets.json). Une techno absente
 * d'ici s'affiche en texte, sans logo.
 */
export const TECH: Record<string, TechMeta> = {
  'Next.js':        { icon: SiNextdotjs,                       href: 'https://nextjs.org' },
  'React':          { icon: SiReact,         color: '#61DAFB', href: 'https://react.dev' },
  'React Native':   { icon: SiReact,         color: '#61DAFB', href: 'https://reactnative.dev' },
  'TypeScript':     { icon: SiTypescript,    color: '#3178C6', href: 'https://www.typescriptlang.org' },
  'Tailwind CSS':   { icon: SiTailwindcss,   color: '#06B6D4', href: 'https://tailwindcss.com' },
  'Node.js':        { icon: SiNodedotjs,     color: '#5FA04E', href: 'https://nodejs.org' },
  'NestJS':         { icon: SiNestjs,        color: '#E0234E', href: 'https://nestjs.com' },
  'MongoDB':        { icon: SiMongodb,       color: '#47A248', href: 'https://www.mongodb.com' },
  'Mongoose':       { icon: SiMongoose,                        href: 'https://mongoosejs.com' },
  'PostgreSQL':     { icon: SiPostgresql,    color: '#4169E1', href: 'https://www.postgresql.org' },
  'Supabase':       { icon: SiSupabase,      color: '#3FCF8E', href: 'https://supabase.com' },
  'Redis':          { icon: SiRedis,         color: '#FF4438', href: 'https://redis.io' },
  'Three.js':       { icon: SiThreedotjs,                      href: 'https://threejs.org' },
  'Expo':           { icon: SiExpo,                            href: 'https://expo.dev' },
  'PWA':            { icon: SiPwa,                            href: 'https://web.dev/explore/progressive-web-apps' },
  'Electron':       { icon: SiElectron,                       href: 'https://www.electronjs.org' },
  'Tauri 2':        { icon: SiTauri,         color: '#24C8D8', href: 'https://tauri.app' },
  'Python':         { icon: SiPython,        color: '#3776AB', href: 'https://www.python.org' },
  'Django':         { icon: SiDjango,                          href: 'https://www.djangoproject.com' },
  'Celery':         { icon: SiCelery,        color: '#37814A', href: 'https://docs.celeryq.dev' },
  'pytest':         { icon: SiPytest,        color: '#0A9EDC', href: 'https://pytest.org' },
  'PySide6':        { icon: SiQt,            color: '#41CD52', href: 'https://doc.qt.io/qtforpython-6/' },
  'LangChain':      { icon: SiLangchain,                       href: 'https://www.langchain.com' },
  'OpenAI API':     { icon: SiOpenai,                          href: 'https://platform.openai.com' },
  'Claude Code':    { icon: SiClaude,        color: '#D97757', href: 'https://www.anthropic.com/claude-code' },
  'Bash':           { icon: SiGnubash,       color: '#4EAA25', href: 'https://www.gnu.org/software/bash/' },
  'n8n':            { icon: SiN8N,           color: '#EA4B71', href: 'https://n8n.io' },
  'Docker':         { icon: SiDocker,        color: '#2496ED', href: 'https://www.docker.com' },
  'Caddy':          { icon: SiCaddy,         color: '#1F88C0', href: 'https://caddyserver.com' },
  'Git':            { icon: SiGit,           color: '#F05032', href: 'https://git-scm.com' },
  'GitHub Actions': { icon: SiGithubactions, color: '#2088FF', href: 'https://github.com/features/actions' },
  'Figma':          { icon: SiFigma,         color: '#F24E1E', href: 'https://www.figma.com' },
  'Blender':        { icon: SiBlender,       color: '#E87D0D', href: 'https://www.blender.org' },
  // Langages (langage principal des dépôts GitHub) et compétences de /skills
  'JavaScript':     { icon: SiJavascript,    color: '#F7DF1E', href: 'https://developer.mozilla.org/docs/Web/JavaScript' },
  'HTML':           { icon: SiHtml5,         color: '#E34F26', href: 'https://developer.mozilla.org/docs/Web/HTML' },
  'CSS':            { icon: SiCss3,          color: '#1572B6', href: 'https://developer.mozilla.org/docs/Web/CSS' },
  'Sass':           { icon: SiSass,          color: '#CC6699', href: 'https://sass-lang.com' },
  'Framer Motion':  { icon: SiFramer,                          href: 'https://motion.dev' },
  'Express':        { icon: SiExpress,                         href: 'https://expressjs.com' },
  'PHP':            { icon: SiPhp,           color: '#777BB4', href: 'https://www.php.net' },
  'Laravel':        { icon: SiLaravel,       color: '#FF2D20', href: 'https://laravel.com' },
  'Prisma':         { icon: SiPrisma,                          href: 'https://www.prisma.io' },
  'MySQL':          { icon: SiMysql,         color: '#4479A1', href: 'https://www.mysql.com' },
  'Vercel':         { icon: SiVercel,                          href: 'https://vercel.com' },
  'npm':            { icon: SiNpm,           color: '#CB3837', href: 'https://www.npmjs.com' },
  'pnpm':           { icon: SiPnpm,          color: '#F69220', href: 'https://pnpm.io' },
  'Linux':          { icon: SiLinux,         color: '#FCC624', href: 'https://www.kernel.org' },
  'Rust':           { icon: SiRust,                            href: 'https://www.rust-lang.org' },
  'Go':             { icon: SiGo,            color: '#00ADD8', href: 'https://go.dev' },
  'Java':           { icon: SiOpenjdk,                         href: 'https://openjdk.org' },
  '.NET':           { icon: SiDotnet,                          href: 'https://dotnet.microsoft.com' },
  'C++':            { icon: SiCplusplus,     color: '#00599C', href: 'https://isocpp.org' },
  'C':              { icon: SiC,             color: '#A8B9CC', href: 'https://www.open-std.org/jtc1/sc22/wg14/' },
  'Ruby':           { icon: SiRuby,          color: '#CC342D', href: 'https://www.ruby-lang.org' },
  'Vue':            { icon: SiVuedotjs,      color: '#4FC08D', href: 'https://vuejs.org' },
  'Kotlin':         { icon: SiKotlin,        color: '#7F52FF', href: 'https://kotlinlang.org' },
  'Swift':          { icon: SiSwift,         color: '#F05138', href: 'https://www.swift.org' },
  'Dart':           { icon: SiDart,          color: '#0175C2', href: 'https://dart.dev' },
};

/**
 * Libellés qui désignent une partie d'une techno (ou un nom alternatif) :
 * ils prennent le logo de la techno parente.
 */
const ALIASES: Record<string, string> = {
  'NextAuth v5':       'Next.js',
  'PostgreSQL avancé': 'PostgreSQL',
  'HTML / CSS':        'HTML',
  'npm / pnpm':        'npm',
  'Linux / SSH':       'Linux',
  'Prisma ORM':        'Prisma',
  'SCSS':              'Sass',
  'Shell':             'Bash',
  'C#':                '.NET',
};

/** Techno d'un libellé, directement ou via sa techno parente ; undefined si inconnue. */
export function getTech(label: string): TechMeta | undefined {
  return TECH[label] ?? TECH[ALIASES[label]];
}

/** Couleur CSS du logo : la couleur de marque, ou celle du texte à défaut. */
export function techColor(meta: TechMeta): string {
  return meta.color ?? 'var(--on-surface)';
}
