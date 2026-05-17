import { pgSchema, uuid, text, date, boolean, integer } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const certifications = cv.table('certifications', {
  id:             uuid('id').primaryKey().defaultRandom(),
  nom:            text('nom').notNull(),
  organisme:      text('organisme').notNull(),
  date_obtention: date('date_obtention').notNull(),
  url:            text('url'),
  ordre:          integer('ordre').default(0).notNull(),
  visible:        boolean('visible').default(true).notNull(),
});

export type Certification    = typeof certifications.$inferSelect;
export type NewCertification = typeof certifications.$inferInsert;
