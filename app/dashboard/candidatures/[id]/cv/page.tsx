import { notFound } from 'next/navigation';
import { getCandidatureForCvPage } from '@/db/queries/candidatures';
import {
  getProfile, getAllExperiences, getAllFormations, getAllCompetences,
  getAllSoftSkills, getAllLangues, getAllCertifications, getAllCentresInteret, getAllProjetsMeta,
} from '@/db/queries/cv';
import { generateInitialConfig } from '@/lib/cv/cv-matching';
import type { CvConfig } from '@/lib/cv/types';
import CvConfigClient from './CvConfigClient';

type PageProps = { params: Promise<{ id: string }> };

export default async function CandidatureCvPage({ params }: PageProps) {
  const { id } = await params;
  console.time(`[cv/page] total ${id}`);

  console.time(`[cv/page] candidature+cv ${id}`);
  const result = await getCandidatureForCvPage(id);
  console.timeEnd(`[cv/page] candidature+cv ${id}`);

  if (!result) notFound();
  const { candidature, cv } = result;

  console.time(`[cv/page] cvData queries ${id}`);
  const [
    profile,
    experiences, formations, competences, softSkills,
    langues, certifications, centresInteret, projets,
  ] = await Promise.all([
    getProfile(),
    getAllExperiences(),
    getAllFormations(),
    getAllCompetences(),
    getAllSoftSkills(),
    getAllLangues(),
    getAllCertifications(),
    getAllCentresInteret(),
    getAllProjetsMeta(),
  ]);
  console.timeEnd(`[cv/page] cvData queries ${id}`);

  const cvData = { experiences, formations, competences, softSkills, langues, certifications, centresInteret, projets };

  let config: CvConfig;
  if (cv?.contenu_json) {
    config = cv.contenu_json as CvConfig;
  } else {
    console.time(`[cv/page] generateInitialConfig ${id}`);
    config = generateInitialConfig(id, candidature.detail_offre ?? '', cvData);
    console.timeEnd(`[cv/page] generateInitialConfig ${id}`);
  }

  console.timeEnd(`[cv/page] total ${id}`);

  return (
    <CvConfigClient
      candidatureId={id}
      candidatureLabel={`${candidature.poste} — ${candidature.entreprise}`}
      initialConfig={config}
      hasExistingConfig={!!cv?.contenu_json}
      initialPdfPath={cv?.nom_fichier ?? null}
      profile={profile}
      data={cvData}
    />
  );
}
