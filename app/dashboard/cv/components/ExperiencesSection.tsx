'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { GripVertical, Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import type { Experience } from '@/db';
import {
  createExperience, updateExperience, deleteExperience, toggleExperienceVisible,
} from '../actions';
import { useToast } from '../../components/ToastProvider';
import DateRangeInput from '@/app/components/ui/DateRangeInput';
import TagInput from '@/app/components/ui/TagInput';

const INPUT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const LABEL = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';

type FormState = {
  poste: string;
  entreprise: string;
  description: string;
  date_debut: string;
  date_fin: string | null;
  localisation: string;
  technologies: string[];
  visible: boolean;
};

const EMPTY: FormState = {
  poste: '',
  entreprise: '',
  description: '',
  date_debut: '',
  date_fin: null,
  localisation: '',
  technologies: [],
  visible: true,
};

function fromExperience(e: Experience): FormState {
  return {
    poste:        e.poste,
    entreprise:   e.entreprise,
    description:  e.description,
    date_debut:   e.date_debut,
    date_fin:     e.date_fin ?? null,
    localisation: e.localisation ?? '',
    technologies: e.technologies ?? [],
    visible:      e.visible,
  };
}

type Props = { initial: Experience[] };

export default function ExperiencesSection({ initial }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState(initial);
  const [modal, setModal] = useState<{ mode: 'add' } | { mode: 'edit'; item: Experience } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const set = (field: keyof FormState, value: FormState[keyof FormState]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }); };
  const openEdit = (item: Experience) => { setForm(fromExperience(item)); setModal({ mode: 'edit', item }); };
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
      poste:        form.poste,
      entreprise:   form.entreprise,
      description:  form.description,
      date_debut:   form.date_debut,
      date_fin:     form.date_fin || null,
      localisation: form.localisation || null,
      technologies: form.technologies.length > 0 ? form.technologies : null,
      visible:      form.visible,
    };
    if (modal?.mode === 'add') {
      run(async () => { await createExperience(data); closeModal(); }, 'Expérience ajoutée');
    } else if (modal?.mode === 'edit') {
      run(async () => { await updateExperience(modal.item.id, data); closeModal(); }, 'Expérience mise à jour');
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    run(async () => { await deleteExperience(deleteId); setDeleteId(null); setItems((prev) => prev.filter((i) => i.id !== deleteId)); }, 'Expérience supprimée');
  };

  const handleToggle = (item: Experience) => {
    run(() => toggleExperienceVisible(item.id, !item.visible), item.visible ? 'Masqué' : 'Visible');
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, visible: !i.visible } : i));
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-on-surface">Expériences</h1>
          <p className="mt-1 text-sm text-muted">{items.length} expérience{items.length !== 1 ? 's' : ''}</p>
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
          <p className="py-8 text-center text-sm text-muted">Aucune expérience pour le moment.</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-[#262626] bg-[#111] px-4 py-3 hover:bg-[#161616]"
          >
            <GripVertical size={15} className="mt-0.5 shrink-0 cursor-grab text-muted/40" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-on-surface">{item.poste}</p>
              <p className="truncate text-xs text-muted">
                {item.entreprise}
                {item.localisation ? ` · ${item.localisation}` : ''}
                {' · '}
                {item.date_debut}
                {' → '}
                {item.date_fin ?? 'présent'}
              </p>
              {item.technologies && item.technologies.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {item.technologies.slice(0, 6).map((t) => (
                    <span key={t} className="rounded bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-[10px] text-on-surface/60">
                      {t}
                    </span>
                  ))}
                  {item.technologies.length > 6 && (
                    <span className="font-mono text-[10px] text-muted">+{item.technologies.length - 6}</span>
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
                {modal.mode === 'add' ? 'Ajouter une expérience' : 'Modifier l\'expérience'}
              </h2>
              <button onClick={closeModal} className="text-muted hover:text-on-surface">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Poste *</label>
                  <input
                    className={INPUT}
                    value={form.poste}
                    onChange={(e) => set('poste', e.target.value)}
                    required
                    placeholder="Développeur Full-Stack"
                  />
                </div>
                <div>
                  <label className={LABEL}>Entreprise *</label>
                  <input
                    className={INPUT}
                    value={form.entreprise}
                    onChange={(e) => set('entreprise', e.target.value)}
                    required
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              <div>
                <label className={LABEL}>Localisation</label>
                <input
                  className={INPUT}
                  value={form.localisation}
                  onChange={(e) => set('localisation', e.target.value)}
                  placeholder="Rennes, France"
                />
              </div>

              <DateRangeInput
                dateDebut={form.date_debut}
                dateFin={form.date_fin}
                onDebutChange={(v) => set('date_debut', v)}
                onFinChange={(v) => set('date_fin', v)}
              />

              <div>
                <label className={LABEL}>Description</label>
                <textarea
                  className={`${INPUT} resize-none`}
                  rows={3}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Missions, responsabilités, réalisations…"
                />
              </div>

              <div>
                <label className={LABEL}>Technologies</label>
                <TagInput
                  value={form.technologies}
                  onChange={(tags) => set('technologies', tags)}
                  placeholder="React, Node.js, PostgreSQL…"
                />
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
            <h2 className="mb-2 text-sm font-semibold text-on-surface">Supprimer l'expérience ?</h2>
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
