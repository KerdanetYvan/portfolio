import { pgSchema, uuid, text, integer } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const langueNiveauEnum = cv.enum('langue_niveau', [
  'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'natif',
]);

export const langues = cv.table('langues', {
  id:     uuid('id').primaryKey().defaultRandom(),
  langue: text('langue').notNull(),
  niveau: langueNiveauEnum('niveau').notNull(),
  ordre:  integer('ordre').default(0).notNull(),
});

export type Langue    = typeof langues.$inferSelect;
export type NewLangue = typeof langues.$inferInsert;
