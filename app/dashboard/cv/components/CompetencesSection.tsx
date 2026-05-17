'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import type { Competence } from '@/db';
import {
  createCompetence, updateCompetence, deleteCompetence, toggleCompetenceVisible,
} from '../actions';
import { useToast } from '../../components/ToastProvider';

const INPUT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const SELECT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none';
const LABEL = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';

type Categorie = 'frontend' | 'backend' | 'bdd' | 'devops' | 'autres';
type Niveau = 'daily_driver' | 'comfortable' | 'familiar' | 'exploring';

const CATEGORIES: { value: Categorie; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend',  label: 'Backend' },
  { value: 'bdd',      label: 'Base de données' },
  { value: 'devops',   label: 'DevOps' },
  { value: 'autres',   label: 'Autres' },
];

const NIVEAUX: { value: Niveau; label: string; color: string }[] = [
  { value: 'daily_driver', label: 'Daily driver', color: 'text-[#00D26A] bg-[#00D26A]/10' },
  { value: 'comfortable',  label: 'Comfortable',  color: 'text-accent bg-accent/10' },
  { value: 'familiar',     label: 'Familiar',     color: 'text-yellow-400 bg-yellow-400/10' },
  { value: 'exploring',    label: 'Exploring',    color: 'text-muted bg-[#1a1a1a]' },
];

function getNiveauStyle(niveau: Niveau) {
  return NIVEAUX.find((n) => n.value === niveau)?.color ?? 'text-muted bg-[#1a1a1a]';
}

function getNiveauLabel(niveau: Niveau) {
  return NIVEAUX.find((n) => n.value === niveau)?.label ?? niveau;
}

type FormState = { nom: string; categorie: Categorie; niveau: Niveau; visible: boolean };
const EMPTY: FormState = { nom: '', categorie: 'frontend', niveau: 'comfortable', visible: true };

type Props = { initial: Competence[] };

export default function CompetencesSection({ initial }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState(initial);
  const [filterCat, setFilterCat] = useState<Categorie | 'all'>('all');
  const [modal, setModal] = useState<{ mode: 'add' } | { mode: 'edit'; item: Competence } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const set = (field: keyof FormState, value: FormState[keyof FormState]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }); };
  const openEdit = (item: Competence) => {
    setForm({ nom: item.nom, categorie: item.categorie, niveau: item.niveau, visible: item.visible });
    setModal({ mode: 'edit', item });
  };
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
      run(async () => { await createCompetence(form); closeModal(); }, 'Compétence ajoutée');
    } else if (modal?.mode === 'edit') {
      run(async () => { await updateCompetence(modal.item.id, form); closeModal(); }, 'Compétence mise à jour');
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    run(async () => { await deleteCompetence(deleteId); setDeleteId(null); setItems((prev) => prev.filter((i) => i.id !== deleteId)); }, 'Compétence supprimée');
  };

  const handleToggle = (item: Competence) => {
    run(() => toggleCompetenceVisible(item.id, !item.visible), item.visible ? 'Masqué' : 'Visible');
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, visible: !i.visible } : i));
  };

  const filtered = filterCat === 'all' ? items : items.filter((i) => i.categorie === filterCat);

  const grouped = CATEGORIES.reduce<Record<Categorie, Competence[]>>((acc, cat) => {
    acc[cat.value] = filtered.filter((i) => i.categorie === cat.value);
    return acc;
  }, {} as Record<Categorie, Competence[]>);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-on-surface">Compétences</h1>
          <p className="mt-1 text-sm text-muted">{items.length} compétence{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-black hover:bg-accent-hover"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      {/* Filtre catégorie */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterCat('all')}
          className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${filterCat === 'all' ? 'bg-accent text-black' : 'bg-[#1a1a1a] text-muted hover:text-on-surface'}`}
        >
          Toutes
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilterCat(cat.value)}
            className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${filterCat === cat.value ? 'bg-accent text-black' : 'bg-[#1a1a1a] text-muted hover:text-on-surface'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Groupes par catégorie */}
      <div className="space-y-6">
        {CATEGORIES.filter((cat) => filterCat === 'all' || filterCat === cat.value).map((cat) => {
          const catItems = grouped[cat.value];
          if (catItems.length === 0) return null;
          return (
            <div key={cat.value}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">{cat.label}</p>
              <div className="space-y-1.5">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-[#262626] bg-[#111] px-4 py-2.5 hover:bg-[#161616]"
                  >
                    <span className="flex-1 text-sm text-on-surface">{item.nom}</span>
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] ${getNiveauStyle(item.niveau)}`}>
                      {getNiveauLabel(item.niveau)}
                    </span>
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
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">Aucune compétence pour le moment.</p>
        )}
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
                {modal.mode === 'add' ? 'Ajouter une compétence' : 'Modifier la compétence'}
              </h2>
              <button onClick={closeModal} className="text-muted hover:text-on-surface">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={LABEL}>Nom *</label>
                <input
                  className={INPUT}
                  value={form.nom}
                  onChange={(e) => set('nom', e.target.value)}
                  required
                  placeholder="React"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Catégorie</label>
                  <select className={SELECT} value={form.categorie} onChange={(e) => set('categorie', e.target.value as Categorie)}>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Niveau</label>
                  <select className={SELECT} value={form.niveau} onChange={(e) => set('niveau', e.target.value as Niveau)}>
                    {NIVEAUX.map((n) => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
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
            <h2 className="mb-2 text-sm font-semibold text-on-surface">Supprimer la compétence ?</h2>
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
