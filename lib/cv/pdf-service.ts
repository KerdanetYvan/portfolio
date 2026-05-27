// Helper PDFShift — isolé ici pour faciliter le switch futur vers webhook n8n
// Pour switcher vers n8n : remplacer uniquement le corps de generatePdfFromHtml

const PDFSHIFT_ERROR_MESSAGES: Record<number, string> = {
  401: 'Clé API PDFShift invalide — vérifiez PDF_BUILD_KEY',
  402: 'Quota PDFShift dépassé',
  422: 'Le HTML généré est invalide pour PDFShift',
};

export async function generatePdfFromHtml(html: string, sandbox = false): Promise<Buffer> {
  const url = process.env.PDF_BUILD_URL;
  const key = process.env.PDF_BUILD_KEY;

  if (!url || !key) {
    throw new Error('Configuration PDFShift manquante (PDF_BUILD_URL / PDF_BUILD_KEY)');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${key}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: html,
        format: 'A4',
        margin: '14mm 16mm',
        sandbox,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') {
      throw new Error('PDFShift timeout (>30s) — réessayez');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const base = PDFSHIFT_ERROR_MESSAGES[response.status]
      ?? `Service PDFShift indisponible (HTTP ${response.status})`;
    throw new Error(detail ? `${base} — ${detail}` : base);
  }

  return Buffer.from(await response.arrayBuffer());
}
