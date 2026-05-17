import { getAllCandidatures, getCandidatureById, getCandidaturesCounts } from '@/db/queries/candidatures';
import CandidaturesClient from './CandidaturesClient';

type PageProps = { searchParams: Promise<{ filter?: string; id?: string }> };

export default async function CandidaturesPage({ searchParams }: PageProps) {
  const { filter = 'all', id } = await searchParams;

  const [allCandidatures, counts, selectedCandidature] = await Promise.all([
    getAllCandidatures(),
    getCandidaturesCounts(),
    id ? getCandidatureById(id) : Promise.resolve(null),
  ]);

  return (
    <CandidaturesClient
      initialList={allCandidatures}
      counts={counts}
      selectedCandidature={selectedCandidature}
      initialFilter={filter}
      initialId={id}
    />
  );
}
