import { pgSchema, uuid, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const projetsMeta = cv.table('projets_meta', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  github_repo_id:     text('github_repo_id').notNull().unique(),
  titre_cv:           text('titre_cv'),
  description_cv:     text('description_cv'),
  tags:               text('tags').array(),
  inclure_par_defaut: boolean('inclure_par_defaut').default(false).notNull(),
  ordre:              integer('ordre').default(0).notNull(),
  date_modif:         timestamp('date_modif', { withTimezone: true }).defaultNow().notNull(),
});

export type ProjetMeta    = typeof projetsMeta.$inferSelect;
export type NewProjetMeta = typeof projetsMeta.$inferInsert;
