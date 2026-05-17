'use server';

import { db, candidatures, entretiens, events } from '@/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  if (process.env.ADMIN_USER_ID && user.id !== process.env.ADMIN_USER_ID) throw new Error('Forbidden');
}

function revalidateAll() {
  revalidatePath('/dashboard/candidatures');
  revalidatePath('/dashboard');
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

async function insertEvent(
  candidature_id: string,
  type: 'created' | 'sent' | 'status_changed' | 'entretien_scheduled' | 'entretien_done' | 'relance_done' | 'note_added',
  description?: string,
) {
  await db.insert(events).values({ candidature_id, type, description });
}

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateInput = {
  entreprise: string;
  poste: string;
  type_poste: 'presentiel' | 'remote' | 'hybride';
  localisation?: string | null;
  url_offre?: string | null;
  detail_offre?: string | null;
  statut?: 'a_envoyer' | 'envoyee' | 'entretien_programme' | 'en_cours' | 'acceptee' | 'refusee' | 'ghosted';
  date_candidature?: string | null;
  date_relance?: string | null;
  contact_nom?: string | null;
  contact_email?: string | null;
  contact_linkedin?: string | null;
  salaire_cible?: number | null;
  notes?: string | null;
};

type UpdateInput = Partial<CreateInput>;

type EntretienInput = {
  type: 'telephone' | 'visio' | 'presentiel';
  date_entretien: string;
  contact?: string | null;
  notes?: string | null;
};

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function createCandidature(data: CreateInput): Promise<{ id: string }> {
  await requireAdmin();
  const [inserted] = await db.insert(candidatures).values(data).returning({ id: candidatures.id });
  await insertEvent(inserted.id, 'created', `Candidature créée — ${data.poste} chez ${data.entreprise}`);
  revalidateAll();
  return { id: inserted.id };
}

export async function updateCandidature(id: string, data: UpdateInput): Promise<void> {
  await requireAdmin();
  await db.update(candidatures)
    .set({ ...data, updated_at: new Date() })
    .where(eq(candidatures.id, id));
  revalidateAll();
}

export async function deleteCandidature(id: string): Promise<void> {
  await requireAdmin();
  await db.delete(candidatures).where(eq(candidatures.id, id));
  revalidateAll();
}

export async function changeStatus(
  id: string,
  newStatus: 'a_envoyer' | 'envoyee' | 'entretien_programme' | 'en_cours' | 'acceptee' | 'refusee' | 'ghosted',
): Promise<void> {
  await requireAdmin();

  const LABELS: Record<string, string> = {
    a_envoyer:            'À envoyer',
    envoyee:              'Envoyée',
    entretien_programme:  'Entretien programmé',
    en_cours:             'En cours',
    acceptee:             'Acceptée',
    refusee:              'Refusée',
    ghosted:              'Ghosted',
  };

  await db.update(candidatures)
    .set({ statut: newStatus, updated_at: new Date() })
    .where(eq(candidatures.id, id));
  await insertEvent(id, 'status_changed', `Statut changé en « ${LABELS[newStatus]} »`);
  revalidateAll();
}

export async function markAsSent(id: string): Promise<void> {
  await requireAdmin();
  const today = todayStr();
  const [existing] = await db.select({ date_relance: candidatures.date_relance })
    .from(candidatures).where(eq(candidatures.id, id));
  const date_relance = existing?.date_relance ?? addDays(today, 7);

  await db.update(candidatures)
    .set({ statut: 'envoyee', date_candidature: today, date_relance, updated_at: new Date() })
    .where(eq(candidatures.id, id));
  await insertEvent(id, 'sent', `Candidature envoyée le ${today}`);
  revalidateAll();
}

export async function markRelanceDone(id: string): Promise<void> {
  await requireAdmin();
  await db.update(candidatures)
    .set({ relance_effectuee: true, updated_at: new Date() })
    .where(eq(candidatures.id, id));
  await insertEvent(id, 'relance_done', 'Relance effectuée');
  revalidateAll();
}

export async function scheduleEntretien(candidature_id: string, data: EntretienInput): Promise<void> {
  await requireAdmin();

  const TYPE_LABELS: Record<string, string> = { telephone: 'téléphone', visio: 'visio', presentiel: 'présentiel' };

  await db.insert(entretiens).values({
    candidature_id,
    type:           data.type,
    date_entretien: new Date(data.date_entretien),
    contact:        data.contact ?? null,
    notes:          data.notes ?? null,
  });

  const label = `Entretien ${TYPE_LABELS[data.type]} programmé le ${new Date(data.date_entretien).toLocaleDateString('fr-FR')}`;
  await insertEvent(candidature_id, 'entretien_scheduled', label);

  await db.update(candidatures)
    .set({ statut: 'entretien_programme', updated_at: new Date() })
    .where(eq(candidatures.id, candidature_id));

  revalidateAll();
}

export async function updateEntretienStatus(
  entretien_id: string,
  candidature_id: string,
  status: 'prevu' | 'fait' | 'annule',
): Promise<void> {
  await requireAdmin();
  await db.update(entretiens).set({ status }).where(eq(entretiens.id, entretien_id));
  if (status === 'fait') {
    await insertEvent(candidature_id, 'entretien_done', 'Entretien effectué');
  }
  revalidateAll();
}
