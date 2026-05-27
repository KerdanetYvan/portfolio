// Route de test PDFShift — utilise le mode sandbox (watermark, ne consomme pas le quota)
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePdfFromHtml } from '@/lib/cv/pdf-service';

export const maxDuration = 60;

async function requireAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  if (process.env.ADMIN_USER_ID && user.id !== process.env.ADMIN_USER_ID) return false;
  return true;
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[cv/test] test PDFShift sandbox...');

  const testHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Test PDFShift</title></head>
<body style="font-family:sans-serif;padding:40px">
  <h1>Hello PDFShift</h1>
  <p>Test d'intégration PDFShift — mode sandbox (watermark visible, quota non consommé).</p>
  <p>Date : ${new Date().toISOString()}</p>
</body>
</html>`;

  try {
    // sandbox=true : ajoute un watermark mais ne consomme pas le quota free tier
    const pdfBuffer = await generatePdfFromHtml(testHtml, true);
    console.log('[cv/test] PDF sandbox OK (%d bytes)', pdfBuffer.byteLength);

    return NextResponse.json({
      ok: true,
      pdfBytes: pdfBuffer.byteLength,
      sandbox: true,
    });
  } catch (err) {
    console.error('[cv/test] erreur PDFShift:', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
