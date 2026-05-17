import { pgSchema, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { candidatures } from './candidatures';

const applications = pgSchema('applications');

export const entretienTypeEnum = applications.enum('entretien_type', [
  'telephone',
  'visio',
  'presentiel',
]);

export const entretienStatusEnum = applications.enum('entretien_status', [
  'prevu',
  'fait',
  'annule',
]);

export const entretiens = applications.table('entretiens', {
  id:             uuid('id').primaryKey().defaultRandom(),
  candidature_id: uuid('candidature_id')
    .references(() => candidatures.id, { onDelete: 'cascade' })
    .notNull(),
  type:           entretienTypeEnum('type').notNull(),
  status:         entretienStatusEnum('status').default('prevu').notNull(),
  date_entretien: timestamp('date_entretien', { withTimezone: true }).notNull(),
  contact:        text('contact'),
  notes:          text('notes'),
  created_at:     timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Entretien    = typeof entretiens.$inferSelect;
export type NewEntretien = typeof entretiens.$inferInsert;
