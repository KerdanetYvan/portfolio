'use client';

import { useState, useTransition } from 'react';
import { X } from 'lucide-react';
import type { Candidature } from '@/db';
import { createCandidature, updateCandidature } from '../actions';
import { useToast } from '../../components/ToastProvider';

const INPUT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const SELECT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface focus:border-accent focus:outline-none';
const LABEL = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';

type StatutKey = 'a_envoyer' | 'envoyee' | 'entretien_programme' | 'en_cours' | 'acceptee' | 'refusee' | 'ghosted';
type TypePoste = 'presentiel' | 'remote' | 'hybride';

type FormState = {
  entreprise: string;
  poste: string;
  url_offre: string;
  detail_offre: string;
  localisation: string;
  type_poste: TypePoste;
  contact_nom: string;
  contact_email: string;
  contact_linkedin: string;
  statut: StatutKey;
  date_candidature: string;
  date_relance: string;
  notes: string;
};

const EMPTY: FormState = {
  entreprise: '',
  poste: '',
  url_offre: '',
  detail_offre: '',
  localisation: '',
  type_poste: 'hybride',
  contact_nom: '',
  contact_email: '',
  contact_linkedin: '',
  statut: 'a_envoyer',
  date_candidature: '',
  date_relance: '',
  notes: '',
};

function fromCandidature(c: Candidature): FormState {
  return {
    entreprise:       c.entreprise,
    poste:            c.poste,
    url_offre:        c.url_offre ?? '',
    detail_offre:     c.detail_offre ?? '',
    localisation:     c.localisation ?? '',
    type_poste:       c.type_poste,
    contact_nom:      c.contact_nom ?? '',
    contact_email:    c.contact_email ?? '',
    contact_linkedin: c.contact_linkedin ?? '',
    statut:           c.statut,
    date_candidature: c.date_candidature ?? '',
    date_relance:     c.date_relance ?? '',
    notes:            c.notes ?? '',
  };
}

type Props = {
  mode: 'create' | 'edit';
  initial?: Candidature;
  onClose: () => void;
  onCreated?: (id: string) => void;
  onUpdated?: () => void;
};

export default function CandidatureModal({ mode, initial, onClose, onCreated, onUpdated }: Props) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(initial ? fromCandidature(initial) : EMPTY);

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const needsDate = form.statut !== 'a_envoyer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (needsDate && !form.date_candidature) {
      showToast('La date d\'envoi est requise pour ce statut', 'error');
      return;
    }

    const data = {
      entreprise:       form.entreprise,
      poste:            form.poste,
      type_poste:       form.type_poste,
      localisation:     form.localisation || null,
      url_offre:        form.url_offre || null,
      detail_offre:     form.detail_offre || null,
      statut:           form.statut,
      date_candidature: form.date_candidature || null,
      date_relance:     form.date_relance || null,
      contact_nom:      form.contact_nom || null,
      contact_email:    form.contact_email || null,
      contact_linkedin: form.contact_linkedin || null,
      notes:            form.notes || null,
    };

    startTransition(async () => {
      try {
        if (mode === 'create') {
          const { id } = await createCandidature(data);
          showToast('Candidature créée', 'success');
          onCreated?.(id);
        } else {
          await updateCandidature(initial!.id, data);
          showToast('Candidature mise à jour', 'success');
          onUpdated?.();
        }
        onClose();
      } catch {
        showToast('Une erreur est survenue', 'error');
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm py-8"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-2xl rounded-lg border border-[#262626] bg-[#111] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-on-surface">
            {mode === 'create' ? 'Nouvelle candidature' : 'Modifier la candidature'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: L'offre */}
          <fieldset className="space-y-4 rounded-lg border border-[#262626] p-4">
            <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted">L'offre</legend>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Entreprise *</label>
                <input className={INPUT} value={form.entreprise} onChange={(e) => set('entreprise', e.target.value)} required placeholder="Acme Corp" />
              </div>
              <div>
                <label className={LABEL}>Poste *</label>
                <input className={INPUT} value={form.poste} onChange={(e) => set('poste', e.target.value)} required placeholder="Développeur Full-Stack" />
              </div>
            </div>

            <div>
              <label className={LABEL}>URL de l'offre</label>
              <input type="url" className={INPUT} value={form.url_offre} onChange={(e) => set('url_offre', e.target.value)} placeholder="https://…" />
            </div>

            <div>
              <label className={LABEL}>Détail de l'offre *</label>
              <textarea
                className={`${INPUT} resize-none`}
                rows={6}
                value={form.detail_offre}
                onChange={(e) => set('detail_offre', e.target.value)}
                required
                placeholder="Copier-coller l'intégralité de l'offre ici (description du poste, compétences requises, stack technique…)"
              />
            </div>
          </fieldset>

          {/* Section: Localisation */}
          <fieldset className="space-y-4 rounded-lg border border-[#262626] p-4">
            <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted">Localisation</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Ville</label>
                <input className={INPUT} value={form.localisation} onChange={(e) => set('localisation', e.target.value)} placeholder="Rennes, France" />
              </div>
              <div>
                <label className={LABEL}>Type de poste *</label>
                <select className={SELECT} value={form.type_poste} onChange={(e) => set('type_poste', e.target.value)} required>
                  <option value="presentiel">Présentiel</option>
                  <option value="remote">Remote</option>
                  <option value="hybride">Hybride</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Section: Contact */}
          <fieldset className="space-y-4 rounded-lg border border-[#262626] p-4">
            <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted">Contact (optionnel)</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Nom</label>
                <input className={INPUT} value={form.contact_nom} onChange={(e) => set('contact_nom', e.target.value)} placeholder="Marie Dupont" />
              </div>
              <div>
                <label className={LABEL}>Email</label>
                <input type="email" className={INPUT} value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} placeholder="marie@acme.com" />
              </div>
            </div>
            <div>
              <label className={LABEL}>LinkedIn</label>
              <input type="url" className={INPUT} value={form.contact_linkedin} onChange={(e) => set('contact_linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" />
            </div>
          </fieldset>

          {/* Section: Suivi */}
          <fieldset className="space-y-4 rounded-lg border border-[#262626] p-4">
            <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted">Suivi</legend>

            <div>
              <label className={LABEL}>Statut initial</label>
              <select className={SELECT} value={form.statut} onChange={(e) => set('statut', e.target.value)}>
                <option value="a_envoyer">À envoyer</option>
                <option value="envoyee">Envoyée</option>
                <option value="entretien_programme">Entretien programmé</option>
                <option value="en_cours">En cours</option>
                <option value="acceptee">Acceptée</option>
                <option value="refusee">Refusée</option>
                <option value="ghosted">Ghosted</option>
              </select>
            </div>

            {needsDate && (
              <div>
                <label className={LABEL}>Date d'envoi *</label>
                <input type="date" className={INPUT} value={form.date_candidature} onChange={(e) => set('date_candidature', e.target.value)} required={needsDate} />
              </div>
            )}

            <div>
              <label className={LABEL}>Date de relance prévue</label>
              <input type="date" className={INPUT} value={form.date_relance} onChange={(e) => set('date_relance', e.target.value)} />
            </div>

            <div>
              <label className={LABEL}>Notes</label>
              <textarea className={`${INPUT} resize-none`} rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Observations, points clés, points à préparer…" />
            </div>
          </fieldset>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#262626] px-4 py-2 text-sm text-muted hover:text-on-surface"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-black hover:bg-accent-hover disabled:opacity-40"
            >
              {isPending ? 'Enregistrement…' : mode === 'create' ? 'Créer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
