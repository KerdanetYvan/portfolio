import { pgSchema, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';

const portfolio = pgSchema('portfolio');

export const statutCodeEnum = portfolio.enum('statut_code', [
  'recherche',
  'cale',
  'occupe',
  'pause',
]);

export const couleurEnum = portfolio.enum('couleur', [
  'vert',
  'jaune',
  'rouge',
]);

export const statusTable = portfolio.table('status', {
  id:           uuid('id').primaryKey().defaultRandom(),
  statut_code:  statutCodeEnum('statut_code').notNull(),
  libelle:      text('libelle').notNull(),
  couleur:      couleurEnum('couleur').notNull(),
  date_modif:   timestamp('date_modif', { withTimezone: true }).defaultNow().notNull(),
  actif:        boolean('actif').default(false).notNull(),
});

export type StatusRow    = typeof statusTable.$inferSelect;
export type NewStatusRow = typeof statusTable.$inferInsert;
