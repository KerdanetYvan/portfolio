'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCheck } from 'lucide-react';
import type { Candidature } from '@/db';
import { markRelanceDone } from '../candidatures/actions';
import { useToast } from './ToastProvider';

type Props = { relances: Candidature[] };

export default function RelancesCard({ relances }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const displayed = relances.slice(0, 3);
  const extra = relances.length - displayed.length;

  const handleDone = (id: string) => {
    startTransition(async () => {
      try {
        await markRelanceDone(id);
        showToast('Relance effectuée', 'success');
        router.refresh();
      } catch {
        showToast('Une erreur est survenue', 'error');
      }
    });
  };

  return (
    <div className="rounded-lg border border-orange-500/20 bg-[#111] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">Relances à faire</span>
        <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-bold text-orange-400">
          {relances.length}
        </span>
      </div>

      <ul className="space-y-2">
        {displayed.map((c) => (
          <li key={c.id} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-on-surface">
                <span className="font-medium">{c.poste}</span>
                <span className="text-muted"> — {c.entreprise}</span>
              </p>
              {c.date_relance && (
                <p className="font-mono text-[10px] text-orange-400/70">
                  Prévue le {new Date(c.date_relance).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDone(c.id)}
              disabled={isPending}
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#262626] px-2.5 py-1.5 text-xs text-muted hover:border-[#00D26A]/40 hover:text-[#00D26A] disabled:opacity-40"
              title="Marquer comme effectuée"
            >
              <CheckCheck size={11} />
              Fait
            </button>
          </li>
        ))}
      </ul>

      {extra > 0 && (
        <Link
          href="/dashboard/candidatures?filter=relance"
          className="mt-3 block font-mono text-[11px] text-muted hover:text-on-surface"
        >
          Voir tout (+{extra})
        </Link>
      )}
    </div>
  );
}
