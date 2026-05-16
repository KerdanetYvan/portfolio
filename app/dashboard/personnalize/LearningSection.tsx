'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, CheckCircle, GripVertical, ExternalLink } from 'lucide-react';
import type { LearningItem } from '@/db';
import {
  createLearningItem,
  updateLearningItem,
  deleteLearningItem,
  markLearningDone,
} from '../actions/learning';
import { useToast } from '../components/ToastProvider';
import ConfirmModal from '../components/ConfirmModal';

const CATEGORIES = [
  'Frontend',
  'Backend',
  'BDD',
  'DevOps',
  'Design',
  'Mobile',
  'Sécurité',
  'Autre',
];

const STATUT_LABELS: Record<string, string> = {
  en_cours: 'En cours',
  termine: 'Terminé',
  abandonne: 'Abandonné',
};

const STATUT_COLORS: Record<string, string> = {
  en_cours: 'text-[#00D26A] bg-[#00D26A]/10',
  termine: 'text-blue-400 bg-blue-400/10',
  abandonne: 'text-muted bg-muted/10',
};

type FormData = {
  nom: string;
  categorie: string;
  description: string;
  date_debut: string;
  lien: string;
  statut: 'en_cours' | 'termine' | 'abandonne';
};

const today = () => new Date().toISOString().slice(0, 10);
const DEFAULT_FORM: FormData = {
  nom: '',
  categorie: 'Frontend',
  description: '',
  date_debut: today(),
  lien: '',
  statut: 'en_cours',
};

function LearningModal({
  initial,
  title,
  onSave,
  onClose,
  isPending,
}: {
  initial: FormData;
  title: string;
  onSave: (data: FormData) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState(initial);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-[#262626] bg-[#111] p-6 mx-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-on-surface">{title}</h3>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nom *"
            value={form.nom}
            onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
            className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none"
          />

          <div className="flex gap-2">
            <select
              value={form.categorie}
              onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
              className="flex-1 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={form.statut}
              onChange={(e) => setForm((f) => ({ ...f, statut: e.target.value as FormData['statut'] }))}
              className="flex-1 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none"
            >
              {Object.entries(STATUT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          <textarea
            placeholder="Description courte"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full resize-none rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none"
          />

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
                Date début
              </label>
              <input
                type="date"
                value={form.date_debut}
                onChange={(e) => setForm((f) => ({ ...f, date_debut: e.target.value }))}
                className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
                Lien (optionnel)
              </label>
              <input
                type="url"
                placeholder="https://…"
                value={form.lien}
                onChange={(e) => setForm((f) => ({ ...f, lien: e.target.value }))}
                className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onSave(form)}
            disabled={!form.nom.trim() || isPending}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            Enregistrer
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-[#262626] px-4 py-2 text-sm text-muted transition-colors hover:text-on-surface"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LearningSection({ items }: { items: LearningItem[] }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editingItem, setEditingItem] = useState<LearningItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const run = (fn: () => Promise<void>, msg: string) => {
    startTransition(async () => {
      await fn();
      showToast(msg);
      router.refresh();
    });
  };

  const filtered =
    filterStatut === 'all'
      ? items
      : items.filter((i) => i.statut === filterStatut);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-on-surface">Currently Learning</h2>
        <p className="mt-0.5 text-sm text-muted">
          Ce que vous êtes en train d&apos;apprendre.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent-hover"
        >
          <Plus size={15} />
          Ajouter un apprentissage
        </button>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="ml-auto rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-1.5 text-xs text-muted focus:border-accent focus:outline-none"
        >
          <option value="all">Tous</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminés</option>
          <option value="abandonne">Abandonnés</option>
        </select>
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-muted">Aucun item dans cette catégorie.</p>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-[#262626] bg-[#111] px-4 py-3 hover:bg-[#161616] transition-colors"
          >
            {/* Drag handle placeholder */}
            <GripVertical size={15} className="mt-0.5 shrink-0 text-muted/40 cursor-grab" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-on-surface">{item.nom}</span>
                <span className="rounded-full border border-[#262626] px-2 py-0.5 font-mono text-[10px] text-muted">
                  {item.categorie}
                </span>
                <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${STATUT_COLORS[item.statut]}`}>
                  {STATUT_LABELS[item.statut]}
                </span>
              </div>
              {item.description && (
                <p className="mt-1 text-xs text-muted line-clamp-2">{item.description}</p>
              )}
              <div className="mt-1.5 flex items-center gap-3">
                <span className="font-mono text-[10px] text-muted/60">
                  Commencé le{' '}
                  {new Date(item.date_debut).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {item.lien && (
                  <a
                    href={item.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-mono text-[10px] text-accent hover:text-accent-hover transition-colors"
                  >
                    <ExternalLink size={10} />
                    Lien
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              {item.statut === 'en_cours' && (
                <button
                  onClick={() => run(() => markLearningDone(item.id), 'Marqué comme terminé')}
                  disabled={isPending}
                  className="rounded-md p-1.5 text-muted transition-colors hover:text-[#00D26A]"
                  title="Marquer terminé"
                >
                  <CheckCircle size={14} />
                </button>
              )}
              <button
                onClick={() => setEditingItem(item)}
                className="rounded-md p-1.5 text-muted transition-colors hover:text-on-surface"
                title="Modifier"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setConfirmDeleteId(item.id)}
                className="rounded-md p-1.5 text-muted transition-colors hover:text-red-400"
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreate && (
        <LearningModal
          title="Ajouter un apprentissage"
          initial={DEFAULT_FORM}
          isPending={isPending}
          onClose={() => setShowCreate(false)}
          onSave={(data) =>
            run(async () => {
              await createLearningItem({
                nom: data.nom,
                categorie: data.categorie,
                description: data.description,
                date_debut: data.date_debut,
                lien: data.lien || null,
                statut: data.statut,
              });
              setShowCreate(false);
            }, 'Apprentissage ajouté')
          }
        />
      )}

      {editingItem && (
        <LearningModal
          title="Modifier l'apprentissage"
          initial={{
            nom: editingItem.nom,
            categorie: editingItem.categorie,
            description: editingItem.description,
            date_debut: editingItem.date_debut,
            lien: editingItem.lien ?? '',
            statut: editingItem.statut as FormData['statut'],
          }}
          isPending={isPending}
          onClose={() => setEditingItem(null)}
          onSave={(data) =>
            run(async () => {
              await updateLearningItem(editingItem.id, {
                nom: data.nom,
                categorie: data.categorie,
                description: data.description,
                date_debut: data.date_debut,
                lien: data.lien || null,
                statut: data.statut,
              });
              setEditingItem(null);
            }, 'Apprentissage modifié')
          }
        />
      )}

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        title="Supprimer l'apprentissage"
        message="Cette action est irréversible."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            run(() => deleteLearningItem(confirmDeleteId), 'Apprentissage supprimé');
            setConfirmDeleteId(null);
          }
        }}
      />
    </div>
  );
}
