import { pgSchema, uuid, text, boolean, integer } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const competenceCategorieEnum = cv.enum('competence_categorie', [
  'frontend',
  'backend',
  'bdd',
  'devops',
  'autres',
]);

export const competenceNiveauEnum = cv.enum('competence_niveau', [
  'daily_driver',
  'comfortable',
  'familiar',
  'exploring',
]);

export const competences = cv.table('competences', {
  id:        uuid('id').primaryKey().defaultRandom(),
  nom:       text('nom').notNull(),
  categorie: competenceCategorieEnum('categorie').notNull(),
  niveau:    competenceNiveauEnum('niveau').notNull(),
  ordre:     integer('ordre').default(0).notNull(),
  visible:   boolean('visible').default(true).notNull(),
});

export type Competence    = typeof competences.$inferSelect;
export type NewCompetence = typeof competences.$inferInsert;
