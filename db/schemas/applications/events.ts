import { pgSchema, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { candidatures } from './candidatures';

const applications = pgSchema('applications');

export const eventTypeEnum = applications.enum('event_type', [
  'created',
  'sent',
  'status_changed',
  'entretien_scheduled',
  'entretien_done',
  'relance_done',
  'note_added',
]);

export const events = applications.table('events', {
  id:             uuid('id').primaryKey().defaultRandom(),
  candidature_id: uuid('candidature_id')
    .references(() => candidatures.id, { onDelete: 'cascade' })
    .notNull(),
  type:           eventTypeEnum('type').notNull(),
  description:    text('description'),
  date:           timestamp('date', { withTimezone: true }).defaultNow().notNull(),
  metadata:       jsonb('metadata'),
});

export type CandidatureEvent    = typeof events.$inferSelect;
export type NewCandidatureEvent = typeof events.$inferInsert;
