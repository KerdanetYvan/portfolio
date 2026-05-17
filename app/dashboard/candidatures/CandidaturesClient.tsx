'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import type { Candidature } from '@/db';
import type { CandidatureWithDetails, CandidatureCounts, StatutFilter } from '@/db/queries/candidatures';
import CandidatureModal from './components/CandidatureModal';
import CandidatureDetail from './components/CandidatureDetail';

// ─── Couleurs & labels statuts ────────────────────────────────────────────────

type Statut = 'a_envoyer' | 'envoyee' | 'entretien_programme' | 'en_cours' | 'acceptee' | 'refusee' | 'ghosted';

const STATUT_LABELS: Record<Statut, string> = {
  a_envoyer:           'À envoyer',
  envoyee:             'Envoyée',
  entretien_programme: 'Entretien programmé',
  en_cours:            'En cours',
  acceptee:            'Acceptée',
  refusee:             'Refusée',
  ghosted:             'Ghosted',
};

const STATUT_COLORS: Record<Statut, string> = {
  a_envoyer:           'text-muted bg-[#1a1a1a]',
  envoyee:             'text-blue-400 bg-blue-400/10',
  entretien_programme: 'text-violet-400 bg-violet-400/10',
  en_cours:            'text-cyan-400 bg-cyan-400/10',
  acceptee:            'text-[#00D26A] bg-[#00D26A]/10',
  refusee:             'text-red-400 bg-red-400/10',
  ghosted:             'text-orange-500 bg-orange-500/10',
};

const TYPE_LABELS: Record<string, string> = {
  presentiel: 'Présentiel',
  remote: 'Remote',
  hybride: 'Hybride',
};

// ─── Card candidature ─────────────────────────────────────────────────────────

function CandidatureCard({
  c,
  isSelected,
  onClick,
  today,
}: {
  c: Candidature;
  isSelected: boolean;
  onClick: () => void;
  today: string;
}) {
  const statut = c.statut as Statut;
  const relanceAFaire =
    c.date_relance !== null &&
    c.date_relance <= today &&
    !c.relance_effectuee &&
    !['acceptee', 'refusee', 'ghosted'].includes(statut);

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
        isSelected
          ? 'border-accent/40 bg-[#161616]'
          : 'border-[#262626] bg-[#111] hover:border-[#363636] hover:bg-[#161616]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-on-surface">{c.poste}</p>
          <p className="truncate text-xs text-muted">{c.entreprise}</p>
        </div>
        <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] ${STATUT_COLORS[statut]}`}>
          {STATUT_LABELS[statut]}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[10px] text-muted/60">{TYPE_LABELS[c.type_poste]}</span>
        {c.date_candidature && (
          <span className="font-mono text-[10px] text-muted/60">
            · {new Date(c.date_candidature).toLocaleDateString('fr-FR')}
          </span>
        )}
        {!c.date_candidature && statut === 'a_envoyer' && (
          <span className="font-mono text-[10px] text-muted/60">· Non envoyée</span>
        )}
        {relanceAFaire && (
          <span className="rounded bg-orange-500/10 px-1.5 py-0.5 font-mono text-[9px] text-orange-400">
            Relance
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  initialList: Candidature[];
  counts: CandidatureCounts;
  selectedCandidature: CandidatureWithDetails | null;
  initialFilter: string;
  initialId: string | undefined;
};

// ─── Composant principal ──────────────────────────────────────────────────────

export default function CandidaturesClient({
  initialList,
  counts,
  selectedCandidature,
  initialFilter,
  initialId,
}: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<StatutFilter>((initialFilter as StatutFilter) || 'all');
  const [selectedId, setSelectedId] = useState<string | undefined>(initialId);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Filtrage côté client
  const filtered = initialList.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'a_envoyer') return c.statut === 'a_envoyer';
    if (filter === 'en_cours') return ['envoyee', 'entretien_programme', 'en_cours'].includes(c.statut);
    if (filter === 'relance') {
      return (
        c.date_relance !== null &&
        c.date_relance <= today &&
        !c.relance_effectuee &&
        !['acceptee', 'refusee', 'ghosted'].includes(c.statut)
      );
    }
    return c.statut === filter;
  });

  const handleFilterChange = useCallback((f: StatutFilter) => {
    setFilter(f);
    const url = new URL(window.location.href);
    url.searchParams.set('filter', f);
    if (f !== filter) url.searchParams.delete('id');
    window.history.replaceState({}, '', url.toString());
  }, [filter]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('id', id);
    router.push(url.pathname + '?' + url.searchParams.toString());
  }, [router]);

  const handleDeleted = useCallback(() => {
    setSelectedId(undefined);
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    router.replace(url.pathname + '?' + url.searchParams.toString());
  }, [router]);

  const FILTERS: { key: StatutFilter; label: string; count: number | null }[] = [
    { key: 'all',       label: 'Toutes',      count: counts.total },
    { key: 'a_envoyer', label: 'À envoyer',   count: counts.a_envoyer },
    { key: 'en_cours',  label: 'En cours',    count: counts.en_cours },
    { key: 'relance',   label: 'À relancer',  count: counts.relance },
    { key: 'acceptee',  label: 'Acceptées',   count: counts.acceptee },
    { key: 'refusee',   label: 'Refusées',    count: counts.refusee },
    { key: 'ghosted',   label: 'Ghosted',     count: counts.ghosted },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Colonne gauche : liste ── */}
      <div className="flex w-[400px] shrink-0 flex-col border-r border-[#262626]">
        {/* Bouton + Nouvelle */}
        <div className="shrink-0 border-b border-[#262626] p-3">
          <button
            onClick={() => setModalMode('create')}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2 text-sm font-medium text-black hover:bg-accent-hover"
          >
            <Plus size={14} />
            Nouvelle candidature
          </button>
        </div>

        {/* Filtres */}
        <div className="shrink-0 border-b border-[#262626] px-3 py-2">
          <div className="flex flex-wrap gap-1">
            {FILTERS.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] transition-colors ${
                  filter === key
                    ? 'bg-accent text-black'
                    : 'bg-[#1a1a1a] text-muted hover:text-on-surface'
                } ${key === 'relance' && count && count > 0 ? 'border border-orange-500/30' : ''}`}
              >
                {label}
                {count !== null && count > 0 && (
                  <span className={`rounded-full px-1 ${filter === key ? 'bg-black/20' : 'bg-[#262626]'}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">Aucune candidature</p>
          ) : (
            filtered.map((c) => (
              <CandidatureCard
                key={c.id}
                c={c}
                isSelected={selectedId === c.id}
                onClick={() => handleSelect(c.id)}
                today={today}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Colonne droite : détail ── */}
      <div className="flex-1 overflow-hidden">
        {selectedCandidature && selectedId === selectedCandidature.id ? (
          <CandidatureDetail
            candidature={selectedCandidature}
            onEdit={() => setModalMode('edit')}
            onDeleted={handleDeleted}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted">Sélectionnez une candidature</p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {modalMode === 'create' && (
        <CandidatureModal
          mode="create"
          onClose={() => setModalMode(null)}
          onCreated={(id) => { setModalMode(null); handleSelect(id); }}
        />
      )}
      {modalMode === 'edit' && selectedCandidature && (
        <CandidatureModal
          mode="edit"
          initial={selectedCandidature}
          onClose={() => setModalMode(null)}
          onUpdated={() => { setModalMode(null); router.refresh(); }}
        />
      )}
    </div>
  );
}
