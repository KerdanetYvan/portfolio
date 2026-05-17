'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Pencil, Trash2, ExternalLink, Send, RefreshCw, CheckCheck,
  Phone, Monitor, MapPin, FileText, X, Copy, Check,
} from 'lucide-react';
import type { CandidatureWithDetails } from '@/db/queries/candidatures';
import {
  changeStatus, markAsSent, markRelanceDone, deleteCandidature, updateCandidature, updateEntretienStatus,
} from '../actions';
import { useToast } from '../../components/ToastProvider';
import EntretienModal from './EntretienModal';

// ─── Types utilitaires ────────────────────────────────────────────────────────

type Statut = 'a_envoyer' | 'envoyee' | 'entretien_programme' | 'en_cours' | 'acceptee' | 'refusee' | 'ghosted';

const STATUT_LABELS: Record<Statut, string> = {
  a_envoyer:           'À envoyer',
  envoyee:             'Envoyée',
  entretien_programme: 'Entretien programmé',
  en_cours:            'En cours',
  acceptee:            'Acceptée',
  refusee:             'Refusée',
  ghosted:             'Ghosted',
};

const STATUT_COLORS: Record<Statut, string> = {
  a_envoyer:           'text-muted bg-[#1a1a1a]',
  envoyee:             'text-blue-400 bg-blue-400/10',
  entretien_programme: 'text-violet-400 bg-violet-400/10',
  en_cours:            'text-cyan-400 bg-cyan-400/10',
  acceptee:            'text-[#00D26A] bg-[#00D26A]/10',
  refusee:             'text-red-400 bg-red-400/10',
  ghosted:             'text-orange-500 bg-orange-500/10',
};

const TYPE_POSTE_LABELS: Record<string, string> = {
  presentiel: 'Présentiel',
  remote: 'Remote',
  hybride: 'Hybride',
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  created:              'Candidature créée',
  sent:                 'Candidature envoyée',
  status_changed:       'Changement de statut',
  entretien_scheduled:  'Entretien programmé',
  entretien_done:       'Entretien effectué',
  relance_done:         'Relance effectuée',
  note_added:           'Note ajoutée',
};

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  candidature: CandidatureWithDetails;
  onEdit: () => void;
  onDeleted: () => void;
};

// ─── Composant principal ──────────────────────────────────────────────────────

