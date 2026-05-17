import { pgSchema, uuid, text, date, boolean, integer } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const formations = cv.table('formations', {
  id:            uuid('id').primaryKey().defaultRandom(),
  etablissement: text('etablissement').notNull(),
  diplome:       text('diplome').notNull(),
  domaine:       text('domaine'),
  date_debut:    date('date_debut').notNull(),
  date_fin:      date('date_fin'),
  ordre:         integer('ordre').default(0).notNull(),
  visible:       boolean('visible').default(true).notNull(),
});

export type Formation    = typeof formations.$inferSelect;
export type NewFormation = typeof formations.$inferInsert;
