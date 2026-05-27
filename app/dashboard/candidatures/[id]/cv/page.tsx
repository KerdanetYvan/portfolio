import { notFound } from 'next/navigation';
import { getCandidatureForCvPage } from '@/db/queries/candidatures';
import {
  getProfile, getAllExperiences, getAllFormations, getAllCompetences,
  getAllSoftSkills, getAllLangues, getAllCertifications, getAllCentresInteret, getAllProjetsMeta,
} from '@/db/queries/cv';
import { getGitHubRepos } from '@/lib/github/repos';
import { generateInitialConfig } from '@/lib/cv/cv-matching';
import { computeScore } from '@/lib/cv/keyword-extraction';
import type { CvConfig, ProjetCvData } from '@/lib/cv/types';
import CvConfigClient from './CvConfigClient';

type PageProps = { params: Promise<{ id: string }> };

/**
 * Fusionne les projets courants dans une config sauvegardée.
 * - Ajoute les projets ajoutés au pool APRÈS la dernière sauvegarde
 * - Retire les projets supprimés du pool (IDs orphelins)
 * La sélection des nouveaux projets est basée sur inclure_par_defaut + score vs keywords.
 */
function syncProjetsInConfig(config: CvConfig, currentProjets: ProjetCvData[]): CvConfig {
  const projetsSection = config.sections.find((s) => s.id === 'projets');
  if (!projetsSection) return config;

  const existingIds = new Set(projetsSection.items.map((i) => i.id));
  const currentIds  = new Set(currentProjets.map((p) => p.id));

  // Nouveaux projets absents de la config sauvegardée
  const newProjets = currentProjets.filter((p) => !existingIds.has(p.id));
  // Items orphelins (projet supprimé du pool)
  const validItems = projetsSection.items.filter((i) => currentIds.has(i.id));

  if (newProjets.length === 0 && validItems.length === projetsSection.items.length) {
    return config; // Rien à faire
  }

  const newItems = newProjets.map((p) => ({
    id:       p.id,
    score:    computeScore(
      [p.nom, p.description, ...p.technologies].join(' '),
      config.keywords,
    ),
    selected: p.inclure_par_defaut || config.keywords.length === 0,
  }));

  return {
    ...config,
    sections: config.sections.map((s) =>
      s.id === 'projets'
        ? { ...s, visible: s.visible || newItems.length > 0, items: [...validItems, ...newItems] }
        : s,
    ),
  };
}

// GitHub peut être lent en cold-cache — 1s max sur Hobby (limite fonction 10s)
function githubWithTimeout() {
  return Promise.race([
    getGitHubRepos(),
    new Promise<[]>((resolve) => setTimeout(() => resolve([]), 1000)),
  ]);
}

export default async function CandidatureCvPage({ params }: PageProps) {
  const { id } = await params;

  // Tout en parallèle — évite un aller-retour DB séquentiel avant le Promise.all
  const [
    result,
    profile,
    experiences, formations, competences, softSkills,
    langues, certifications, centresInteret, projetsMeta, githubRepos,
  ] = await Promise.all([
    getCandidatureForCvPage(id),
    getProfile(),
    getAllExperiences(),
    getAllFormations(),
    getAllCompetences(),
    getAllSoftSkills(),
    getAllLangues(),
    getAllCertifications(),
    getAllCentresInteret(),
    getAllProjetsMeta(),
    githubWithTimeout(),
  ]);

  if (!result) notFound();
  const { candidature, cv } = result;

  // Enrichir les projets meta avec les données GitHub
  const repoById = new Map(githubRepos.map((r) => [String(r.id), r]));
  const projets: ProjetCvData[] = projetsMeta.map((meta) => {
    const repo = repoById.get(meta.github_repo_id);
    return {
      id:                 meta.id,
      nom:                meta.titre_cv ?? repo?.name ?? meta.github_repo_id,
      description:        meta.description_cv ?? repo?.description ?? '',
      technologies:       [
        ...(meta.tags ?? []),
        ...(repo?.language && !(meta.tags ?? []).includes(repo.language) ? [repo.language] : []),
      ],
      url_repo:           repo?.html_url ?? '',
      url_demo:           repo?.homepage ?? null,
      inclure_par_defaut: meta.inclure_par_defaut,
    };
  });

  const cvData = { experiences, formations, competences, softSkills, langues, certifications, centresInteret, projets };

  let config: CvConfig;
  if (cv?.contenu_json) {
    config = syncProjetsInConfig(cv.contenu_json as CvConfig, cvData.projets);
  } else {
    config = generateInitialConfig(id, candidature.detail_offre ?? '', cvData);
  }

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
