'use server';

import { db, contactMessages } from '@/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

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
  revalidatePath('/dashboard/contact_message');
}

export async function markMessageRead(id: string) {
  await requireAdmin();
  await db
    .update(contactMessages)
    .set({ statut: 'lu' })
    .where(eq(contactMessages.id, id));
  revalidateAll();
}

export async function markMessageUnread(id: string) {
  await requireAdmin();
  await db
    .update(contactMessages)
    .set({ statut: 'non_lu' })
    .where(eq(contactMessages.id, id));
  revalidateAll();
}

export async function markMessageReplied(id: string) {
  await requireAdmin();
  await db
    .update(contactMessages)
    .set({ statut: 'repondu' })
    .where(eq(contactMessages.id, id));
  revalidateAll();
}

export async function archiveMessage(id: string) {
  await requireAdmin();
  await db
    .update(contactMessages)
    .set({ statut: 'archive' })
    .where(eq(contactMessages.id, id));
  revalidateAll();
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidateAll();
}
