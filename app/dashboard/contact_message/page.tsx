import { getAllMessages } from '@/db/queries/messages';
import MessageInbox from './MessageInbox';

export default async function ContactMessagePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; id?: string }>;
}) {
  const { filter, id } = await searchParams;
  const messages = await getAllMessages();

  return (
    <div className="h-full overflow-hidden">
      <MessageInbox
        messages={messages}
        initialFilter={filter ?? 'non_lu'}
        initialId={id ?? null}
      />
    </div>
  );
}
