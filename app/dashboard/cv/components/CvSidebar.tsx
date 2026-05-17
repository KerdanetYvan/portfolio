'use client';

import Link from 'next/link';
import {
  User, Briefcase, GraduationCap, Code, Sparkles,
  Languages, FolderGit2, Award, Heart,
} from 'lucide-react';

const SECTIONS = [
  { key: 'profile',         label: 'Mon profil',          icon: User },
  { key: 'experiences',     label: 'Expériences',          icon: Briefcase },
  { key: 'formations',      label: 'Formations',           icon: GraduationCap },
  { key: 'competences',     label: 'Compétences',          icon: Code },
  { key: 'soft-skills',     label: 'Soft skills',          icon: Sparkles },
  { key: 'langues',         label: 'Langues',              icon: Languages },
  { key: 'projets',         label: 'Projets',              icon: FolderGit2 },
  { key: 'certifications',  label: 'Certifications',       icon: Award },
  { key: 'centres-interet', label: "Centres d'intérêt",   icon: Heart },
] as const;

export default function CvSidebar({ currentSection }: { currentSection: string }) {
  return (
    <aside className="flex w-48 shrink-0 flex-col gap-0.5 border-r border-[#262626] p-3">
      {SECTIONS.map(({ key, label, icon: Icon }) => {
        const active = currentSection === key;
        return (
          <Link
            key={key}
            href={`/dashboard/cv?section=${key}`}
            className={[
              'relative flex items-center gap-2.5 overflow-hidden rounded-md px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-[#161616] text-on-surface'
                : 'text-muted hover:bg-[#111] hover:text-on-surface',
            ].join(' ')}
          >
            {active && (
              <span className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-accent" />
            )}
            <span className={`flex items-center gap-2 ${active ? 'pl-1' : ''}`}>
              <Icon size={14} className="shrink-0" />
              <span>{label}</span>
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
