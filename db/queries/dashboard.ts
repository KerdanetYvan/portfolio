import { db, contactMessages, statusTable, learningItems } from '@/db';
import { eq, desc, count } from 'drizzle-orm';
import type { ContactMessage, StatusRow, LearningItem } from '@/db';

export type DashboardOverview = {
  lastMessage:    ContactMessage | null;
  unreadMessages: ContactMessage[];
  unreadCount:    number;
  activeStatus:   StatusRow | null;
  recentLearning: LearningItem[];
};

export async function getDashboardOverview(): Promise<DashboardOverview> {
  try {
    const [unreadMessages, allMessages, activeStatus, recentLearning] = await Promise.all([
      db
        .select()
        .from(contactMessages)
        .where(eq(contactMessages.statut, 'non_lu'))
        .orderBy(desc(contactMessages.date_reception)),
      db
        .select()
        .from(contactMessages)
        .orderBy(desc(contactMessages.date_reception))
        .limit(1),
      db
        .select()
        .from(statusTable)
        .where(eq(statusTable.actif, true))
        .limit(1),
      db
        .select()
        .from(learningItems)
        .where(eq(learningItems.statut, 'en_cours'))
        .orderBy(learningItems.ordre)
        .limit(3),
    ]);

    return {
      lastMessage:    allMessages[0]    ?? null,
      unreadMessages,
      unreadCount:    unreadMessages.length,
      activeStatus:   activeStatus[0]   ?? null,
      recentLearning,
    };
  } catch (err) {
    console.error('[getDashboardOverview]', err);
    return {
      lastMessage:    null,
      unreadMessages: [],
      unreadCount:    0,
      activeStatus:   null,
      recentLearning: [],
    };
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  try {
    const [{ value }] = await db
      .select({ value: count() })
      .from(contactMessages)
      .where(eq(contactMessages.statut, 'non_lu'));
    return value;
  } catch (err) {
    console.error('[getUnreadMessagesCount]', err);
    return 0;
  }
}
