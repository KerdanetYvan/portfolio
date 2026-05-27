// Template HTML "portfolio-light" v2 — layout 2 colonnes, ATS-friendly, A4
// Utilisé pour l'aperçu iframe (CvConfigClient) ET la génération PDF (PDFShift via /api/cv/generate)

import type { CvConfig, SectionId, ProjetCvData } from './types';
import type {
  Profile, Experience, Formation, Competence, SoftSkill, Langue,
  Certification, CentreInteret,
} from '@/db';

export type CvTemplateData = {
  profile:        Profile | null;
  experiences:    Experience[];
  formations:     Formation[];
  competences:    Competence[];
  softSkills:     SoftSkill[];
  langues:        Langue[];
  certifications: Certification[];
  centresInteret: CentreInteret[];
  projets:        ProjetCvData[];
};

// ── Zones de placement ────────────────────────────────────────────────────────

const SIDEBAR_SECTIONS: SectionId[] = ['competences', 'langues', 'soft-skills', 'centres-interet'];
const MAIN_SECTIONS: SectionId[]    = ['experiences', 'projets', 'formations', 'certifications'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function selectedIds(config: CvConfig, sectionId: SectionId): Set<string> {
  const sec = config.sections.find((s) => s.id === sectionId);
  if (!sec || !sec.visible) return new Set();
  return new Set(sec.items.filter((i) => i.selected).map((i) => i.id));
}

function fmt(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function dateRange(debut: string, fin: string | null | undefined): string {
  return `${fmt(debut)} – ${fin ? fmt(fin) : 'Présent'}`;
}

function niveauDots(niveau: string): string {
  const filled = ({ daily_driver: 4, comfortable: 3, familiar: 2, exploring: 1 } as Record<string, number>)[niveau] ?? 1;
  return `<span class="comp-niveau">${Array.from({ length: 4 }, (_, i) =>
    `<span class="comp-niveau-dot${i < filled ? ' filled' : ''}"></span>`
  ).join('')}</span>`;
}

// ── SVG Icons inline (avec <title> pour ATS/accessibilité) ───────────────────

const ICON_MAIL  = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><title>Email</title><rect x="1" y="3" width="14" height="10" rx="1"/><path d="m1 4 7 5 7-5"/></svg>`;
const ICON_PHONE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><title>Téléphone</title><path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h2a1.5 1.5 0 0 1 1.485 1.273l.273 1.636a1.5 1.5 0 0 1-.4 1.314L6.7 6.385a10.5 10.5 0 0 0 3 3l1.162-1.158a1.5 1.5 0 0 1 1.314-.4l1.636.273A1.5 1.5 0 0 1 15 9.5v2a1.5 1.5 0 0 1-1.5 1.5C7.149 13 3 8.851 3 2.5z"/></svg>`;
const ICON_PIN   = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><title>Localisation</title><path d="M8 14s5-4.5 5-9a5 5 0 0 0-10 0c0 4.5 5 9 5 9z"/><circle cx="8" cy="5" r="2"/></svg>`;

// ── CSS ────────────────────────────────────────────────────────────────────────

const CSS = `
  :root {
    --bg:             #ffffff;
    --sidebar-bg:     #f7f9f8;
    --text-primary:   #0d0d0d;
    --text-secondary: #4a4a4a;
    --text-tertiary:  #888;
    --accent:         #00805a;
    --accent-light:   #e6f5ee;
    --border:         #e5e5e5;
    --tag-bg:         #f0faf5;
    --tag-border:     #c8e6c9;
    --tag-text:       #2e7d32;
  }

  @page { size: A4; margin: 0; }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', Arial, Helvetica, sans-serif;
    font-size: 10pt;
    line-height: 1.55;
    color: var(--text-primary);
    background: var(--bg);
  }

  /* ── Layout 2 colonnes ─────────────────────────────────────────────────────── */

  .cv {
    display: grid;
    grid-template-columns: 70mm 1fr;
    min-height: 297mm;
  }

  .cv-sidebar {
    background: var(--sidebar-bg);
    padding: 28px 22px;
    border-right: 2px solid var(--accent);
    min-width: 65mm;
  }

  .cv-main {
    padding: 28px 28px;
    background: var(--bg);
  }

  /* ── Sidebar header ─────────────────────────────────────────────────────────── */

  .sidebar-header {
    border-bottom: 2px solid var(--accent);
    padding-bottom: 14px;
    margin-bottom: 18px;
  }

  .sidebar-header h1 {
    font-size: 20pt;
    font-weight: 700;
    color: var(--accent);
    line-height: 1.1;
    letter-spacing: -0.5px;
  }

  .sidebar-header .job-title {
    font-size: 10pt;
    line-height: 1.25;
    color: var(--text-secondary);
    margin-top: 6px;
    font-weight: 500;
    hyphens: auto;
  }

  /* ── Titres de section ──────────────────────────────────────────────────────── */

  .sidebar-section,
  .cv-section {
    margin-bottom: 20px;
  }

  .sidebar-section h3,
  .cv-section h3 {
    font-size: 10pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--accent);
    margin-bottom: 10px;
    padding-bottom: 4px;
    position: relative;
  }

  .sidebar-section h3::after,
  .cv-section h3::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 28px;
    height: 2px;
    background: var(--accent);
  }

  /* ── Contact ────────────────────────────────────────────────────────────────── */

  .contact-list {
    list-style: none;
  }

  .contact-list li {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 9.5pt;
    color: var(--text-secondary);
    margin-bottom: 5px;
    word-break: break-word;
  }

  .contact-list .icon {
    flex-shrink: 0;
    width: 13px;
    height: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    margin-top: 1px;
  }

  .contact-list .icon svg {
    width: 11px;
    height: 11px;
  }

  .link-list {
    list-style: none;
    margin-top: 8px;
  }

  .link-list li {
    font-size: 9.5pt;
    margin-bottom: 3px;
  }

  .link-list a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dotted var(--accent);
  }

  /* ── Compétences sidebar ────────────────────────────────────────────────────── */

  .comp-category {
    margin-bottom: 11px;
  }

  .comp-cat-name {
    font-size: 8.5pt;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
  }

  .comp-list {
    list-style: none;
  }

  .comp-list li {
    font-size: 9.5pt;
    color: var(--text-primary);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  .comp-niveau {
    display: inline-flex;
    gap: 2px;
    flex-shrink: 0;
  }

  .comp-niveau-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--border);
    flex-shrink: 0;
  }

  .comp-niveau-dot.filled {
    background: var(--accent);
  }

  /* ── Langues sidebar ────────────────────────────────────────────────────────── */

  .lang-list {
    list-style: none;
  }

  .lang-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5pt;
    margin-bottom: 5px;
    color: var(--text-primary);
  }

  .lang-niveau {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 8pt;
    color: var(--text-tertiary);
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 1px 5px;
    border-radius: 3px;
  }

  /* ── Soft skills / centres intérêt ─────────────────────────────────────────── */

  .pill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .pill {
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 9pt;
    color: var(--text-secondary);
  }

  /* ── Bio (main) ─────────────────────────────────────────────────────────────── */

  .bio {
    font-size: 10.5pt;
    color: var(--text-secondary);
    line-height: 1.7;
    font-style: italic;
    margin-bottom: 22px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  /* ── Entrées (exp, formations, projets, certifs) ────────────────────────────── */

  .entry {
    margin-bottom: 14px;
    padding-left: 14px;
    border-left: 2px solid var(--accent-light);
    page-break-inside: avoid;
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 2px;
  }

  .entry-title {
    font-size: 10.5pt;
    font-weight: 600;
    color: var(--text-primary);
  }

  .entry-sub {
    font-size: 9.5pt;
    color: var(--text-secondary);
    font-weight: 400;
  }

  .entry-date {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 8.5pt;
    color: var(--text-tertiary);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .entry-desc {
    font-size: 9.5pt;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-top: 3px;
  }

  .entry-link {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 8.5pt;
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dotted var(--accent);
    display: inline-block;
    margin-top: 3px;
  }

  /* ── Tags ───────────────────────────────────────────────────────────────────── */

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 5px;
  }

  .tag {
    background: var(--tag-bg);
    border: 1px solid var(--tag-border);
    color: var(--tag-text);
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 8pt;
    padding: 1px 6px;
    border-radius: 3px;
    font-weight: 500;
  }

  @media print {
    a { color: var(--accent) !important; }
  }
`;

// ── Sidebar renderers ─────────────────────────────────────────────────────────

function renderSidebarHeader(p: Profile): string {
  return `
  <div class="sidebar-header">
    <h1>${esc(p.prenom)} ${esc(p.nom)}</h1>
    ${p.titre ? `<p class="job-title">${esc(p.titre)}</p>` : ''}
  </div>`;
}

function renderContact(p: Profile): string {
  const links: string[] = [];
  if (p.linkedin_url)  links.push(`<li><a href="${esc(p.linkedin_url)}">LinkedIn</a></li>`);
  if (p.github_url)    links.push(`<li><a href="${esc(p.github_url)}">GitHub</a></li>`);
  if (p.portfolio_url) links.push(`<li><a href="${esc(p.portfolio_url)}">${esc(p.portfolio_url.replace(/^https?:\/\//, ''))}</a></li>`);

  return `
  <section class="sidebar-section">
    <h3>Contact</h3>
    <ul class="contact-list">
      ${p.email       ? `<li><span class="icon">${ICON_MAIL}</span>${esc(p.email)}</li>` : ''}
      ${p.telephone   ? `<li><span class="icon">${ICON_PHONE}</span>${esc(p.telephone)}</li>` : ''}
      ${p.localisation ? `<li><span class="icon">${ICON_PIN}</span>${esc(p.localisation)}</li>` : ''}
    </ul>
    ${links.length ? `<ul class="link-list">${links.join('')}</ul>` : ''}
  </section>`;
}

const CAT_LABELS: Record<string, string> = {
  frontend: 'Frontend', backend: 'Backend',
  bdd: 'Base de données', devops: 'DevOps', autres: 'Autres',
};
const CAT_ORDER = ['frontend', 'backend', 'bdd', 'devops', 'autres'];

function renderCompetencesSidebar(items: Competence[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  const bycat: Record<string, Competence[]> = {};
  for (const c of visible) (bycat[c.categorie] ??= []).push(c);
  const orderedCats = CAT_ORDER.filter((cat) => bycat[cat]);

  return `
  <section class="sidebar-section">
    <h3>Compétences techniques</h3>
    ${orderedCats.map((cat) => `
    <div class="comp-category">
      <p class="comp-cat-name">${CAT_LABELS[cat] ?? cat}</p>
      <ul class="comp-list">
        ${bycat[cat].map((c) => `<li><span>${esc(c.nom)}</span>${niveauDots(c.niveau)}</li>`).join('')}
      </ul>
    </div>`).join('')}
  </section>`;
}

function renderLanguesSidebar(items: Langue[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="sidebar-section">
    <h3>Langues</h3>
    <ul class="lang-list">
      ${visible.map((l) => `<li><span>${esc(l.langue)}</span><span class="lang-niveau">${esc(l.niveau)}</span></li>`).join('')}
    </ul>
  </section>`;
}

function renderSoftSkillsSidebar(items: SoftSkill[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="sidebar-section">
    <h3>Soft skills</h3>
    <div class="pill-list">${visible.map((s) => `<span class="pill">${esc(s.libelle)}</span>`).join('')}</div>
  </section>`;
}

function renderCentresInteretSidebar(items: CentreInteret[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="sidebar-section">
    <h3>Centres d'intérêt</h3>
    <div class="pill-list">${visible.map((c) => `<span class="pill">${esc(c.libelle)}</span>`).join('')}</div>
  </section>`;
}

function renderSidebarSection(id: SectionId, config: CvConfig, data: CvTemplateData): string {
  const ids = selectedIds(config, id);
  switch (id) {
    case 'competences':     return renderCompetencesSidebar(data.competences, ids);
    case 'langues':         return renderLanguesSidebar(data.langues, ids);
    case 'soft-skills':     return renderSoftSkillsSidebar(data.softSkills, ids);
    case 'centres-interet': return renderCentresInteretSidebar(data.centresInteret, ids);
    default: return '';
  }
}

// ── Main renderers ────────────────────────────────────────────────────────────

function renderExperiences(items: Experience[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h3>Expériences professionnelles</h3>
    ${visible.map((e) => `
    <article class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(e.poste)}<span class="entry-sub"> · ${esc(e.entreprise)}${e.localisation ? ` · ${esc(e.localisation)}` : ''}</span></span>
        <span class="entry-date">${dateRange(e.date_debut, e.date_fin)}</span>
      </div>
      <p class="entry-desc">${esc(e.description)}</p>
      ${e.technologies?.length ? `<div class="tags">${e.technologies.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    </article>`).join('')}
  </section>`;
}

function renderFormations(items: Formation[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h3>Formation</h3>
    ${visible.map((f) => `
    <article class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(f.diplome)}<span class="entry-sub"> · ${esc(f.etablissement)}${f.domaine ? ` — ${esc(f.domaine)}` : ''}</span></span>
        <span class="entry-date">${dateRange(f.date_debut, f.date_fin)}</span>
      </div>
    </article>`).join('')}
  </section>`;
}

function renderProjets(items: ProjetCvData[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h3>Projets</h3>
    ${visible.map((p) => {
      const urls = [p.url_demo, p.url_repo].filter(Boolean) as string[];
      return `
    <article class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(p.nom)}</span>
        ${urls.length ? `<span class="entry-date">${urls.map((u) => `<a href="${esc(u)}" class="entry-link">${esc(u.replace(/^https?:\/\//, ''))}</a>`).join(' · ')}</span>` : ''}
      </div>
      <p class="entry-desc">${esc(p.description)}</p>
      ${p.technologies.length ? `<div class="tags">${p.technologies.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    </article>`;
    }).join('')}
  </section>`;
}

function renderCertifications(items: Certification[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h3>Certifications</h3>
    ${visible.map((c) => `
    <article class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(c.nom)}<span class="entry-sub"> · ${esc(c.organisme)}</span></span>
        <span class="entry-date">${fmt(c.date_obtention)}</span>
      </div>
      ${c.url ? `<a href="${esc(c.url)}" class="entry-link">${esc(c.url.replace(/^https?:\/\//, ''))}</a>` : ''}
    </article>`).join('')}
  </section>`;
}

function renderMainSection(id: SectionId, config: CvConfig, data: CvTemplateData): string {
  const ids = selectedIds(config, id);
  switch (id) {
    case 'experiences':    return renderExperiences(data.experiences, ids);
    case 'projets':        return renderProjets(data.projets, ids);
    case 'formations':     return renderFormations(data.formations, ids);
    case 'certifications': return renderCertifications(data.certifications, ids);
    default: return '';
  }
}

// ── Export principal ──────────────────────────────────────────────────────────

/**
 * Génère un document HTML self-contained.
 * Layout 2 colonnes : sidebar gauche (contact + sections configurables)
 * + main droite (bio + sections principales).
 * Google Fonts chargées via <link> — Puppeteer doit utiliser waitUntil: 'networkidle0'.
 */
export function generateCvHtml(config: CvConfig, data: CvTemplateData): string {
  const p = data.profile;

  const sortedSections = [...config.sections]
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible);

  const sidebarSections = sortedSections.filter((s) => (SIDEBAR_SECTIONS as string[]).includes(s.id));
  const mainSections    = sortedSections.filter((s) => (MAIN_SECTIONS as string[]).includes(s.id));

  const sidebar = `
  <aside class="cv-sidebar">
    ${p ? renderSidebarHeader(p) : ''}
    ${p ? renderContact(p) : ''}
    ${sidebarSections.map((s) => renderSidebarSection(s.id, config, data)).join('')}
  </aside>`;

  const main = `
  <div class="cv-main">
    ${p?.bio ? `<p class="bio">${esc(p.bio)}</p>` : ''}
    ${mainSections.map((s) => renderMainSection(s.id, config, data)).join('')}
  </div>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>CV${p ? ` — ${esc(p.prenom)} ${esc(p.nom)}` : ''}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<main class="cv">
${sidebar}
${main}
</main>
</body>
</html>`;
}
