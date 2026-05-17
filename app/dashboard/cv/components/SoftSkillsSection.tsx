'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { SoftSkill } from '@/db';
import { createSoftSkill, updateSoftSkill, deleteSoftSkill } from '../actions';
import { useToast } from '../../components/ToastProvider';

const INPUT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const LABEL = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';

type Props = { initial: SoftSkill[] };

export default function SoftSkillsSection({ initial }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState(initial);
  const [modal, setModal] = useState<{ mode: 'add' } | { mode: 'edit'; item: SoftSkill } | null>(null);
  const [libelle, setLibelle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setLibelle(''); setModal({ mode: 'add' }); };
  const openEdit = (item: SoftSkill) => { setLibelle(item.libelle); setModal({ mode: 'edit', item }); };
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
    if (!libelle.trim()) return;
    if (modal?.mode === 'add') {
      run(async () => { await createSoftSkill(libelle.trim()); closeModal(); }, 'Soft skill ajouté');
    } else if (modal?.mode === 'edit') {
      run(async () => { await updateSoftSkill(modal.item.id, libelle.trim()); closeModal(); }, 'Soft skill mis à jour');
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    run(async () => { await deleteSoftSkill(deleteId); setDeleteId(null); setItems((prev) => prev.filter((i) => i.id !== deleteId)); }, 'Soft skill supprimé');
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-on-surface">Soft skills</h1>
          <p className="mt-1 text-sm text-muted">{items.length} élément{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-black hover:bg-accent-hover"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.length === 0 && (
          <p className="w-full py-8 text-center text-sm text-muted">Aucun soft skill pour le moment.</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-full border border-[#262626] bg-[#111] px-3 py-1.5"
          >
            <span className="text-sm text-on-surface">{item.libelle}</span>
            <button
              onClick={() => openEdit(item)}
              className="text-muted hover:text-on-surface"
            >
              <Pencil size={11} />
            </button>
            <button
              onClick={() => setDeleteId(item.id)}
              className="text-muted hover:text-red-400"
            >
              <Trash2 size={11} />
            </button>
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
            className="mx-4 w-full max-w-sm rounded-lg border border-[#262626] bg-[#111] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-on-surface">
                {modal.mode === 'add' ? 'Ajouter un soft skill' : 'Modifier le soft skill'}
              </h2>
              <button onClick={closeModal} className="text-muted hover:text-on-surface">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={LABEL}>Intitulé *</label>
                <input
                  className={INPUT}
                  value={libelle}
                  onChange={(e) => setLibelle(e.target.value)}
                  required
                  placeholder="Travail en équipe"
                  autoFocus
                />
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
            <h2 className="mb-2 text-sm font-semibold text-on-surface">Supprimer le soft skill ?</h2>
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
