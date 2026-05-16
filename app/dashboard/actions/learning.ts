'use server';

import { db, learningItems } from '@/db';
import { eq, max } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type LearningInput = {
  nom: string;
  categorie: string;
  description: string;
  date_debut: string;
  lien?: string | null;
  statut?: 'en_cours' | 'termine' | 'abandonne';
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const adminId = process.env.ADMIN_USER_ID;
  if (adminId && user.id !== adminId) throw new Error('Forbidden');
}

function revalidateAll() {
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/personnalize');
  revalidatePath('/skills');
}

export async function createLearningItem(data: LearningInput) {
  await requireAdmin();

  const [{ value: maxOrdre }] = await db
    .select({ value: max(learningItems.ordre) })
    .from(learningItems);

  await db.insert(learningItems).values({
    nom: data.nom,
    categorie: data.categorie,
    description: data.description,
    date_debut: data.date_debut,
    lien: data.lien ?? null,
    statut: data.statut ?? 'en_cours',
    ordre: (maxOrdre ?? 0) + 1,
  });

  revalidateAll();
}

export async function updateLearningItem(id: string, data: Partial<LearningInput>) {
  await requireAdmin();
  await db.update(learningItems).set(data).where(eq(learningItems.id, id));
  revalidateAll();
}

export async function deleteLearningItem(id: string) {
  await requireAdmin();
  await db.delete(learningItems).where(eq(learningItems.id, id));
  revalidateAll();
}

export async function markLearningDone(id: string) {
  await requireAdmin();
  await db
    .update(learningItems)
    .set({ statut: 'termine' })
    .where(eq(learningItems.id, id));
  revalidateAll();
}
