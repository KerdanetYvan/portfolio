import { db, statusTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { StatusRow } from '@/db';

export async function getActiveStatus(): Promise<StatusRow | null> {
  try {
    const rows = await db
      .select()
      .from(statusTable)
      .where(eq(statusTable.actif, true))
      .limit(1);
    return rows[0] ?? null;
  } catch (err) {
    console.error('[getActiveStatus]', err);
    return null;
  }
}
