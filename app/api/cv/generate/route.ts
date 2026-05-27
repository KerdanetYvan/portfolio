import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db, candidatureCv, candidatures } from '@/db';
import { eq } from 'drizzle-orm';
import {
  getProfile, getAllExperiences, getAllFormations, getAllCompetences,
  getAllSoftSkills, getAllLangues, getAllCertifications, getAllCentresInteret, getAllProjetsMeta,
} from '@/db/queries/cv';
import { getGitHubRepos } from '@/lib/github/repos';
import { generateCvHtml } from '@/lib/cv/cv-template';
import { generatePdfFromHtml } from '@/lib/cv/pdf-service';
import { uploadCvPdf } from '@/lib/supabase/storage';
import type { CvConfig, ProjetCvData } from '@/lib/cv/types';

export const maxDuration = 60;
export const runtime = 'nodejs';

async function requireAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  if (process.env.ADMIN_USER_ID && user.id !== process.env.ADMIN_USER_ID) return false;
  return true;
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { candidatureId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 });
  }

  const { candidatureId } = body;
  if (!candidatureId) {
    return NextResponse.json({ error: 'candidatureId requis' }, { status: 400 });
  }

  // ── 1. Récupérer la candidature et sa config CV ──────────────────────────────
  const [candidatureRow, cvRow] = await Promise.all([
    db.select({ poste: candidatures.poste, entreprise: candidatures.entreprise })
      .from(candidatures)
      .where(eq(candidatures.id, candidatureId))
      .limit(1),
    db.select({ id: candidatureCv.id, contenu_json: candidatureCv.contenu_json })
      .from(candidatureCv)
      .where(eq(candidatureCv.candidature_id, candidatureId))
      .limit(1),
  ]);

  if (!candidatureRow[0]) {
    return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 });
  }
  if (!cvRow[0]) {
    return NextResponse.json(
      { error: "Configuration CV non trouvée — sauvegardez d'abord" },
      { status: 404 },
    );
  }

  const config = cvRow[0].contenu_json as CvConfig;

  // ── 2. Charger toutes les données CV ─────────────────────────────────────────
  const [
    profile, experiences, formations, competences,
    softSkills, langues, certifications, centresInteret, projetsMeta, githubRepos,
  ] = await Promise.all([
    getProfile(), getAllExperiences(), getAllFormations(), getAllCompetences(),
    getAllSoftSkills(), getAllLangues(), getAllCertifications(), getAllCentresInteret(),
    getAllProjetsMeta(),
    Promise.race([getGitHubRepos(), new Promise<[]>((resolve) => setTimeout(() => resolve([]), 5000))]),
  ]);

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

  // ── 3. Générer le HTML ────────────────────────────────────────────────────────
  console.log('[cv/generate] génération HTML...');
  const html = generateCvHtml(config, {
    profile, experiences, formations, competences,
    softSkills, langues, certifications, centresInteret, projets,
  });
  console.log('[cv/generate] HTML prêt (%d chars)', html.length);

  // ── 4. PDFShift → PDF ─────────────────────────────────────────────────────────
  let pdfBuffer: Buffer;
  try {
    console.log('[cv/generate] appel PDFShift...');
    pdfBuffer = await generatePdfFromHtml(html);
    console.log('[cv/generate] PDF prêt (%d bytes)', pdfBuffer.byteLength);
  } catch (err) {
    console.error('[cv/generate] erreur PDFShift:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur génération PDF' },
      { status: 500 },
    );
  }

  // ── 5. Upload dans Supabase Storage ──────────────────────────────────────────
  const version = config.version;
  console.log('[cv/generate] upload PDF v%d...', version);
  let pdfPath: string;
  try {
    pdfPath = await uploadCvPdf(candidatureId, version, pdfBuffer);
  } catch (err) {
    console.error('[cv/generate] erreur upload:', err);
    return NextResponse.json({ error: "Erreur lors de l'upload du PDF" }, { status: 500 });
  }
  console.log('[cv/generate] upload OK → %s', pdfPath);

  // ── 6. Sauvegarder le chemin en BDD ──────────────────────────────────────────
  await db.update(candidatureCv)
    .set({ nom_fichier: pdfPath })
    .where(eq(candidatureCv.id, cvRow[0].id));

  console.log('[cv/generate] terminé');
  return NextResponse.json({ success: true, pdfPath, version });
}
