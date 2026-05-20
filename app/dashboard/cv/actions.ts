'use server';

import { db } from '@/db';
import {
  profile, experiences, formations, competences,
  softSkills, langues, centresInteret, certifications, projetsMeta,
} from '@/db';
import { eq, max } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  if (process.env.ADMIN_USER_ID && user.id !== process.env.ADMIN_USER_ID) throw new Error('Forbidden');
}

function revalidateAll() {
  revalidatePath('/dashboard/cv');
  revalidatePath('/dashboard');
}

// ─── Profil ───────────────────────────────────────────────────────────────────

type ProfileInput = {
  nom: string;
  prenom: string;
  titre: string;
  email: string;
  telephone?: string | null;
  localisation?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  bio?: string | null;
};

export async function upsertProfile(data: ProfileInput) {
  await requireAdmin();
  const existing = await db.select({ id: profile.id }).from(profile).limit(1);
  if (existing.length > 0) {
    await db.update(profile)
      .set({ ...data, updated_at: new Date() })
      .where(eq(profile.id, existing[0].id));
  } else {
    await db.insert(profile).values(data);
  }
  revalidateAll();
}

// ─── Expériences ──────────────────────────────────────────────────────────────

type ExperienceInput = {
  poste: string;
  entreprise: string;
  description: string;
  date_debut: string;
  date_fin?: string | null;
  localisation?: string | null;
  technologies?: string[] | null;
  visible?: boolean;
};

export async function createExperience(data: ExperienceInput) {
  await requireAdmin();
  const [{ value: maxOrdre }] = await db.select({ value: max(experiences.ordre) }).from(experiences);
  await db.insert(experiences).values({ ...data, ordre: (maxOrdre ?? 0) + 1 });
  revalidateAll();
}

export async function updateExperience(id: string, data: ExperienceInput) {
  await requireAdmin();
  await db.update(experiences).set(data).where(eq(experiences.id, id));
  revalidateAll();
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await db.delete(experiences).where(eq(experiences.id, id));
  revalidateAll();
}

export async function toggleExperienceVisible(id: string, visible: boolean) {
  await requireAdmin();
  await db.update(experiences).set({ visible }).where(eq(experiences.id, id));
  revalidateAll();
}

// ─── Formations ───────────────────────────────────────────────────────────────

type FormationInput = {
  diplome: string;
  etablissement: string;
  domaine?: string | null;
  date_debut: string;
  date_fin?: string | null;
  visible?: boolean;
};

export async function createFormation(data: FormationInput) {
  await requireAdmin();
  const [{ value: maxOrdre }] = await db.select({ value: max(formations.ordre) }).from(formations);
  await db.insert(formations).values({ ...data, ordre: (maxOrdre ?? 0) + 1 });
  revalidateAll();
}

export async function updateFormation(id: string, data: FormationInput) {
  await requireAdmin();
  await db.update(formations).set(data).where(eq(formations.id, id));
  revalidateAll();
}

export async function deleteFormation(id: string) {
  await requireAdmin();
  await db.delete(formations).where(eq(formations.id, id));
  revalidateAll();
}

export async function toggleFormationVisible(id: string, visible: boolean) {
  await requireAdmin();
  await db.update(formations).set({ visible }).where(eq(formations.id, id));
  revalidateAll();
}

// ─── Compétences ──────────────────────────────────────────────────────────────

type CompetenceInput = {
  nom: string;
  categorie: 'frontend' | 'backend' | 'bdd' | 'devops' | 'autres';
  niveau: 'daily_driver' | 'comfortable' | 'familiar' | 'exploring';
  visible?: boolean;
};

export async function createCompetence(data: CompetenceInput) {
  await requireAdmin();
  const [{ value: maxOrdre }] = await db.select({ value: max(competences.ordre) }).from(competences);
  await db.insert(competences).values({ ...data, ordre: (maxOrdre ?? 0) + 1 });
  revalidateAll();
}

export async function updateCompetence(id: string, data: CompetenceInput) {
  await requireAdmin();
  await db.update(competences).set(data).where(eq(competences.id, id));
  revalidateAll();
}

export async function deleteCompetence(id: string) {
  await requireAdmin();
  await db.delete(competences).where(eq(competences.id, id));
  revalidateAll();
}

export async function toggleCompetenceVisible(id: string, visible: boolean) {
  await requireAdmin();
  await db.update(competences).set({ visible }).where(eq(competences.id, id));
  revalidateAll();
}

