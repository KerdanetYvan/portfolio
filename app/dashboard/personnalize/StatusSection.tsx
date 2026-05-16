'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Pencil, Trash2, Plus, X } from 'lucide-react';
import type { StatusRow } from '@/db';
import {
  activateStatus,
  createStatus,
  updateStatus,
  deleteStatus,
} from '../actions/status';
import { useToast } from '../components/ToastProvider';
import ConfirmModal from '../components/ConfirmModal';

const COLOR_HEX: Record<string, string> = {
  vert: '#00D26A',
  jaune: '#f0c040',
  rouge: '#ef4444',
};

const COLOR_LABELS: Record<string, string> = {
  vert: 'Vert',
  jaune: 'Jaune',
  rouge: 'Rouge',
};

const CODE_LABELS: Record<string, string> = {
  recherche: 'En recherche',
  cale: 'Calé',
  occupe: 'Occupé',
  pause: 'En pause',
};

type FormData = { libelle: string; statut_code: string; couleur: string };
const DEFAULT_FORM: FormData = { libelle: '', statut_code: 'recherche', couleur: 'vert' };

function formatRelative(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days === 1) return 'hier';
  return `il y a ${days} jours`;
}

function StatusForm({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState(initial);

  return (
    <div className="rounded-lg border border-[#262626] bg-[#0f0f0f] p-4 space-y-3">
      <input
        type="text"
        placeholder="Libellé du statut"
        value={form.libelle}
        onChange={(e) => setForm((f) => ({ ...f, libelle: e.target.value }))}
        className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <div className="flex gap-2">
        <select
          value={form.statut_code}
          onChange={(e) => setForm((f) => ({ ...f, statut_code: e.target.value }))}
          className="flex-1 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none"
        >
          {Object.entries(CODE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={form.couleur}
          onChange={(e) => setForm((f) => ({ ...f, couleur: e.target.value }))}
          className="flex-1 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none"
        >
          {Object.entries(COLOR_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(form)}
          disabled={!form.libelle.trim() || isPending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          Enregistrer
        </button>
        <button
          onClick={onCancel}
          className="rounded-md border border-[#262626] px-4 py-2 text-sm text-muted transition-colors hover:text-on-surface"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

export default function StatusSection({ statuses }: { statuses: StatusRow[] }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const activeStatus = statuses.find((s) => s.actif);

  const run = (fn: () => Promise<void>, msg: string) => {
    startTransition(async () => {
      await fn();
      showToast(msg);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-on-surface">Statut</h2>
        <p className="mt-0.5 text-sm text-muted">
          Gérez les statuts affichés sur la page /contact.
        </p>
      </div>

      {/* Preview statut actif */}
      {activeStatus && (
        <div className="rounded-lg border border-[#262626] bg-[#0f0f0f] p-4">
          <p className="mb-2 font-mono text-[10px] text-muted uppercase tracking-wider">
            Affiché sur /contact
          </p>
          <div className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLOR_HEX[activeStatus.couleur] }}
            />
            <span className="text-sm text-on-surface">{activeStatus.libelle}</span>
            <span className="ml-2 font-mono text-xs text-muted">
              ({CODE_LABELS[activeStatus.statut_code]})
            </span>
          </div>
        </div>
      )}

      {/* Bouton + liste */}
      <div className="space-y-2">
        <button
          onClick={() => { setShowCreate(true); setEditingId(null); }}
          className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
        >
          <Plus size={15} />
          Nouveau statut
        </button>

        {showCreate && (
          <StatusForm
            initial={DEFAULT_FORM}
            isPending={isPending}
            onCancel={() => setShowCreate(false)}
            onSave={(data) =>
              run(async () => {
                await createStatus({
                  libelle: data.libelle,
                  statut_code: data.statut_code as 'recherche' | 'cale' | 'occupe' | 'pause',
                  couleur: data.couleur as 'vert' | 'jaune' | 'rouge',
                });
                setShowCreate(false);
              }, 'Statut créé')
            }
          />
        )}

        {statuses.map((status) => (
          <div key={status.id}>
            {editingId === status.id ? (
              <StatusForm
                initial={{
                  libelle: status.libelle,
                  statut_code: status.statut_code,
                  couleur: status.couleur,
                }}
                isPending={isPending}
                onCancel={() => setEditingId(null)}
                onSave={(data) =>
                  run(async () => {
                    await updateStatus(status.id, {
                      libelle: data.libelle,
                      statut_code: data.statut_code as 'recherche' | 'cale' | 'occupe' | 'pause',
                      couleur: data.couleur as 'vert' | 'jaune' | 'rouge',
                    });
                    setEditingId(null);
                  }, 'Statut modifié')
                }
              />
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-[#262626] bg-[#111] px-4 py-3 hover:bg-[#161616] transition-colors">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLOR_HEX[status.couleur] }}
                />
                <span className="flex-1 text-sm text-on-surface">{status.libelle}</span>
                <span className="font-mono text-xs text-muted">{CODE_LABELS[status.statut_code]}</span>
                <span className="font-mono text-xs text-muted/60">
                  {formatRelative(status.date_modif)}
                </span>

                {status.actif ? (
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
                    Actif
                  </span>
                ) : (
                  <button
                    onClick={() => run(() => activateStatus(status.id), 'Statut activé')}
                    disabled={isPending}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:text-on-surface"
                    title="Activer"
                  >
                    <Check size={13} />
                    Activer
                  </button>
                )}

                <button
                  onClick={() => setEditingId(status.id)}
                  className="rounded-md p-1.5 text-muted transition-colors hover:text-on-surface"
                  title="Modifier"
                >
                  <Pencil size={13} />
                </button>

                {!status.actif && (
                  <button
                    onClick={() => setConfirmDeleteId(status.id)}
                    className="rounded-md p-1.5 text-muted transition-colors hover:text-red-400"
                    title="Supprimer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        title="Supprimer le statut"
        message="Cette action est irréversible. Le statut sera définitivement supprimé."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            run(() => deleteStatus(confirmDeleteId), 'Statut supprimé');
            setConfirmDeleteId(null);
          }
        }}
      />
    </div>
  );
}
