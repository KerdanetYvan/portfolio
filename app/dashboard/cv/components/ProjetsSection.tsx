'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ExternalLink, Star, GitFork, X, Search, Check, RefreshCw } from 'lucide-react';
import type { GitHubRepo } from '@/lib/github/repos';
import type { ProjetMeta } from '@/db';
import { addProjetToCV, updateProjetMeta, removeProjetFromCV } from '../actions';
import { useToast } from '../../components/ToastProvider';
import TagInput from '@/app/components/ui/TagInput';

const INPUT    = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const LABEL    = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';
const LANG_DOT: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', 'C#': '#178600',
  PHP: '#4F5D95', Ruby: '#701516', Swift: '#F05138', Kotlin: '#A97BFF',
  Dart: '#00B4AB', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051',
};

type RepoWithMeta = GitHubRepo & { meta: ProjetMeta | null };

type FormState = {
  titre_cv: string;
  description_cv: string;
  tags: string[];
  inclure_par_defaut: boolean;
};

const EMPTY_FORM: FormState = { titre_cv: '', description_cv: '', tags: [], inclure_par_defaut: false };

function fromMeta(m: ProjetMeta): FormState {
  return {
    titre_cv:           m.titre_cv ?? '',
    description_cv:     m.description_cv ?? '',
    tags:               m.tags ?? [],
    inclure_par_defaut: m.inclure_par_defaut,
  };
}

type Filter = 'all' | 'in_cv' | 'not_in_cv';
type SortKey = 'pushed' | 'stars' | 'alpha';

type Props = { repos: RepoWithMeta[] };

