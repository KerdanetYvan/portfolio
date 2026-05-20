/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  // Empêche webpack de bundler ces packages qui ont besoin de leurs fichiers natifs
  // @sparticuz/chromium utilise __filename pour localiser ses binaires .br
  serverExternalPackages: ['puppeteer-core', 'puppeteer', '@sparticuz/chromium'],
};

export default nextConfig;
