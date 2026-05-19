// Génération de la configuration initiale du CV par matching tag-based avec l'offre

import { computeScore, extractKeywords } from './keyword-extraction';
import type { CvConfig, SectionConfig, ItemConfig, SectionId } from './types';
import type {
  Experience, Formation, Competence, SoftSkill, Langue,
  Certification, CentreInteret, ProjetMeta,
} from '@/db';

type CvData = {
  experiences:    Experience[];
  formations:     Formation[];
  competences:    Competence[];
  softSkills:     SoftSkill[];
  langues:        Langue[];
  certifications: Certification[];
  centresInteret: CentreInteret[];
  projets:        ProjetMeta[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function itemText(item: Record<string, unknown>): string {
  return Object.values(item)
    .filter((v) => typeof v === 'string' || Array.isArray(v))
    .map((v) => (Array.isArray(v) ? v.join(' ') : v))
    .join(' ');
}

function buildItemConfigs<T extends { id: string; visible?: boolean }>(
  items: T[],
  keywords: string[],
  threshold: number, // score minimum pour sélection auto (0-100)
  alwaysSelectAll: boolean = false,
): ItemConfig[] {
  const withScores = items.map((item) => ({
    id:   item.id,
    score: computeScore(itemText(item as Record<string, unknown>), keywords),
    visible: item.visible ?? true,
  }));

  return withScores.map(({ id, score, visible }) => ({
    id,
    score,
    selected: alwaysSelectAll
      ? visible
      : (visible && (score >= threshold || keywords.length === 0)),
  }));
}

// ─── Génération de la config initiale ─────────────────────────────────────────

/**
 * Génère la configuration initiale du CV basée sur le matching avec l'offre.
 * Les items les plus pertinents sont pré-sélectionnés.
 */
export function generateInitialConfig(
  candidatureId: string,
  offerText: string,
  data: CvData,
): CvConfig {
  const keywords = extractKeywords(offerText);
  const THRESHOLD = keywords.length > 10 ? 15 : 5; // seuil adaptatif

  const sections: SectionConfig[] = [
    {
      id:      'experiences' as SectionId,
      label:   'Expériences',
      visible: true,
      order:   0,
      items:   buildItemConfigs(data.experiences, keywords, THRESHOLD),
    },
    {
      id:      'formations' as SectionId,
      label:   'Formations',
      visible: true,
      order:   1,
      items:   buildItemConfigs(data.formations, keywords, THRESHOLD),
    },
    {
      id:      'competences' as SectionId,
      label:   'Compétences',
      visible: true,
      order:   2,
      items:   buildItemConfigs(data.competences, keywords, THRESHOLD),
    },
    {
      id:      'langues' as SectionId,
      label:   'Langues',
      visible: true,
      order:   3,
      items:   buildItemConfigs(data.langues, keywords, 0, true), // toutes sélectionnées
    },
    {
      id:      'soft-skills' as SectionId,
      label:   'Soft skills',
      visible: true,
      order:   4,
      items:   buildItemConfigs(data.softSkills, keywords, 0, true), // toutes sélectionnées
    },
    {
      id:      'projets' as SectionId,
      label:   'Projets',
      visible: data.projets.length > 0,
      order:   5,
      items:   buildItemConfigs(data.projets, keywords, THRESHOLD),
    },
    {
      id:      'certifications' as SectionId,
      label:   'Certifications',
      visible: data.certifications.length > 0,
      order:   6,
      items:   buildItemConfigs(data.certifications, keywords, 0, true),
    },
    {
      id:      'centres-interet' as SectionId,
      label:   "Centres d'intérêt",
      visible: data.centresInteret.length > 0,
      order:   7,
      items:   buildItemConfigs(data.centresInteret, keywords, 0, true),
    },
  ];

  return {
    candidatureId,
    keywords,
    sections,
    version: 1,
    savedAt: new Date().toISOString(),
  };
}
