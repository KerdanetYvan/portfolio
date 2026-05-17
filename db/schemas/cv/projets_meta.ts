import { pgSchema, uuid, text, boolean, integer } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const projetsMeta = cv.table('projets_meta', {
  id:           uuid('id').primaryKey().defaultRandom(),
  nom:          text('nom').notNull(),
  description:  text('description').notNull(),
  technologies: text('technologies').array(),
  url_demo:     text('url_demo'),
  url_repo:     text('url_repo'),
  ordre:        integer('ordre').default(0).notNull(),
  visible:      boolean('visible').default(true).notNull(),
});

export type ProjetMeta    = typeof projetsMeta.$inferSelect;
export type NewProjetMeta = typeof projetsMeta.$inferInsert;
