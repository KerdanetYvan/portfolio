import { db, contactMessages } from '@/db';
import { desc } from 'drizzle-orm';
import MessageInbox from './MessageInbox';

export default async function ContactMessagePage() {
  const messages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.date_reception));

  return (
    <div className="h-full overflow-hidden">
      <MessageInbox messages={messages} />
    </div>
  );
}
