import { db, candidatures, entretiens, events, candidatureCv } from '@/db';
import { eq, desc, lte, and, isNotNull, notInArray, asc, count } from 'drizzle-orm';
import type { Candidature, Entretien, CandidatureEvent, CandidatureCv } from '@/db';

export type StatutFilter = 'all' | 'a_envoyer' | 'en_cours' | 'relance' | 'acceptee' | 'refusee' | 'ghosted';

export type CandidatureWithDetails = Candidature & {
  entretiens: Entretien[];
  events: CandidatureEvent[];
  cv: CandidatureCv | null;
};

export type CandidatureCounts = {
  total: number;
  a_envoyer: number;
  en_cours: number;
  relance: number;
  acceptee: number;
  refusee: number;
  ghosted: number;
};

const STATUTS_TERMINAUX = ['acceptee', 'refusee', 'ghosted'] as const;

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export async function getAllCandidatures(): Promise<Candidature[]> {
  try {
    return await db
      .select()
      .from(candidatures)
      .orderBy(desc(candidatures.updated_at));
  } catch (err) {
    console.error('[getAllCandidatures]', err);
    return [];
  }
}

export type CandidatureForCvPage = {
  candidature: Candidature;
  cv: CandidatureCv | null;
};

/**
 * Requête légère pour la page CV — uniquement candidature + config CV.
 * N'inclut PAS events/entretiens (inutiles pour cette page, et events peut être lent).
 */
export async function getCandidatureForCvPage(id: string): Promise<CandidatureForCvPage | null> {
  try {
    console.time(`[getCandidatureForCvPage] ${id}`);
    const [candidatureRows, cvRows] = await Promise.all([
      db.select().from(candidatures).where(eq(candidatures.id, id)).limit(1),
      db.select().from(candidatureCv)
        .where(eq(candidatureCv.candidature_id, id))
        .orderBy(desc(candidatureCv.created_at))
        .limit(1),
    ]);
    console.timeEnd(`[getCandidatureForCvPage] ${id}`);

    if (!candidatureRows[0]) return null;
    return { candidature: candidatureRows[0], cv: cvRows[0] ?? null };
  } catch (err) {
    console.error('[getCandidatureForCvPage]', err);
    return null;
  }
}

export async function getCandidatureById(id: string): Promise<CandidatureWithDetails | null> {
  try {
    const [candidature, candidatureEntretiens, candidatureEvents, candidatureCvs] = await Promise.all([
      db.select().from(candidatures).where(eq(candidatures.id, id)).limit(1),
      db.select().from(entretiens).where(eq(entretiens.candidature_id, id)).orderBy(asc(entretiens.date_entretien)),
      db.select().from(events).where(eq(events.candidature_id, id)).orderBy(asc(events.date)),
      db.select().from(candidatureCv).where(eq(candidatureCv.candidature_id, id)).orderBy(desc(candidatureCv.created_at)).limit(1),
    ]);

    if (!candidature[0]) return null;

    return {
      ...candidature[0],
      entretiens: candidatureEntretiens,
      events: candidatureEvents,
      cv: candidatureCvs[0] ?? null,
    };
  } catch (err) {
    console.error('[getCandidatureById]', err);
    return null;
  }
}

export async function getRelancesAFaire(): Promise<Candidature[]> {
  try {
    const today = todayStr();
    return await db
      .select()
      .from(candidatures)
      .where(
        and(
          isNotNull(candidatures.date_relance),
          lte(candidatures.date_relance, today),
          eq(candidatures.relance_effectuee, false),
          notInArray(candidatures.statut, [...STATUTS_TERMINAUX]),
        ),
      )
      .orderBy(asc(candidatures.date_relance));
  } catch (err) {
    console.error('[getRelancesAFaire]', err);
    return [];
  }
}

export async function getCandidaturesCounts(): Promise<CandidatureCounts> {
  try {
    const all = await db.select().from(candidatures);
    const today = todayStr();

    return {
      total:     all.length,
      a_envoyer: all.filter((c) => c.statut === 'a_envoyer').length,
      en_cours:  all.filter((c) => ['envoyee', 'entretien_programme', 'en_cours'].includes(c.statut)).length,
      relance:   all.filter(
        (c) =>
          c.date_relance !== null &&
          c.date_relance <= today &&
          !c.relance_effectuee &&
          !STATUTS_TERMINAUX.includes(c.statut as typeof STATUTS_TERMINAUX[number]),
      ).length,
      acceptee:  all.filter((c) => c.statut === 'acceptee').length,
      refusee:   all.filter((c) => c.statut === 'refusee').length,
      ghosted:   all.filter((c) => c.statut === 'ghosted').length,
    };
  } catch (err) {
    console.error('[getCandidaturesCounts]', err);
    return { total: 0, a_envoyer: 0, en_cours: 0, relance: 0, acceptee: 0, refusee: 0, ghosted: 0 };
  }
}

export async function getActiveCandidaturesCount(): Promise<number> {
  try {
    const [{ value }] = await db
      .select({ value: count() })
      .from(candidatures)
      .where(notInArray(candidatures.statut, [...STATUTS_TERMINAUX]));
    return value;
  } catch (err) {
    console.error('[getActiveCandidaturesCount]', err);
    return 0;
  }
}
