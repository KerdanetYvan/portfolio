'use server';

import { db, contactMessages } from '@/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function markMessageRead(id: string) {
  await db
    .update(contactMessages)
    .set({ statut: 'lu' })
    .where(eq(contactMessages.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/contact_message');
}

export async function markMessageUnread(id: string) {
  await db
    .update(contactMessages)
    .set({ statut: 'non_lu' })
    .where(eq(contactMessages.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/contact_message');
}

export async function archiveMessage(id: string) {
  await db
    .update(contactMessages)
    .set({ statut: 'archive' })
    .where(eq(contactMessages.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/contact_message');
}

export async function deleteMessage(id: string) {
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/contact_message');
}
