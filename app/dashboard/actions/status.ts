'use server';

import { db, statusTable } from '@/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { NewStatusRow } from '@/db';

export async function activateStatus(id: string) {
  await db.update(statusTable).set({ actif: false, date_modif: new Date() });
  await db
    .update(statusTable)
    .set({ actif: true, date_modif: new Date() })
    .where(eq(statusTable.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/personnalize');
  revalidatePath('/contact');
}

export async function createStatus(
  data: Pick<NewStatusRow, 'libelle' | 'statut_code' | 'couleur'>,
) {
  await db.insert(statusTable).values({
    ...data,
    date_modif: new Date(),
    actif: false,
  });
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/personnalize');
}

export async function updateStatus(
  id: string,
  data: Partial<Pick<NewStatusRow, 'libelle' | 'statut_code' | 'couleur'>>,
) {
  await db
    .update(statusTable)
    .set({ ...data, date_modif: new Date() })
    .where(eq(statusTable.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/personnalize');
  revalidatePath('/contact');
}

export async function deleteStatus(id: string) {
  await db.delete(statusTable).where(eq(statusTable.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/personnalize');
}
