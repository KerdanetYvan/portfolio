'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { GripVertical, Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import type { Formation } from '@/db';
import {
  createFormation, updateFormation, deleteFormation, toggleFormationVisible,
} from '../actions';
import { useToast } from '../../components/ToastProvider';
import DateRangeInput from '@/app/components/ui/DateRangeInput';

const INPUT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const LABEL = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';

type FormState = {
  diplome: string;
  etablissement: string;
  domaine: string;
  date_debut: string;
  date_fin: string | null;
  visible: boolean;
};

const EMPTY: FormState = {
  diplome: '',
  etablissement: '',
  domaine: '',
  date_debut: '',
  date_fin: null,
  visible: true,
};

function fromFormation(f: Formation): FormState {
  return {
    diplome:       f.diplome,
    etablissement: f.etablissement,
    domaine:       f.domaine ?? '',
    date_debut:    f.date_debut,
    date_fin:      f.date_fin ?? null,
    visible:       f.visible,
  };
}

type Props = { initial: Formation[] };

export default function FormationsSection({ initial }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState(initial);
  const [modal, setModal] = useState<{ mode: 'add' } | { mode: 'edit'; item: Formation } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const set = (field: keyof FormState, value: FormState[keyof FormState]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }); };
  const openEdit = (item: Formation) => { setForm(fromFormation(item)); setModal({ mode: 'edit', item }); };
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
      diplome:       form.diplome,
      etablissement: form.etablissement,
      domaine:       form.domaine || null,
      date_debut:    form.date_debut,
      date_fin:      form.date_fin || null,
      visible:       form.visible,
    };
    if (modal?.mode === 'add') {
      run(async () => { await createFormation(data); closeModal(); }, 'Formation ajoutée');
    } else if (modal?.mode === 'edit') {
      run(async () => { await updateFormation(modal.item.id, data); closeModal(); }, 'Formation mise à jour');
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    run(async () => { await deleteFormation(deleteId); setDeleteId(null); setItems((prev) => prev.filter((i) => i.id !== deleteId)); }, 'Formation supprimée');
  };

  const handleToggle = (item: Formation) => {
    run(() => toggleFormationVisible(item.id, !item.visible), item.visible ? 'Masqué' : 'Visible');
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, visible: !i.visible } : i));
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-on-surface">Formations</h1>
          <p className="mt-1 text-sm text-muted">{items.length} formation{items.length !== 1 ? 's' : ''}</p>
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
          <p className="py-8 text-center text-sm text-muted">Aucune formation pour le moment.</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-[#262626] bg-[#111] px-4 py-3 hover:bg-[#161616]"
          >
            <GripVertical size={15} className="mt-0.5 shrink-0 cursor-grab text-muted/40" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-on-surface">{item.diplome}</p>
              <p className="truncate text-xs text-muted">
                {item.etablissement}
                {item.domaine ? ` · ${item.domaine}` : ''}
                {' · '}
                {item.date_debut}
                {' → '}
                {item.date_fin ?? 'présent'}
              </p>
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
                {modal.mode === 'add' ? 'Ajouter une formation' : 'Modifier la formation'}
              </h2>
              <button onClick={closeModal} className="text-muted hover:text-on-surface">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={LABEL}>Diplôme *</label>
                <input
                  className={INPUT}
                  value={form.diplome}
                  onChange={(e) => set('diplome', e.target.value)}
                  required
                  placeholder="Master Informatique"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Établissement *</label>
                  <input
                    className={INPUT}
                    value={form.etablissement}
                    onChange={(e) => set('etablissement', e.target.value)}
                    required
                    placeholder="Université de Rennes"
                  />
                </div>
                <div>
                  <label className={LABEL}>Domaine</label>
                  <input
                    className={INPUT}
                    value={form.domaine}
                    onChange={(e) => set('domaine', e.target.value)}
                    placeholder="Génie logiciel"
                  />
                </div>
              </div>

              <DateRangeInput
                dateDebut={form.date_debut}
                dateFin={form.date_fin}
                onDebutChange={(v) => set('date_debut', v)}
                onFinChange={(v) => set('date_fin', v)}
              />

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
            <h2 className="mb-2 text-sm font-semibold text-on-surface">Supprimer la formation ?</h2>
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
