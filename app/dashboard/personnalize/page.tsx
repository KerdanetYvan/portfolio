import { db, statusTable, learningItems } from '@/db';
import { desc } from 'drizzle-orm';
import PersonnalizeClient from './PersonnalizeClient';

export default async function PersonnalizePage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section = 'status' } = await searchParams;

  const [statuses, items] = await Promise.all([
    db.select().from(statusTable).orderBy(desc(statusTable.date_modif)),
    db
      .select()
      .from(learningItems)
      .orderBy(learningItems.ordre, desc(learningItems.date_debut)),
  ]);

  return (
    <div className="h-full overflow-auto p-6">
      <PersonnalizeClient
        initialSection={section === 'learning' ? 'learning' : 'status'}
        statuses={statuses}
        items={items}
      />
    </div>
  );
}
