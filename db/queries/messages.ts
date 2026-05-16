import { db, contactMessages } from '@/db';
import { desc } from 'drizzle-orm';
import type { ContactMessage } from '@/db';

export type MessagesCounts = {
  unread: number;
  total: number;
  archived: number;
  byType: {
    alternance: number;
    mission_freelance: number;
    question: number;
    autre: number;
  };
};

export async function getAllMessages(): Promise<ContactMessage[]> {
  try {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.date_reception));
  } catch (err) {
    console.error('[getAllMessages]', err);
    return [];
  }
}

export async function getMessagesCounts(): Promise<MessagesCounts> {
  try {
    const all = await db.select().from(contactMessages);
    const nonArchived = all.filter((m) => m.statut !== 'archive');
    return {
      unread: nonArchived.filter((m) => m.statut === 'non_lu').length,
      total: nonArchived.length,
      archived: all.filter((m) => m.statut === 'archive').length,
      byType: {
        alternance:        nonArchived.filter((m) => m.type_demande === 'alternance').length,
        mission_freelance: nonArchived.filter((m) => m.type_demande === 'mission_freelance').length,
        question:          nonArchived.filter((m) => m.type_demande === 'question').length,
        autre:             nonArchived.filter((m) => m.type_demande === 'autre').length,
      },
    };
  } catch (err) {
    console.error('[getMessagesCounts]', err);
    return {
      unread: 0, total: 0, archived: 0,
      byType: { alternance: 0, mission_freelance: 0, question: 0, autre: 0 },
    };
  }
}