export default function ProjetsSection({ repos: initial }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [items, setItems]       = useState(initial);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<Filter>('all');
  const [sort, setSort]         = useState<SortKey>('pushed');
  const [modal, setModal]       = useState<{ repo: RepoWithMeta } | null>(null);
  const [form, setForm]         = useState<FormState>(EMPTY_FORM);
  const [confirmId, setConfirmId] = useState<string | null>(null); // meta.id à supprimer

  const set = (field: keyof FormState, val: FormState[keyof FormState]) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const openAdd = (repo: RepoWithMeta) => {
    setForm(repo.meta ? fromMeta(repo.meta) : EMPTY_FORM);
    setModal({ repo });
  };
  const closeModal = () => setModal(null);

  const run = (fn: () => Promise<void>, msg: string) => {
    startTransition(async () => {
      try { await fn(); showToast(msg, 'success'); router.refresh(); }
      catch { showToast('Une erreur est survenue', 'error'); }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    const { repo } = modal;
    const data = {
      titre_cv:           form.titre_cv.trim() || null,
      description_cv:     form.description_cv.trim() || null,
      tags:               form.tags.length ? form.tags : null,
      inclure_par_defaut: form.inclure_par_defaut,
    };
    if (repo.meta) {
      run(async () => { await updateProjetMeta(repo.meta!.id, data); closeModal(); }, 'Méta CV mise à jour');
    } else {
      run(async () => { await addProjetToCV({ github_repo_id: String(repo.id), ...data }); closeModal(); }, 'Repo ajouté au CV');
    }
  };

  const handleRemove = () => {
    if (!confirmId) return;
    run(async () => { await removeProjetFromCV(confirmId); setConfirmId(null); }, 'Retiré du CV');
  };

  const inCvCount = items.filter((r) => r.meta !== null).length;

  const displayed = useMemo(() => {
    let list = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q)
      );
    }
    if (filter === 'in_cv')     list = list.filter((r) => r.meta !== null);
    if (filter === 'not_in_cv') list = list.filter((r) => r.meta === null);
    if (sort === 'stars') list.sort((a, b) => b.stargazers_count - a.stargazers_count);
    else if (sort === 'alpha') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [items, search, filter, sort]);

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-on-surface">Projets GitHub</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} repos · <span className="text-accent">{inCvCount} dans le CV</span>
          </p>
        </div>
        <button
          onClick={() => router.refresh()}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md border border-[#262626] px-2.5 py-1.5 text-xs text-muted hover:text-on-surface disabled:opacity-40"
          title="Rafraîchir depuis GitHub"
        >
          <RefreshCw size={12} className={isPending ? 'animate-spin' : ''} />
          Rafraîchir
        </button>
      </div>

      {/* Filtres */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chercher un repo…"
            className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] pl-8 pr-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex rounded-md border border-[#262626] overflow-hidden text-xs">
          {(['all', 'in_cv', 'not_in_cv'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 transition-colors ${filter === f ? 'bg-accent text-black font-medium' : 'text-muted hover:text-on-surface'}`}
            >
              {f === 'all' ? 'Tous' : f === 'in_cv' ? 'Dans le CV' : 'Pas dans le CV'}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-xs text-muted focus:outline-none"
        >
          <option value="pushed">Dernière MAJ</option>
          <option value="stars">Plus d'étoiles</option>
          <option value="alpha">Alphabétique</option>
        </select>
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">Aucun repo trouvé.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              onAdd={() => openAdd(repo)}
              onEdit={() => openAdd(repo)}
              onRemove={() => setConfirmId(repo.meta!.id)}
            />
          ))}
        </div>
      )}

      {/* Modal add/edit */}
      {modal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="mx-4 w-full max-w-lg rounded-lg border border-[#262626] bg-[#111] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-on-surface">
                  {modal.repo.meta ? 'Modifier les méta CV' : 'Ajouter au CV'}
                </h2>
                <p className="mt-0.5 font-mono text-xs text-muted">{modal.repo.full_name}</p>
              </div>
              <button onClick={closeModal} className="text-muted hover:text-on-surface"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={LABEL}>Titre CV</label>
                <input
                  type="text"
                  className={INPUT}
                  value={form.titre_cv}
                  onChange={(e) => set('titre_cv', e.target.value)}
                  placeholder={modal.repo.name}
                />
                <p className="mt-1 text-[11px] text-muted">Si vide, le nom du repo GitHub sera utilisé.</p>
              </div>

              <div>
                <label className={LABEL}>Description CV</label>
                <textarea
                  className={`${INPUT} resize-none`}
                  rows={3}
                  value={form.description_cv}
                  onChange={(e) => set('description_cv', e.target.value)}
                  placeholder={modal.repo.description ?? 'Si vide, la description GitHub sera utilisée'}
                />
              </div>

              <div>
                <label className={LABEL}>Tags de matching</label>
                <TagInput
                  value={form.tags}
                  onChange={(tags) => set('tags', tags)}
                  placeholder="Next.js, TypeScript, Tailwind…"
                />
                <p className="mt-1 text-[11px] text-muted">Utilisés pour le matching automatique dans le générateur de CV.</p>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={form.inclure_par_defaut}
                  onChange={(e) => set('inclure_par_defaut', e.target.checked)}
                  className="rounded accent-accent"
                />
                Inclure par défaut dans les CV générés
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-[#262626] px-3 py-2 text-sm text-muted hover:text-on-surface"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black hover:bg-accent-hover disabled:opacity-40"
                >
                  {isPending ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {confirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setConfirmId(null)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-lg border border-[#262626] bg-[#111] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-sm font-semibold text-on-surface">Retirer du CV ?</h2>
            <p className="mb-4 text-sm text-muted">
              Les méta CV de ce repo seront supprimées. Le repo GitHub reste intact.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="rounded-md border border-[#262626] px-3 py-2 text-sm text-muted hover:text-on-surface"
              >
                Annuler
              </button>
              <button
                onClick={handleRemove}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function RepoCard({
  repo, onAdd, onEdit, onRemove,
}: {
  repo: RepoWithMeta;
  onAdd: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const inCv = repo.meta !== null;
  const langColor = repo.language ? (LANG_DOT[repo.language] ?? '#888') : null;
  const relativeTime = formatRelative(repo.pushed_at);

  return (
    <div className={`flex flex-col rounded-lg border bg-[#111] hover:bg-[#141414] transition-colors ${inCv ? 'border-accent/40' : 'border-[#262626]'}`}>
      {/* Top */}
      <div className="flex-1 p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="truncate font-medium text-sm text-on-surface">
              {repo.meta?.titre_cv ?? repo.name}
            </span>
            {repo.meta?.titre_cv && repo.meta.titre_cv !== repo.name && (
              <span className="text-[9px] font-mono text-muted/60 truncate">{repo.name}</span>
            )}
              {repo.fork && (
                <span className="rounded bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-[9px] text-muted">fork</span>
              )}
              {inCv && repo.meta?.inclure_par_defaut && (
                <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] text-accent">défaut</span>
              )}
            </div>
            {repo.description && (
              <p className="mt-1 text-xs text-muted line-clamp-2 italic">{repo.description}</p>
            )}
          </div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted hover:text-accent"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Tags méta CV */}
        {inCv && repo.meta?.tags && repo.meta.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {repo.meta.tags.map((t) => (
              <span key={t} className="rounded bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-[10px] text-on-surface/60">{t}</span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-muted">
          {langColor && (
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-0.5">
              <Star size={10} />
              {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="flex items-center gap-0.5">
              <GitFork size={10} />
              {repo.forks_count}
            </span>
          )}
          <span>{relativeTime}</span>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between gap-2 border-t px-4 py-2.5 ${inCv ? 'border-accent/20' : 'border-[#1a1a1a]'}`}>
        {inCv ? (
          <>
            <span className="flex items-center gap-1 text-xs font-medium text-accent">
              <Check size={11} />
              Dans le CV
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="rounded p-1.5 text-muted hover:bg-[#222] hover:text-on-surface"
                title="Modifier les méta"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={onRemove}
                className="rounded p-1.5 text-muted hover:bg-red-900/30 hover:text-red-400"
                title="Retirer du CV"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onAdd}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
          >
            <Plus size={12} />
            Ajouter au CV
          </button>
        )}
      </div>
    </div>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return 'hier';
  if (days < 30)  return `il y a ${days}j`;
  if (days < 365) return `il y a ${Math.floor(days / 30)}mo`;
  return `il y a ${Math.floor(days / 365)}an`;
}
