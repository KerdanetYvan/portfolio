'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Langue } from '@/db';
import { createLangue, updateLangue, deleteLangue } from '../actions';
import { useToast } from '../../components/ToastProvider';

const INPUT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const SELECT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none';
const LABEL = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';

type Niveau = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'natif';

const NIVEAUX: { value: Niveau; label: string; color: string }[] = [
  { value: 'A1',    label: 'A1 — Débutant',      color: 'text-muted bg-[#1a1a1a]' },
  { value: 'A2',    label: 'A2 — Élémentaire',   color: 'text-muted bg-[#1a1a1a]' },
  { value: 'B1',    label: 'B1 — Intermédiaire',  color: 'text-yellow-400 bg-yellow-400/10' },
  { value: 'B2',    label: 'B2 — Indépendant',    color: 'text-yellow-400 bg-yellow-400/10' },
  { value: 'C1',    label: 'C1 — Avancé',         color: 'text-[#00D26A] bg-[#00D26A]/10' },
  { value: 'C2',    label: 'C2 — Maîtrise',       color: 'text-[#00D26A] bg-[#00D26A]/10' },
  { value: 'natif', label: 'Natif / Bilingue',    color: 'text-accent bg-accent/10' },
];

function getBadge(niveau: Niveau) {
  return NIVEAUX.find((n) => n.value === niveau) ?? NIVEAUX[0];
}

type FormState = { langue: string; niveau: Niveau };
const EMPTY: FormState = { langue: '', niveau: 'B2' };

type Props = { initial: Langue[] };

export default function LanguesSection({ initial }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState(initial);
  const [modal, setModal] = useState<{ mode: 'add' } | { mode: 'edit'; item: Langue } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }); };
  const openEdit = (item: Langue) => { setForm({ langue: item.langue, niveau: item.niveau }); setModal({ mode: 'edit', item }); };
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
    if (modal?.mode === 'add') {
      run(async () => { await createLangue(form); closeModal(); }, 'Langue ajoutée');
    } else if (modal?.mode === 'edit') {
      run(async () => { await updateLangue(modal.item.id, form); closeModal(); }, 'Langue mise à jour');
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    run(async () => { await deleteLangue(deleteId); setDeleteId(null); setItems((prev) => prev.filter((i) => i.id !== deleteId)); }, 'Langue supprimée');
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-on-surface">Langues</h1>
          <p className="mt-1 text-sm text-muted">{items.length} langue{items.length !== 1 ? 's' : ''}</p>
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
          <p className="py-8 text-center text-sm text-muted">Aucune langue pour le moment.</p>
        )}
        {items.map((item) => {
          const badge = getBadge(item.niveau);
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-[#262626] bg-[#111] px-4 py-3 hover:bg-[#161616]"
            >
              <span className="flex-1 text-sm font-medium text-on-surface">{item.langue}</span>
              <span className={`rounded px-2 py-0.5 font-mono text-[10px] ${badge.color}`}>
                {item.niveau === 'natif' ? 'Natif' : item.niveau}
              </span>
              <div className="flex shrink-0 items-center gap-1">
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
          );
        })}
      </div>

      {/* Modal add/edit */}
      {modal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-lg border border-[#262626] bg-[#111] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-on-surface">
                {modal.mode === 'add' ? 'Ajouter une langue' : 'Modifier la langue'}
              </h2>
              <button onClick={closeModal} className="text-muted hover:text-on-surface">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={LABEL}>Langue *</label>
                <input
                  className={INPUT}
                  value={form.langue}
                  onChange={(e) => set('langue', e.target.value)}
                  required
                  placeholder="Anglais"
                />
              </div>

              <div>
                <label className={LABEL}>Niveau</label>
                <select className={SELECT} value={form.niveau} onChange={(e) => set('niveau', e.target.value)}>
                  {NIVEAUX.map((n) => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>
              </div>

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
            <h2 className="mb-2 text-sm font-semibold text-on-surface">Supprimer la langue ?</h2>
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
