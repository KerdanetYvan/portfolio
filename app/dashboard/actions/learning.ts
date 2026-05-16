'use server';

import { db, learningItems } from '@/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type LearningInput = {
  nom: string;
  categorie: string;
  description: string;
  date_debut: string;
  lien?: string | null;
  statut?: 'en_cours' | 'termine' | 'abandonne';
};

export async function createLearningItem(data: LearningInput) {
  await db.insert(learningItems).values({
    nom: data.nom,
    categorie: data.categorie,
    description: data.description,
    date_debut: data.date_debut,
    lien: data.lien ?? null,
    statut: data.statut ?? 'en_cours',
    ordre: 0,
  });
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/personnalize');
}

export async function updateLearningItem(id: string, data: Partial<LearningInput>) {
  await db.update(learningItems).set(data).where(eq(learningItems.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/personnalize');
}

export async function deleteLearningItem(id: string) {
  await db.delete(learningItems).where(eq(learningItems.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/personnalize');
}

export async function markLearningDone(id: string) {
  await db
    .update(learningItems)
    .set({ statut: 'termine' })
    .where(eq(learningItems.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/personnalize');
}
