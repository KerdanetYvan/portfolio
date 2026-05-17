import { pgSchema, uuid, text, integer } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const softSkills = cv.table('soft_skills', {
  id:      uuid('id').primaryKey().defaultRandom(),
  libelle: text('libelle').notNull(),
  ordre:   integer('ordre').default(0).notNull(),
});

export type SoftSkill    = typeof softSkills.$inferSelect;
export type NewSoftSkill = typeof softSkills.$inferInsert;
