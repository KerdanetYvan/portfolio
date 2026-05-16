import { pgSchema, uuid, text, date, integer } from 'drizzle-orm/pg-core';

const portfolio = pgSchema('portfolio');

export const statutApprentissageEnum = portfolio.enum('statut_apprentissage', [
  'en_cours',
  'termine',
  'abandonne',
]);

export const learningItems = portfolio.table('learning_items', {
  id:          uuid('id').primaryKey().defaultRandom(),
  nom:         text('nom').notNull(),
  categorie:   text('categorie').notNull(),
  description: text('description').notNull(),
  date_debut:  date('date_debut').notNull(),
  lien:        text('lien'),
  statut:      statutApprentissageEnum('statut').default('en_cours').notNull(),
  ordre:       integer('ordre').default(0).notNull(),
});

export type LearningItem    = typeof learningItems.$inferSelect;
export type NewLearningItem = typeof learningItems.$inferInsert;
