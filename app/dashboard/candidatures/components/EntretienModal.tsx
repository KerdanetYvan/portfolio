'use client';

import { useState, useTransition } from 'react';
import { X } from 'lucide-react';
import { scheduleEntretien } from '../actions';
import { useToast } from '../../components/ToastProvider';

const INPUT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const SELECT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none';
const LABEL = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';

type Props = {
  candidature_id: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EntretienModal({ candidature_id, onClose, onSuccess }: Props) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    type: 'visio' as 'telephone' | 'visio' | 'presentiel',
    date_entretien: '',
    contact: '',
    notes: '',
  });

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await scheduleEntretien(candidature_id, {
          type:           form.type,
          date_entretien: form.date_entretien,
          contact:        form.contact || null,
          notes:          form.notes || null,
        });
        showToast('Entretien programmé', 'success');
        onSuccess();
        onClose();
      } catch {
        showToast('Une erreur est survenue', 'error');
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-lg border border-[#262626] bg-[#111] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-on-surface">Programmer un entretien</h2>
          <button onClick={onClose} className="text-muted hover:text-on-surface"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Type *</label>
              <select className={SELECT} value={form.type} onChange={(e) => set('type', e.target.value)} required>
                <option value="telephone">Téléphone</option>
                <option value="visio">Visio</option>
                <option value="presentiel">Présentiel</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Date & heure *</label>
              <input
                type="datetime-local"
                className={INPUT}
                value={form.date_entretien}
                onChange={(e) => set('date_entretien', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className={LABEL}>Interlocuteur</label>
            <input className={INPUT} value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="Marie Dupont — RH" />
          </div>

          <div>
            <label className={LABEL}>Notes de préparation</label>
            <textarea
              className={`${INPUT} resize-none`}
              rows={3}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Points à préparer…"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-md border border-[#262626] px-3 py-2 text-sm text-muted hover:text-on-surface">
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black hover:bg-accent-hover disabled:opacity-40">
              {isPending ? 'Enregistrement…' : 'Programmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
