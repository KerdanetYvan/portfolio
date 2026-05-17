import { pgSchema, uuid, text, date, boolean, integer } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const experiences = cv.table('experiences', {
  id:           uuid('id').primaryKey().defaultRandom(),
  entreprise:   text('entreprise').notNull(),
  poste:        text('poste').notNull(),
  description:  text('description').notNull(),
  date_debut:   date('date_debut').notNull(),
  date_fin:     date('date_fin'),               // null = en cours
  localisation: text('localisation'),
  technologies: text('technologies').array(),
  ordre:        integer('ordre').default(0).notNull(),
  visible:      boolean('visible').default(true).notNull(),
});

export type Experience    = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
