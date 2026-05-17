'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/db';
import { upsertProfile } from '../actions';
import { useToast } from '../../components/ToastProvider';

const INPUT = 'w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none';
const LABEL = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted';

type Props = { initial: Profile | null };

export default function ProfileSection({ initial }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    nom:           initial?.nom           ?? '',
    prenom:        initial?.prenom        ?? '',
    titre:         initial?.titre         ?? '',
    email:         initial?.email         ?? '',
    telephone:     initial?.telephone     ?? '',
    localisation:  initial?.localisation  ?? '',
    linkedin_url:  initial?.linkedin_url  ?? '',
    github_url:    initial?.github_url    ?? '',
    portfolio_url: initial?.portfolio_url ?? '',
    bio:           initial?.bio           ?? '',
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await upsertProfile({
          nom:           form.nom,
          prenom:        form.prenom,
          titre:         form.titre,
          email:         form.email,
          telephone:     form.telephone     || null,
          localisation:  form.localisation  || null,
          linkedin_url:  form.linkedin_url  || null,
          github_url:    form.github_url    || null,
          portfolio_url: form.portfolio_url || null,
          bio:           form.bio           || null,
        });
        showToast('Profil enregistré', 'success');
        router.refresh();
      } catch {
        showToast('Une erreur est survenue', 'error');
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-on-surface">Mon profil</h1>
        <p className="mt-1 text-sm text-muted">
          Informations générales affichées en en-tête du CV.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité */}
        <fieldset className="space-y-4 rounded-lg border border-[#262626] p-4">
          <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            Identité
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Prénom *</label>
              <input className={INPUT} value={form.prenom} onChange={(e) => set('prenom', e.target.value)} required placeholder="Yvan" />
            </div>
            <div>
              <label className={LABEL}>Nom *</label>
              <input className={INPUT} value={form.nom} onChange={(e) => set('nom', e.target.value)} required placeholder="Kerdanet" />
            </div>
          </div>
          <div>
            <label className={LABEL}>Titre professionnel *</label>
            <input className={INPUT} value={form.titre} onChange={(e) => set('titre', e.target.value)} required placeholder="Développeur Full-Stack" />
          </div>
        </fieldset>

        {/* Contact */}
        <fieldset className="space-y-4 rounded-lg border border-[#262626] p-4">
          <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            Contact
          </legend>
          <div>
            <label className={LABEL}>Email *</label>
            <input type="email" className={INPUT} value={form.email} onChange={(e) => set('email', e.target.value)} required placeholder="yvan@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Téléphone</label>
              <input className={INPUT} value={form.telephone} onChange={(e) => set('telephone', e.target.value)} placeholder="+33 6 00 00 00 00" />
            </div>
            <div>
              <label className={LABEL}>Ville</label>
              <input className={INPUT} value={form.localisation} onChange={(e) => set('localisation', e.target.value)} placeholder="Rennes, France" />
            </div>
          </div>
        </fieldset>

        {/* Liens */}
        <fieldset className="space-y-4 rounded-lg border border-[#262626] p-4">
          <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            Liens
          </legend>
          <div>
            <label className={LABEL}>LinkedIn</label>
            <input type="url" className={INPUT} value={form.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/…" />
          </div>
          <div>
            <label className={LABEL}>GitHub</label>
            <input type="url" className={INPUT} value={form.github_url} onChange={(e) => set('github_url', e.target.value)} placeholder="https://github.com/…" />
          </div>
          <div>
            <label className={LABEL}>Portfolio</label>
            <input type="url" className={INPUT} value={form.portfolio_url} onChange={(e) => set('portfolio_url', e.target.value)} placeholder="https://…" />
          </div>
        </fieldset>

        {/* Accroche */}
        <fieldset className="space-y-3 rounded-lg border border-[#262626] p-4">
          <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            Accroche
          </legend>
          <textarea
            className={`${INPUT} resize-none`}
            rows={5}
            value={form.bio}
            onChange={(e) => set('bio', e.target.value)}
            placeholder="Développeur passionné par…"
          />
        </fieldset>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            {isPending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {initial && (
            <p className="font-mono text-[10px] text-muted/60">
              Dernière modif. {new Date(initial.updated_at).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
