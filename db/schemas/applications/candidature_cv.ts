import { pgSchema, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { candidatures } from './candidatures';

const applications = pgSchema('applications');

export const candidatureCv = applications.table('candidature_cv', {
  id:             uuid('id').primaryKey().defaultRandom(),
  candidature_id: uuid('candidature_id')
    .references(() => candidatures.id, { onDelete: 'cascade' })
    .notNull(),
  contenu_json:   jsonb('contenu_json').notNull(), // snapshot CV au moment de la candidature
  nom_fichier:    text('nom_fichier'),
  created_at:     timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type CandidatureCv    = typeof candidatureCv.$inferSelect;
export type NewCandidatureCv = typeof candidatureCv.$inferInsert;
