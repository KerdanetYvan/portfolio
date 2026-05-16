'use client';

import { useState } from 'react';
import type { StatusRow, LearningItem } from '@/db';
import StatusSection from './StatusSection';
import LearningSection from './LearningSection';

type Section = 'status' | 'learning';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'status', label: 'Statut' },
  { id: 'learning', label: 'Currently Learning' },
];

type Props = {
  initialSection: Section;
  statuses: StatusRow[];
  items: LearningItem[];
};

export default function PersonnalizeClient({ initialSection, statuses, items }: Props) {
  const [section, setSection] = useState<Section>(initialSection);

  return (
    <div className="mx-auto flex max-w-5xl gap-8">
      {/* Sidebar interne */}
      <aside className="w-44 shrink-0">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-muted">
          Sections
        </p>
        <nav className="space-y-0.5">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors
                ${section === s.id
                  ? 'bg-[#161616] text-on-surface'
                  : 'text-muted hover:bg-[#111] hover:text-on-surface'
                }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenu */}
      <div className="min-w-0 flex-1">
        {section === 'status' ? (
          <StatusSection statuses={statuses} />
        ) : (
          <LearningSection items={items} />
        )}
      </div>
    </div>
  );
}
