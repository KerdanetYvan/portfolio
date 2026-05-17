import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Schéma portfolio
import { contactMessages, typeDemandeEnum, statutContactEnum } from './schemas/portfolio/contact_messages';
import { statusTable, statutCodeEnum, couleurEnum }            from './schemas/portfolio/status';
import { learningItems, statutApprentissageEnum }              from './schemas/portfolio/learning';

// Schéma cv
import { profile, experiences, formations, competences, softSkills, langues, centresInteret, certifications, projetsMeta } from './schemas/cv';
import { competenceCategorieEnum, competenceNiveauEnum, langueNiveauEnum }                                                  from './schemas/cv';

// Schéma applications
import { candidatures, candidatureCv, entretiens, events }                              from './schemas/applications';
import { statutCandidatureEnum, typePosteEnum, entretienTypeEnum, entretienStatusEnum, eventTypeEnum } from './schemas/applications';

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false, // requis pour le pooler Supabase (PgBouncer transaction mode)
});

export const db = drizzle(client, {
  schema: {
    // portfolio
    contactMessages, statusTable, learningItems,
    // cv
    profile, experiences, formations, competences, softSkills, langues,
    centresInteret, certifications, projetsMeta,
    // applications
    candidatures, candidatureCv, entretiens, events,
  },
});

// ─── Re-exports portfolio ──────────────────────────────────────────────────────
export { contactMessages, statusTable, learningItems };
export { typeDemandeEnum, statutContactEnum, statutCodeEnum, couleurEnum, statutApprentissageEnum };
export type { ContactMessage, NewContactMessage } from './schemas/portfolio/contact_messages';
export type { StatusRow, NewStatusRow }           from './schemas/portfolio/status';
export type { LearningItem, NewLearningItem }     from './schemas/portfolio/learning';

// ─── Re-exports cv ────────────────────────────────────────────────────────────
export { profile, experiences, formations, competences, softSkills, langues, centresInteret, certifications, projetsMeta };
export { competenceCategorieEnum, competenceNiveauEnum, langueNiveauEnum };
export type { Profile, NewProfile }                 from './schemas/cv/profile';
export type { Experience, NewExperience }           from './schemas/cv/experiences';
export type { Formation, NewFormation }             from './schemas/cv/formations';
export type { Competence, NewCompetence }           from './schemas/cv/competences';
export type { SoftSkill, NewSoftSkill }             from './schemas/cv/soft_skills';
export type { Langue, NewLangue }                   from './schemas/cv/langues';
export type { CentreInteret, NewCentreInteret }     from './schemas/cv/centres_interet';
export type { Certification, NewCertification }     from './schemas/cv/certifications';
export type { ProjetMeta, NewProjetMeta }           from './schemas/cv/projets_meta';

// ─── Re-exports applications ──────────────────────────────────────────────────
export { candidatures, candidatureCv, entretiens, events };
export { statutCandidatureEnum, typePosteEnum, entretienTypeEnum, entretienStatusEnum, eventTypeEnum };
export type { Candidature, NewCandidature }               from './schemas/applications/candidatures';
export type { CandidatureCv, NewCandidatureCv }           from './schemas/applications/candidature_cv';
export type { Entretien, NewEntretien }                   from './schemas/applications/entretiens';
export type { CandidatureEvent, NewCandidatureEvent }     from './schemas/applications/events';
