import Link from 'next/link';
import type { SkillCategory, Skill, Level } from '@/data/skills';
import type { LearningItem } from '@/data/learning';
import type { SkillStat } from './page';

const LEVEL_COLORS: Record<Level, string> = {
  'Daily driver': 'text-accent-bg',
  'Comfortable':  'text-pop-blue',
  'Familiar':     'text-pop-orange',
  'Exploring':    'text-muted',
};

interface SkillsGridProps {
  categories: SkillCategory[];
  skillStats: Record<string, SkillStat>;
  learningItems: LearningItem[];
}

function formatAge(iso: string): string {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (diffDays === 0) return "aujourd'hui";
  if (diffDays === 1) return 'hier';
  if (diffDays < 30) return `il y a ${diffDays}j`;
  if (diffDays < 365) return `il y a ${Math.floor(diffDays / 30)} mois`;
  const y = Math.floor(diffDays / 365);
  return `il y a ${y} an${y > 1 ? 's' : ''}`;
}

function formatLearningDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function SkillCard({ skill, stat }: { skill: Skill; stat?: SkillStat }) {
  const hasRepos = stat && stat.repos.length > 0;

  return (
    <div className="card-hover group flex flex-col gap-2.5 rounded-lg border bg-surface-raised p-4">
      {/* Name + level */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-sm text-on-surface">{skill.name}</span>
        <span
          className={`font-mono text-[10px] px-2 py-0.5 rounded border border-border bg-surface shrink-0 ${LEVEL_COLORS[skill.level]}`}
        >
          {skill.level}
        </span>
      </div>

      {/* GitHub stats */}
      {stat && (
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span>{stat.count} repo{stat.count > 1 ? 's' : ''}</span>
          <span aria-hidden="true">·</span>
          <span>{formatAge(stat.lastPushed)}</span>
          <Link
            href={`/projects?lang=${skill.githubLanguage}`}
            className="ml-auto text-accent hover:text-accent-hover transition-colors"
            aria-label={`Voir les projets ${skill.name}`}
          >
            →
          </Link>
        </div>
      )}

      {/* Repos — CSS-only hover reveal */}
      {hasRepos && (
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-200">
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
              {stat.repos.slice(0, 5).map((r) => (
                <Link
                  key={r.name}
                  href={`/projects/${r.owner}/${r.name}`}
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-surface text-muted hover:text-on-surface hover:border-accent-bg/50 transition-colors"
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LearningCard({ item }: { item: LearningItem }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-sm text-on-surface">{item.name}</span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-border bg-surface-raised text-muted shrink-0">
          {item.category}
        </span>
      </div>
      <p className="text-xs text-muted leading-relaxed flex-1">{item.description}</p>
      <div className="flex items-center gap-2 pt-1 font-mono text-xs text-muted border-t border-border">
        <span>depuis {formatLearningDate(item.startDate)}</span>
        {item.status === 'active' && (
          <span className="flex items-center gap-1 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-bg animate-pulse" aria-hidden="true" />
            <span className="text-accent-bg">en cours</span>
          </span>
        )}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover transition-colors"
            aria-label={`Ressource pour ${item.name}`}
          >
            →
          </a>
        )}
      </div>
    </div>
  );
}

export default function SkillsGrid({ categories, skillStats, learningItems }: SkillsGridProps) {
  return (
    <div className="space-y-14">
      {/* Skill categories */}
      {categories.map((category) => (
        <section key={category.id} aria-labelledby={`cat-${category.id}`}>
          <div className="flex items-center gap-3 mb-5">
            <p className="font-mono text-xs text-accent-bg shrink-0">// {category.id}</p>
            <h2
              id={`cat-${category.id}`}
              className="text-lg font-semibold text-on-surface shrink-0"
            >
              {category.label}
            </h2>
            <div className="flex-1 h-px bg-border" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {category.skills.map((skill) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                stat={skillStats[skill.name]}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Currently Learning */}
      {learningItems.length > 0 && (
        <section aria-labelledby="learning-title">
          <div className="flex items-center gap-3 mb-5">
            <p className="font-mono text-xs text-accent-bg shrink-0">// currently learning</p>
            <h2
              id="learning-title"
              className="text-lg font-semibold text-on-surface shrink-0"
            >
              En apprentissage
            </h2>
            <div className="flex-1 h-px bg-border" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {learningItems.map((item) => (
              <LearningCard key={item.name} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
