import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { contactMessages, typeDemandeEnum, statutContactEnum } from './schemas/portfolio/contact_messages';
import { statusTable, statutCodeEnum, couleurEnum } from './schemas/portfolio/status';
import { learningItems, statutApprentissageEnum } from './schemas/portfolio/learning';

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false, // requis pour le pooler Supabase (PgBouncer transaction mode)
});

export const db = drizzle(client, {
  schema: { contactMessages, statusTable, learningItems },
});

// Re-exports tables + types
export { contactMessages, statusTable, learningItems };
export { typeDemandeEnum, statutContactEnum, statutCodeEnum, couleurEnum, statutApprentissageEnum };
export type { ContactMessage, NewContactMessage } from './schemas/portfolio/contact_messages';
export type { StatusRow, NewStatusRow }           from './schemas/portfolio/status';
export type { LearningItem, NewLearningItem }     from './schemas/portfolio/learning';
