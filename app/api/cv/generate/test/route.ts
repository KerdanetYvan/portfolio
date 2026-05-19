import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

  const isDev = process.env.NODE_ENV !== 'production';
  console.log('[cv/test] NODE_ENV=%s isDev=%s', process.env.NODE_ENV, isDev);

  let browser;
  try {
    if (isDev) {
      console.log('[cv/test] import puppeteer...');
      const puppeteer = (await import('puppeteer')).default;
      console.log('[cv/test] puppeteer importé, launch()...');
      browser = await puppeteer.launch({
        headless: true,
        timeout: 30_000,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } else {
      console.log('[cv/test] import puppeteer-core + chromium...');
      const [puppeteer, chromium] = await Promise.all([
        import('puppeteer-core').then(m => m.default),
        import('@sparticuz/chromium').then(m => m.default),
      ]);
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
        timeout: 30_000,
      });
    }
    console.log('[cv/test] navigateur lancé ✓');

    const page = await browser.newPage();
    page.setDefaultTimeout(30_000);

    console.log('[cv/test] setContent...');
    await page.setContent(
      '<html><body style="font-family:sans-serif"><h1>Hello World</h1><p>Test Puppeteer OK</p></body></html>',
      { waitUntil: 'domcontentloaded', timeout: 15_000 },
    );
    console.log('[cv/test] setContent OK ✓');

    console.log('[cv/test] pdf()...');
    const pdfUint8 = await page.pdf({ format: 'A4' });
    console.log('[cv/test] pdf OK ✓ (%d bytes)', pdfUint8.byteLength);

    return NextResponse.json({
      ok: true,
      env: process.env.NODE_ENV,
      pdfBytes: pdfUint8.byteLength,
    });
  } catch (err) {
    console.error('[cv/test] erreur:', err);
    return NextResponse.json(
      { ok: false, env: process.env.NODE_ENV, error: String(err) },
      { status: 500 },
    );
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