// ─── Soft skills ──────────────────────────────────────────────────────────────

export async function createSoftSkill(libelle: string) {
  await requireAdmin();
  const [{ value: maxOrdre }] = await db.select({ value: max(softSkills.ordre) }).from(softSkills);
  await db.insert(softSkills).values({ libelle, ordre: (maxOrdre ?? 0) + 1 });
  revalidateAll();
}

export async function updateSoftSkill(id: string, libelle: string) {
  await requireAdmin();
  await db.update(softSkills).set({ libelle }).where(eq(softSkills.id, id));
  revalidateAll();
}

export async function deleteSoftSkill(id: string) {
  await requireAdmin();
  await db.delete(softSkills).where(eq(softSkills.id, id));
  revalidateAll();
}

// ─── Langues ──────────────────────────────────────────────────────────────────

type LangueInput = {
  langue: string;
  niveau: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'natif';
};

export async function createLangue(data: LangueInput) {
  await requireAdmin();
  const [{ value: maxOrdre }] = await db.select({ value: max(langues.ordre) }).from(langues);
  await db.insert(langues).values({ ...data, ordre: (maxOrdre ?? 0) + 1 });
  revalidateAll();
}

export async function updateLangue(id: string, data: LangueInput) {
  await requireAdmin();
  await db.update(langues).set(data).where(eq(langues.id, id));
  revalidateAll();
}

export async function deleteLangue(id: string) {
  await requireAdmin();
  await db.delete(langues).where(eq(langues.id, id));
  revalidateAll();
}

// ─── Certifications ───────────────────────────────────────────────────────────

type CertificationInput = {
  nom: string;
  organisme: string;
  date_obtention: string;
  url?: string | null;
  visible?: boolean;
};

export async function createCertification(data: CertificationInput) {
  await requireAdmin();
  const [{ value: maxOrdre }] = await db.select({ value: max(certifications.ordre) }).from(certifications);
  await db.insert(certifications).values({ ...data, ordre: (maxOrdre ?? 0) + 1 });
  revalidateAll();
}

export async function updateCertification(id: string, data: CertificationInput) {
  await requireAdmin();
  await db.update(certifications).set(data).where(eq(certifications.id, id));
  revalidateAll();
}

export async function deleteCertification(id: string) {
  await requireAdmin();
  await db.delete(certifications).where(eq(certifications.id, id));
  revalidateAll();
}

export async function toggleCertificationVisible(id: string, visible: boolean) {
  await requireAdmin();
  await db.update(certifications).set({ visible }).where(eq(certifications.id, id));
  revalidateAll();
}

// ─── Centres d'intérêt ────────────────────────────────────────────────────────

export async function createCentreInteret(libelle: string) {
  await requireAdmin();
  const [{ value: maxOrdre }] = await db.select({ value: max(centresInteret.ordre) }).from(centresInteret);
  await db.insert(centresInteret).values({ libelle, ordre: (maxOrdre ?? 0) + 1 });
  revalidateAll();
}

export async function updateCentreInteret(id: string, libelle: string) {
  await requireAdmin();
  await db.update(centresInteret).set({ libelle }).where(eq(centresInteret.id, id));
  revalidateAll();
}

export async function deleteCentreInteret(id: string) {
  await requireAdmin();
  await db.delete(centresInteret).where(eq(centresInteret.id, id));
  revalidateAll();
}

// ─── Projets meta (liés aux repos GitHub) ─────────────────────────────────────

type ProjetMetaInput = {
  github_repo_id: string;
  titre_cv?: string | null;
  description_cv?: string | null;
  tags?: string[] | null;
  inclure_par_defaut?: boolean;
};

export async function addProjetToCV(data: ProjetMetaInput) {
  await requireAdmin();
  const [{ value: maxOrdre }] = await db.select({ value: max(projetsMeta.ordre) }).from(projetsMeta);
  await db.insert(projetsMeta).values({ ...data, ordre: (maxOrdre ?? 0) + 1 });
  revalidateAll();
}

export async function updateProjetMeta(id: string, data: Omit<ProjetMetaInput, 'github_repo_id'>) {
  await requireAdmin();
  await db.update(projetsMeta).set({ ...data, date_modif: new Date() }).where(eq(projetsMeta.id, id));
  revalidateAll();
}

export async function removeProjetFromCV(id: string) {
  await requireAdmin();
  await db.delete(projetsMeta).where(eq(projetsMeta.id, id));
  revalidateAll();
}
