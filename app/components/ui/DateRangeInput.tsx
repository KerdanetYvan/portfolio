'use client';

import { useState } from 'react';

type Props = {
  dateDebut: string;
  dateFin: string | null;
  onDebutChange: (v: string) => void;
  onFinChange: (v: string | null) => void;
};

export default function DateRangeInput({ dateDebut, dateFin, onDebutChange, onFinChange }: Props) {
  const [enCours, setEnCours] = useState(dateFin === null);

  const toggleEnCours = (checked: boolean) => {
    setEnCours(checked);
    if (checked) onFinChange(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
            Date de début *
          </label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => onDebutChange(e.target.value)}
            required
            className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
            Date de fin
          </label>
          <input
            type="date"
            value={dateFin ?? ''}
            onChange={(e) => onFinChange(e.target.value || null)}
            disabled={enCours}
            className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none disabled:opacity-40"
          />
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={enCours}
          onChange={(e) => toggleEnCours(e.target.checked)}
          className="rounded accent-accent"
        />
        Toujours en cours
      </label>
    </div>
  );
}
