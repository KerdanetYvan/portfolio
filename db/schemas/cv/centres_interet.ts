import { pgSchema, uuid, text, integer } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const centresInteret = cv.table('centres_interet', {
  id:      uuid('id').primaryKey().defaultRandom(),
  libelle: text('libelle').notNull(),
  ordre:   integer('ordre').default(0).notNull(),
});

export type CentreInteret    = typeof centresInteret.$inferSelect;
export type NewCentreInteret = typeof centresInteret.$inferInsert;
