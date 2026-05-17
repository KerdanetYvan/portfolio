'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { GripVertical, Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, X } from 'lucide-react';
import type { ProjetMeta } from '@/db';
import {
  createProjetMeta, updateProjetMeta, deleteProjetMeta, toggleProjetMetaVisible,
} from '../actions';
import { useToast } from '../../components/ToastProvider';
import TagInput from '@/app/components/ui/TagInput';

const INPUT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const LABEL = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';

type FormState = {
  nom: string;
  description: string;
  technologies: string[];
  url_demo: string;
  url_repo: string;
  visible: boolean;
};

const EMPTY: FormState = {
  nom: '',
  description: '',
  technologies: [],
  url_demo: '',
  url_repo: '',
  visible: true,
};

function fromProjet(p: ProjetMeta): FormState {
  return {
    nom:          p.nom,
    description:  p.description,
    technologies: p.technologies ?? [],
    url_demo:     p.url_demo ?? '',
    url_repo:     p.url_repo ?? '',
    visible:      p.visible,
  };
}

type Props = { initial: ProjetMeta[] };

export default function ProjetsSection({ initial }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState(initial);
  const [modal, setModal] = useState<{ mode: 'add' } | { mode: 'edit'; item: ProjetMeta } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const set = (field: keyof FormState, value: FormState[keyof FormState]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }); };
  const openEdit = (item: ProjetMeta) => { setForm(fromProjet(item)); setModal({ mode: 'edit', item }); };
  const closeModal = () => setModal(null);

  const run = (fn: () => Promise<void>, successMsg: string) => {
    startTransition(async () => {
      try {
        await fn();
        showToast(successMsg, 'success');
        router.refresh();
      } catch {
        showToast('Une erreur est survenue', 'error');
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      nom:          form.nom,
      description:  form.description,
      technologies: form.technologies.length > 0 ? form.technologies : null,
      url_demo:     form.url_demo || null,
      url_repo:     form.url_repo || null,
      visible:      form.visible,
    };
    if (modal?.mode === 'add') {
      run(async () => { await createProjetMeta(data); closeModal(); }, 'Projet ajouté');
    } else if (modal?.mode === 'edit') {
      run(async () => { await updateProjetMeta(modal.item.id, data); closeModal(); }, 'Projet mis à jour');
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    run(async () => { await deleteProjetMeta(deleteId); setDeleteId(null); setItems((prev) => prev.filter((i) => i.id !== deleteId)); }, 'Projet supprimé');
  };

  const handleToggle = (item: ProjetMeta) => {
    run(() => toggleProjetMetaVisible(item.id, !item.visible), item.visible ? 'Masqué' : 'Visible');
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, visible: !i.visible } : i));
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-on-surface">Projets</h1>
          <p className="mt-1 text-sm text-muted">{items.length} projet{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-black hover:bg-accent-hover"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">Aucun projet pour le moment.</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-[#262626] bg-[#111] px-4 py-3 hover:bg-[#161616]"
          >
            <GripVertical size={15} className="mt-0.5 shrink-0 cursor-grab text-muted/40" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-on-surface">{item.nom}</p>
                {item.url_repo && (
                  <a href={item.url_repo} target="_blank" rel="noopener noreferrer" className="shrink-0 font-mono text-[10px] text-muted hover:text-on-surface" onClick={(e) => e.stopPropagation()}>
                    repo
                  </a>
                )}
                {item.url_demo && (
                  <a href={item.url_demo} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted hover:text-accent" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted">{item.description}</p>
              {item.technologies && item.technologies.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {item.technologies.slice(0, 5).map((t) => (
                    <span key={t} className="rounded bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-[10px] text-on-surface/60">
                      {t}
                    </span>
                  ))}
                  {item.technologies.length > 5 && (
                    <span className="font-mono text-[10px] text-muted">+{item.technologies.length - 5}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => handleToggle(item)}
                className="rounded p-1.5 text-muted hover:bg-[#222] hover:text-on-surface"
                title={item.visible ? 'Masquer' : 'Afficher'}
              >
                {item.visible ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              <button
                onClick={() => openEdit(item)}
                className="rounded p-1.5 text-muted hover:bg-[#222] hover:text-on-surface"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="rounded p-1.5 text-muted hover:bg-red-900/30 hover:text-red-400"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

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
              <h2 className="text-sm font-semibold text-on-surface">
                {modal.mode === 'add' ? 'Ajouter un projet' : 'Modifier le projet'}
              </h2>
              <button onClick={closeModal} className="text-muted hover:text-on-surface">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={LABEL}>Nom du projet *</label>
                <input
                  className={INPUT}
                  value={form.nom}
                  onChange={(e) => set('nom', e.target.value)}
                  required
                  placeholder="Portfolio"
                />
              </div>

              <div>
                <label className={LABEL}>Description *</label>
                <textarea
                  className={`${INPUT} resize-none`}
                  rows={3}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  required
                  placeholder="Site portfolio personnel avec gestion de CV…"
                />
              </div>

              <div>
                <label className={LABEL}>Technologies</label>
                <TagInput
                  value={form.technologies}
                  onChange={(tags) => set('technologies', tags)}
                  placeholder="Next.js, TypeScript, Tailwind…"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Lien démo</label>
                  <input
                    type="url"
                    className={INPUT}
                    value={form.url_demo}
                    onChange={(e) => set('url_demo', e.target.value)}
                    placeholder="https://…"
                  />
                </div>
                <div>
                  <label className={LABEL}>Dépôt GitHub</label>
                  <input
                    type="url"
                    className={INPUT}
                    value={form.url_repo}
                    onChange={(e) => set('url_repo', e.target.value)}
                    placeholder="https://github.com/…"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => set('visible', e.target.checked)}
                  className="rounded accent-accent"
                />
                Visible sur le CV
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

      {/* Modal suppression */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-lg border border-[#262626] bg-[#111] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-sm font-semibold text-on-surface">Supprimer le projet ?</h2>
            <p className="mb-4 text-sm text-muted">Cette action est irréversible.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-md border border-[#262626] px-3 py-2 text-sm text-muted hover:text-on-surface"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
