import { db } from '@/db';
import {
  profile, experiences, formations, competences,
  softSkills, langues, centresInteret, certifications, projetsMeta,
} from '@/db';
import { asc, desc, sql } from 'drizzle-orm';

export async function getProfile() {
  try {
    const rows = await db.select().from(profile).limit(1);
    return rows[0] ?? null;
  } catch (err) {
    console.error('[cv/getProfile]', err);
    return null;
  }
}

export async function getAllExperiences() {
  try {
    // En cours (date_fin IS NULL) en premier, puis par date_debut DESC
    return await db.select().from(experiences)
      .orderBy(desc(sql`${experiences.date_fin} IS NULL`), desc(experiences.date_debut));
  } catch (err) {
    console.error('[cv/getAllExperiences]', err);
    return [];
  }
}

export async function getAllFormations() {
  try {
    return await db.select().from(formations).orderBy(desc(formations.date_debut));
  } catch (err) {
    console.error('[cv/getAllFormations]', err);
    return [];
  }
}

export async function getAllCompetences() {
  try {
    return await db.select().from(competences).orderBy(asc(competences.ordre));
  } catch (err) {
    console.error('[cv/getAllCompetences]', err);
    return [];
  }
}

export async function getAllSoftSkills() {
  try {
    return await db.select().from(softSkills).orderBy(asc(softSkills.ordre));
  } catch (err) {
    console.error('[cv/getAllSoftSkills]', err);
    return [];
  }
}

export async function getAllLangues() {
  try {
    return await db.select().from(langues).orderBy(asc(langues.ordre));
  } catch (err) {
    console.error('[cv/getAllLangues]', err);
    return [];
  }
}

export async function getAllCertifications() {
  try {
    return await db.select().from(certifications).orderBy(desc(certifications.date_obtention));
  } catch (err) {
    console.error('[cv/getAllCertifications]', err);
    return [];
  }
}

export async function getAllCentresInteret() {
  try {
    return await db.select().from(centresInteret).orderBy(asc(centresInteret.ordre));
  } catch (err) {
    console.error('[cv/getAllCentresInteret]', err);
    return [];
  }
}

export async function getAllProjetsMeta() {
  try {
    return await db.select().from(projetsMeta).orderBy(asc(projetsMeta.ordre));
  } catch (err) {
    console.error('[cv/getAllProjetsMeta]', err);
    return [];
  }
}
