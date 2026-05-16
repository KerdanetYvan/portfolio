import { getAllStatuses, getAllLearningItems } from '@/db/queries/personnalize';
import PersonnalizeClient from './PersonnalizeClient';

export default async function PersonnalizePage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section = 'status' } = await searchParams;

  const [statuses, items] = await Promise.all([
    getAllStatuses(),
    getAllLearningItems(),
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
