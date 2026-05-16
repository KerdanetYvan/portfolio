import { db, learningItems } from '@/db';
import { eq } from 'drizzle-orm';
import type { LearningItem } from '@/db';

export async function getCurrentLearningItems(): Promise<LearningItem[]> {
  try {
    return await db
      .select()
      .from(learningItems)
      .where(eq(learningItems.statut, 'en_cours'))
      .orderBy(learningItems.ordre);
  } catch (err) {
    console.error('[getCurrentLearningItems]', err);
    return [];
  }
}