export default function CandidatureDetail({ candidature, onEdit, onDeleted }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEntretienModal, setShowEntretienModal] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(candidature.notes ?? '');
  const [copied, setCopied] = useState(false);

  const run = (fn: () => Promise<void>, msg: string) => {
    startTransition(async () => {
      try {
        await fn();
        showToast(msg, 'success');
        router.refresh();
      } catch {
        showToast('Une erreur est survenue', 'error');
      }
    });
  };

  const handleChangeStatus = (s: Statut) => {
    setShowStatusSelect(false);
    run(() => changeStatus(candidature.id, s), 'Statut mis à jour');
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCandidature(candidature.id);
        showToast('Candidature supprimée', 'success');
        onDeleted();
      } catch {
        showToast('Une erreur est survenue', 'error');
      }
    });
  };

  const handleSaveNotes = () => {
    run(() => updateCandidature(candidature.id, { notes: notes || null }), 'Notes sauvegardées');
    setEditingNotes(false);
  };

  const handleCopyOffre = () => {
    if (!candidature.detail_offre) return;
    navigator.clipboard.writeText(candidature.detail_offre).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const statut = candidature.statut as Statut;
  const today = new Date().toISOString().split('T')[0];
  const relanceAFaire =
    candidature.date_relance !== null &&
    candidature.date_relance <= today &&
    !candidature.relance_effectuee &&
    !['acceptee', 'refusee', 'ghosted'].includes(statut);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 border-b border-[#262626] px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-on-surface">{candidature.poste}</h2>
            <p className="mt-0.5 text-sm text-muted">{candidature.entreprise}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {/* Badge statut cliquable */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusSelect((v) => !v)}
                  className={`rounded px-2.5 py-1 font-mono text-[11px] font-medium ${STATUT_COLORS[statut]} hover:opacity-80`}
                >
                  {STATUT_LABELS[statut]}
                </button>
                {showStatusSelect && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border border-[#262626] bg-[#111] py-1 shadow-lg">
                    {(Object.entries(STATUT_LABELS) as [Statut, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleChangeStatus(key)}
                        className={`w-full px-3 py-1.5 text-left text-xs hover:bg-[#1a1a1a] ${key === statut ? 'text-accent' : 'text-on-surface'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="rounded bg-[#1a1a1a] px-2 py-0.5 font-mono text-[10px] text-muted">
                {TYPE_POSTE_LABELS[candidature.type_poste]}
              </span>

              {relanceAFaire && (
                <span className="rounded bg-orange-500/10 px-2 py-0.5 font-mono text-[10px] text-orange-400">
                  Relance à faire
                </span>
              )}

              {candidature.date_candidature && (
                <span className="font-mono text-[10px] text-muted/60">
                  Envoyée le {new Date(candidature.date_candidature).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>
          </div>

          {/* Actions header */}
          <div className="flex shrink-0 items-center gap-1">
            <button onClick={onEdit} className="rounded p-2 text-muted hover:bg-[#222] hover:text-on-surface" title="Modifier">
              <Pencil size={14} />
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="rounded p-2 text-muted hover:bg-red-900/30 hover:text-red-400" title="Supprimer">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Corps scrollable ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0 divide-y divide-[#1a1a1a]">

          {/* Section: Détails de l'offre */}
          <section className="px-6 py-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted">Détails de l'offre</p>
            <div className="space-y-2 text-sm">
              {candidature.localisation && (
                <div className="flex items-center gap-2 text-muted">
                  <MapPin size={12} className="shrink-0" />
                  <span>{candidature.localisation}</span>
                </div>
              )}
              {candidature.url_offre && (
                <div className="flex items-center gap-2">
                  <ExternalLink size={12} className="shrink-0 text-muted" />
                  <a href={candidature.url_offre} target="_blank" rel="noopener noreferrer" className="truncate text-accent hover:underline">
                    Voir l'offre
                  </a>
                </div>
              )}
            </div>

            {candidature.detail_offre && (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] text-muted/60">Descriptif</p>
                  <button
                    onClick={handleCopyOffre}
                    className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-muted hover:text-on-surface"
                  >
                    {copied ? <Check size={10} className="text-[#00D26A]" /> : <Copy size={10} />}
                    {copied ? 'Copié' : 'Copier'}
                  </button>
                </div>
                <pre className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap rounded bg-[#0a0a0a] p-3 font-mono text-[11px] text-muted/80">
                  {candidature.detail_offre}
                </pre>
              </div>
            )}
          </section>

          {/* Section: Contact */}
          <section className="px-6 py-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted">Contact</p>
            {candidature.contact_nom || candidature.contact_email || candidature.contact_linkedin ? (
              <div className="space-y-1.5 text-sm">
                {candidature.contact_nom && <p className="font-medium text-on-surface">{candidature.contact_nom}</p>}
                {candidature.contact_email && (
                  <a href={`mailto:${candidature.contact_email}`} className="block text-accent hover:underline">
                    {candidature.contact_email}
                  </a>
                )}
                {candidature.contact_linkedin && (
                  <a href={candidature.contact_linkedin} target="_blank" rel="noopener noreferrer" className="block text-muted hover:text-on-surface">
                    LinkedIn ↗
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted/60">Aucun contact renseigné</p>
            )}
          </section>

          {/* Section: Entretiens */}
          {candidature.entretiens.length > 0 && (
            <section className="px-6 py-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted">Entretiens</p>
              <div className="space-y-2">
                {candidature.entretiens.map((e) => {
                  const TypeIcon = e.type === 'telephone' ? Phone : e.type === 'visio' ? Monitor : MapPin;
                  return (
                    <div key={e.id} className="flex items-start gap-3 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2.5">
                      <TypeIcon size={13} className="mt-0.5 shrink-0 text-muted" />
                      <div className="min-w-0 flex-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-on-surface">
                            {e.type === 'telephone' ? 'Téléphone' : e.type === 'visio' ? 'Visio' : 'Présentiel'}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] ${
                            e.status === 'fait' ? 'bg-[#00D26A]/10 text-[#00D26A]' :
                            e.status === 'annule' ? 'bg-red-400/10 text-red-400' :
                            'bg-blue-400/10 text-blue-400'
                          }`}>
                            {e.status === 'fait' ? 'Fait' : e.status === 'annule' ? 'Annulé' : 'Prévu'}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-muted">
                          {new Date(e.date_entretien).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          {e.contact && ` — ${e.contact}`}
                        </p>
                      </div>
                      {e.status === 'prevu' && (
                        <button
                          onClick={() => run(() => updateEntretienStatus(e.id, candidature.id, 'fait'), 'Entretien marqué effectué')}
                          className="shrink-0 rounded p-1 text-muted hover:bg-[#222] hover:text-[#00D26A]"
                          title="Marquer effectué"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section: Timeline */}
          <section className="px-6 py-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted">Historique</p>
            {candidature.events.length === 0 ? (
              <p className="text-sm text-muted/60">Aucun événement enregistré.</p>
            ) : (
              <ol className="relative border-l border-[#262626] pl-5 space-y-3">
                {candidature.events.map((ev) => (
                  <li key={ev.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-[#262626] bg-[#262626]" />
                    <p className="text-sm text-on-surface">{ev.description ?? EVENT_TYPE_LABELS[ev.type] ?? ev.type}</p>
                    <p className="font-mono text-[10px] text-muted/60">
                      {new Date(ev.date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Section: CV généré */}
          <section className="px-6 py-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted">CV généré</p>
            {candidature.cv ? (
              <div className="flex items-center gap-3 text-sm">
                <FileText size={14} className="text-muted" />
                <span className="text-on-surface">{candidature.cv.nom_fichier ?? 'cv.pdf'}</span>
                <span className="font-mono text-[10px] text-muted/60">
                  {new Date(candidature.cv.created_at).toLocaleDateString('fr-FR')}
                </span>
                <button disabled className="ml-auto rounded border border-[#262626] px-2.5 py-1 text-xs text-muted/50 cursor-not-allowed">
                  Régénérer
                </button>
              </div>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 rounded-md border border-dashed border-[#262626] px-4 py-2.5 text-sm text-muted/50 cursor-not-allowed"
                title="Disponible prochainement"
              >
                <FileText size={14} />
                Générer un CV pour cette candidature
                <span className="ml-1 font-mono text-[10px] opacity-60">bientôt</span>
              </button>
            )}
          </section>

          {/* Section: Notes */}
          <section className="px-6 py-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Notes</p>
              {!editingNotes && (
                <button onClick={() => setEditingNotes(true)} className="font-mono text-[10px] text-muted hover:text-on-surface">
                  Éditer
                </button>
              )}
            </div>
            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  className="w-full resize-none rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-on-surface placeholder:text-muted focus:border-accent focus:outline-none"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observations, points clés, rappels…"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveNotes} disabled={isPending} className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-black hover:bg-accent-hover disabled:opacity-40">
                    Sauvegarder
                  </button>
                  <button onClick={() => { setEditingNotes(false); setNotes(candidature.notes ?? ''); }} className="rounded-md border border-[#262626] px-3 py-1.5 text-xs text-muted hover:text-on-surface">
                    Annuler
                  </button>
                </div>
              </div>
            ) : notes ? (
              <p className="whitespace-pre-wrap text-sm text-on-surface/80">{notes}</p>
            ) : (
              <p className="text-sm text-muted/60">Aucune note.</p>
            )}
          </section>

          {/* Section: Actions rapides */}
          <section className="px-6 py-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted">Actions rapides</p>
            <div className="flex flex-wrap gap-2">
              {statut === 'a_envoyer' && (
                <button
                  onClick={() => run(() => markAsSent(candidature.id), 'Candidature marquée envoyée')}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-md border border-blue-400/30 bg-blue-400/5 px-3 py-2 text-sm text-blue-400 hover:bg-blue-400/10 disabled:opacity-40"
                >
                  <Send size={13} />
                  Marquer comme envoyée
                </button>
              )}

              <button
                onClick={() => setShowEntretienModal(true)}
                className="flex items-center gap-2 rounded-md border border-violet-400/30 bg-violet-400/5 px-3 py-2 text-sm text-violet-400 hover:bg-violet-400/10"
              >
                <Monitor size={13} />
                Programmer un entretien
              </button>

              {relanceAFaire && (
                <button
                  onClick={() => run(() => markRelanceDone(candidature.id), 'Relance marquée effectuée')}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-md border border-orange-400/30 bg-orange-400/5 px-3 py-2 text-sm text-orange-400 hover:bg-orange-400/10 disabled:opacity-40"
                >
                  <CheckCheck size={13} />
                  Relance effectuée
                </button>
              )}

              <button
                onClick={() => setShowStatusSelect((v) => !v)}
                className="flex items-center gap-2 rounded-md border border-[#262626] px-3 py-2 text-sm text-muted hover:bg-[#222] hover:text-on-surface"
              >
                <RefreshCw size={13} />
                Changer le statut
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* ── Modal suppression ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="mx-4 w-full max-w-sm rounded-lg border border-[#262626] bg-[#111] p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-sm font-semibold text-on-surface">Supprimer la candidature ?</h3>
            <p className="mb-4 text-sm text-muted">Tous les entretiens et événements associés seront également supprimés. Cette action est irréversible.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="rounded-md border border-[#262626] px-3 py-2 text-sm text-muted hover:text-on-surface">
                Annuler
              </button>
              <button onClick={handleDelete} disabled={isPending} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal entretien ── */}
      {showEntretienModal && (
        <EntretienModal
          candidature_id={candidature.id}
          onClose={() => setShowEntretienModal(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
