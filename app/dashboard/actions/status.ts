'use server';

import { db, statusTable } from '@/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { NewStatusRow } from '@/db';

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
  revalidatePath('/contact');
}

export async function activateStatus(id: string) {
  await requireAdmin();
  await db.update(statusTable).set({ actif: false, date_modif: new Date() });
  await db
    .update(statusTable)
    .set({ actif: true, date_modif: new Date() })
    .where(eq(statusTable.id, id));
  revalidateAll();
}

export async function createStatus(
  data: Pick<NewStatusRow, 'libelle' | 'statut_code' | 'couleur'>,
) {
  await requireAdmin();
  await db.insert(statusTable).values({
    ...data,
    date_modif: new Date(),
    actif: false,
  });
  revalidateAll();
}

export async function updateStatus(
  id: string,
  data: Partial<Pick<NewStatusRow, 'libelle' | 'statut_code' | 'couleur'>>,
) {
  await requireAdmin();
  await db
    .update(statusTable)
    .set({ ...data, date_modif: new Date() })
    .where(eq(statusTable.id, id));
  revalidateAll();
}

export async function deleteStatus(id: string) {
  await requireAdmin();
  await db.delete(statusTable).where(eq(statusTable.id, id));
  revalidateAll();
}
