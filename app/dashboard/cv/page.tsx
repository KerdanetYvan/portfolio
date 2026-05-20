import { Suspense } from 'react';
import CvSidebar from './components/CvSidebar';
import ProfileSection from './components/ProfileSection';
import ExperiencesSection from './components/ExperiencesSection';
import FormationsSection from './components/FormationsSection';
import CompetencesSection from './components/CompetencesSection';
import SoftSkillsSection from './components/SoftSkillsSection';
import LanguesSection from './components/LanguesSection';
import ProjetsSection from './components/ProjetsSection';
import CertificationsSection from './components/CertificationsSection';
import CentresInteretSection from './components/CentresInteretSection';
import {
  getProfile, getAllExperiences, getAllFormations, getAllCompetences,
  getAllSoftSkills, getAllLangues, getAllCertifications, getAllCentresInteret, getAllProjetsMeta,
} from '@/db/queries/cv';
import { getGitHubRepos } from '@/lib/github/repos';

type PageProps = { searchParams: Promise<{ section?: string }> };

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-[#1a1a1a]" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-[#111]" />
        ))}
      </div>
    </div>
  );
}

async function SectionContent({ section }: { section: string }) {
  switch (section) {
    case 'profile': {
      const data = await getProfile();
      return <ProfileSection initial={data} />;
    }
    case 'experiences': {
      const items = await getAllExperiences();
      return <ExperiencesSection initial={items} />;
    }
    case 'formations': {
      const items = await getAllFormations();
      return <FormationsSection initial={items} />;
    }
    case 'competences': {
      const items = await getAllCompetences();
      return <CompetencesSection initial={items} />;
    }
    case 'soft-skills': {
      const items = await getAllSoftSkills();
      return <SoftSkillsSection initial={items} />;
    }
    case 'langues': {
      const items = await getAllLangues();
      return <LanguesSection initial={items} />;
    }
    case 'projets': {
      const [repos, metas] = await Promise.all([
        getGitHubRepos(),
        getAllProjetsMeta(),
      ]);
      const metaByRepoId = new Map(metas.map((m) => [m.github_repo_id, m]));
      const enriched = repos.map((repo) => ({
        ...repo,
        meta: metaByRepoId.get(String(repo.id)) ?? null,
      }));
      return <ProjetsSection repos={enriched} />;
    }
    case 'certifications': {
      const items = await getAllCertifications();
      return <CertificationsSection initial={items} />;
    }
    case 'centres-interet': {
      const items = await getAllCentresInteret();
      return <CentresInteretSection initial={items} />;
    }
    default: {
      const data = await getProfile();
      return <ProfileSection initial={data} />;
    }
  }
}

export default async function CvPage({ searchParams }: PageProps) {
  const { section = 'profile' } = await searchParams;

  return (
    <div className="flex h-full overflow-hidden">
      <CvSidebar currentSection={section} />
      <div className="flex-1 overflow-y-auto">
        <Suspense key={section} fallback={<SectionSkeleton />}>
          <SectionContent section={section} />
        </Suspense>
      </div>
    </div>
  );
}
