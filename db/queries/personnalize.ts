import { db, statusTable, learningItems } from '@/db';
import { desc, eq, sql } from 'drizzle-orm';
import type { StatusRow, LearningItem } from '@/db';

export async function getAllStatuses(): Promise<StatusRow[]> {
  try {
    return await db
      .select()
      .from(statusTable)
      .orderBy(
        sql`CASE ${statusTable.couleur} WHEN 'vert' THEN 1 WHEN 'jaune' THEN 2 WHEN 'rouge' THEN 3 ELSE 4 END`,
        desc(statusTable.date_modif),
      );
  } catch (err) {
    console.error('[getAllStatuses]', err);
    return [];
  }
}

export async function getAllLearningItems(
  filter?: 'en_cours' | 'termine' | 'abandonne',
): Promise<LearningItem[]> {
  try {
    const query = db.select().from(learningItems);
    if (filter) {
      return await query
        .where(eq(learningItems.statut, filter))
        .orderBy(learningItems.ordre);
    }
    return await query.orderBy(learningItems.ordre);
  } catch (err) {
    console.error('[getAllLearningItems]', err);
    return [];
  }
}
