// Types pour la configuration de CV généré par candidature

export type SectionId =
  | 'experiences'
  | 'formations'
  | 'competences'
  | 'langues'
  | 'soft-skills'
  | 'projets'
  | 'certifications'
  | 'centres-interet';

export type ItemConfig = {
  id: string;
  selected: boolean;
  score: number; // 0-100, pertinence par rapport à l'offre
};

export type SectionConfig = {
  id: SectionId;
  label: string;
  visible: boolean; // section entière visible sur le CV
  order: number;    // position dans le CV (0-indexed)
  items: ItemConfig[];
};

export type CvConfig = {
  candidatureId: string;
  keywords: string[];     // mots-clés extraits de l'offre
  sections: SectionConfig[];
  version: number;        // incrémenté à chaque sauvegarde
  savedAt: string;        // ISO date
};
