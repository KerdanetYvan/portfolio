// Helpers Supabase Storage pour les PDF de CV
// Bucket: cv-pdfs (privé, accès admin uniquement via RLS)

import { createClient } from '@supabase/supabase-js';

// Utilise le service role pour les opérations Storage (lecture/écriture admin)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const BUCKET = 'cv-pdfs';

/**
 * Upload d'un PDF dans Supabase Storage.
 * Retourne le chemin interne (ex: "abc-123/v2.pdf").
 */
export async function uploadCvPdf(
  candidatureId: string,
  version: number,
  pdfBuffer: Buffer,
): Promise<string> {
  const supabase = getAdminClient();
  const path = `${candidatureId}/v${version}.pdf`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) throw new Error(`Storage upload échoué : ${error.message}`);
  return path;
}

/**
 * Génère une URL signée expirable pour télécharger un PDF.
 * Par défaut expire après 1 heure.
 */
export async function getSignedCvPdfUrl(
  path: string,
  expiresIn = 3600,
): Promise<string | null> {
  const supabase = getAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn, { download: true });

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/**
 * Supprime un PDF du Storage.
 */
export async function deleteCvPdf(path: string): Promise<void> {
  const supabase = getAdminClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
