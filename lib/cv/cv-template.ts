// Template HTML "portfolio-light" — self-contained, ATS-friendly, A4
// Utilisé pour l'aperçu iframe ET la génération PDF (Puppeteer)

import type { CvConfig, SectionId } from './types';
import type {
  Profile, Experience, Formation, Competence, SoftSkill, Langue,
  Certification, CentreInteret, ProjetMeta,
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
  projets:        ProjetMeta[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function dateRange(debut: string, fin: string | null | undefined): string {
  return `${fmt(debut)} – ${fin ? fmt(fin) : 'Présent'}`;
}

// ─── CSS portfolio-light ───────────────────────────────────────────────────────

const CSS = `
  @page { size: A4; margin: 14mm 16mm; }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5px;
    line-height: 1.55;
    color: #1a1a1a;
    background: #fff;
    max-width: 780px;
    margin: 0 auto;
    padding: 32px 36px;
  }

  /* ── En-tête ─────────────────────────────── */
  .cv-header {
    padding-bottom: 14px;
    margin-bottom: 18px;
    border-bottom: 2px solid #1a1a1a;
  }
  .cv-header h1 {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: #0d0d0d;
  }
  .cv-header .titre {
    font-size: 12.5px;
    color: #555;
    margin-top: 2px;
  }
  .cv-header .contacts {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    margin-top: 8px;
    font-size: 9.5px;
    color: #555;
  }
  .cv-header .contacts a { color: #00804a; text-decoration: none; }
  .cv-header .bio {
    margin-top: 10px;
    font-size: 10.5px;
    color: #333;
    line-height: 1.6;
    max-width: 680px;
  }

  /* ── Sections ────────────────────────────── */
  .cv-section {
    margin-bottom: 17px;
    page-break-inside: avoid;
  }
  .cv-section h2 {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #00804a;
    border-bottom: 1.5px solid #d4edda;
    padding-bottom: 3px;
    margin-bottom: 9px;
  }

  /* ── Entrée générique (exp, formation, projet, certif) ── */
  .entry {
    margin-bottom: 10px;
    page-break-inside: avoid;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }
  .entry-title {
    font-weight: 600;
    font-size: 10.5px;
    color: #0d0d0d;
  }
  .entry-sub {
    font-weight: 400;
    color: #555;
    font-size: 10px;
  }
  .entry-date {
    font-size: 9.5px;
    color: #888;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .entry-org {
    font-size: 10px;
    color: #555;
    margin-top: 1px;
  }
  .entry-desc {
    margin-top: 3px;
    font-size: 10px;
    color: #333;
    line-height: 1.6;
  }
  .entry-link {
    font-size: 9.5px;
    color: #00804a;
    text-decoration: none;
  }

  /* ── Tags / pills ────────────────────────── */
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 4px;
  }
  .tag {
    background: #f2f9f5;
    border: 1px solid #c8e6c9;
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 9px;
    color: #2e7d32;
  }

  /* ── Compétences ─────────────────────────── */
  .comp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 20px;
  }
  .comp-group {}
  .comp-cat {
    font-size: 9.5px;
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }
  .comp-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  }
  .comp-list li {
    font-size: 9.5px;
    color: #333;
  }
  .comp-list li::after { content: '·'; margin: 0 2px; color: #aaa; }
  .comp-list li:last-child::after { display: none; }

  /* ── Langues ─────────────────────────────── */
  .lang-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 20px;
  }
  .lang-item {
    font-size: 10px;
  }
  .lang-niveau {
    font-size: 9px;
    color: #888;
    margin-left: 3px;
  }

  /* ── Soft skills / centres intérêt ───────── */
  .pill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .pill {
    background: #f5f5f5;
    border-radius: 3px;
    padding: 2px 7px;
    font-size: 9.5px;
    color: #444;
  }

  @media print {
    body { padding: 0; max-width: none; }
    a { color: #00804a !important; }
  }
`;

// ─── Rendu des sections ────────────────────────────────────────────────────────

function renderExperiences(items: Experience[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h2>Expériences professionnelles</h2>
    ${visible.map((e) => `
    <article class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(e.poste)} <span class="entry-sub">· ${esc(e.entreprise)}${e.localisation ? ` · ${esc(e.localisation)}` : ''}</span></span>
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
    <h2>Formation</h2>
    ${visible.map((f) => `
    <article class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(f.diplome)} <span class="entry-sub">· ${esc(f.etablissement)}${f.domaine ? ` — ${esc(f.domaine)}` : ''}</span></span>
        <span class="entry-date">${dateRange(f.date_debut, f.date_fin)}</span>
      </div>
    </article>`).join('')}
  </section>`;
}

function renderCompetences(items: Competence[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  const CAT: Record<string, string> = {
    frontend: 'Frontend', backend: 'Backend',
    bdd: 'Base de données', devops: 'DevOps', autres: 'Autres',
  };
  const bycat: Record<string, Competence[]> = {};
  for (const c of visible) (bycat[c.categorie] ??= []).push(c);
  return `
  <section class="cv-section">
    <h2>Compétences techniques</h2>
    <div class="comp-grid">
      ${Object.entries(bycat).map(([cat, comps]) => `
      <div class="comp-group">
        <p class="comp-cat">${CAT[cat] ?? cat}</p>
        <ul class="comp-list">${comps.map((c) => `<li>${esc(c.nom)}</li>`).join('')}</ul>
      </div>`).join('')}
    </div>
  </section>`;
}

function renderProjets(items: ProjetMeta[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h2>Projets</h2>
    ${visible.map((p) => `
    <article class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(p.nom)}</span>
        <span class="entry-date">${[p.url_demo, p.url_repo].filter(Boolean).map((u) => `<a href="${esc(u!)}" class="entry-link">${esc(u!.replace(/^https?:\/\//, ''))}</a>`).join(' · ')}</span>
      </div>
      <p class="entry-desc">${esc(p.description)}</p>
      ${p.technologies?.length ? `<div class="tags">${p.technologies.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    </article>`).join('')}
  </section>`;
}

function renderSoftSkills(items: SoftSkill[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h2>Soft skills</h2>
    <div class="pill-list">${visible.map((s) => `<span class="pill">${esc(s.libelle)}</span>`).join('')}</div>
  </section>`;
}

function renderLangues(items: Langue[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h2>Langues</h2>
    <div class="lang-list">
      ${visible.map((l) => `<span class="lang-item"><strong>${esc(l.langue)}</strong><span class="lang-niveau">${esc(l.niveau)}</span></span>`).join('')}
    </div>
  </section>`;
}

function renderCertifications(items: Certification[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h2>Certifications</h2>
    ${visible.map((c) => `
    <article class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(c.nom)} <span class="entry-sub">· ${esc(c.organisme)}</span></span>
        <span class="entry-date">${fmt(c.date_obtention)}</span>
      </div>
      ${c.url ? `<a href="${esc(c.url)}" class="entry-link">${esc(c.url.replace(/^https?:\/\//, ''))}</a>` : ''}
    </article>`).join('')}
  </section>`;
}

function renderCentresInteret(items: CentreInteret[], ids: Set<string>): string {
  const visible = items.filter((i) => ids.has(i.id));
  if (!visible.length) return '';
  return `
  <section class="cv-section">
    <h2>Centres d'intérêt</h2>
    <div class="pill-list">${visible.map((c) => `<span class="pill">${esc(c.libelle)}</span>`).join('')}</div>
  </section>`;
}

function renderSection(id: SectionId, config: CvConfig, data: CvTemplateData): string {
  const ids = selectedIds(config, id);
  switch (id) {
    case 'experiences':     return renderExperiences(data.experiences, ids);
    case 'formations':      return renderFormations(data.formations, ids);
    case 'competences':     return renderCompetences(data.competences, ids);
    case 'projets':         return renderProjets(data.projets, ids);
    case 'soft-skills':     return renderSoftSkills(data.softSkills, ids);
    case 'langues':         return renderLangues(data.langues, ids);
    case 'certifications':  return renderCertifications(data.certifications, ids);
    case 'centres-interet': return renderCentresInteret(data.centresInteret, ids);
  }
}

// ─── Export principal ──────────────────────────────────────────────────────────

/**
 * Génère un document HTML self-contained (aperçu + génération PDF).
 */
export function generateCvHtml(config: CvConfig, data: CvTemplateData): string {
  const p = data.profile;

  const contacts: string[] = [];
  if (p?.email)         contacts.push(`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`);
  if (p?.telephone)     contacts.push(esc(p.telephone));
  if (p?.localisation)  contacts.push(esc(p.localisation));
  if (p?.linkedin_url)  contacts.push(`<a href="${esc(p.linkedin_url)}">LinkedIn</a>`);
  if (p?.github_url)    contacts.push(`<a href="${esc(p.github_url)}">GitHub</a>`);
  if (p?.portfolio_url) contacts.push(`<a href="${esc(p.portfolio_url)}">${esc(p.portfolio_url.replace(/^https?:\/\//, ''))}</a>`);

  const header = p ? `
  <header class="cv-header">
    <h1>${esc(p.prenom)} ${esc(p.nom)}</h1>
    <p class="titre">${esc(p.titre)}</p>
    ${contacts.length ? `<div class="contacts">${contacts.join('<span style="color:#ccc"> | </span>')}</div>` : ''}
    ${p.bio ? `<p class="bio">${esc(p.bio)}</p>` : ''}
  </header>` : '';

  const sortedSections = [...config.sections]
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible);

  const body = sortedSections
    .map((s) => renderSection(s.id, config, data))
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CV — ${p ? `${p.prenom} ${p.nom}` : 'CV'}</title>
<style>${CSS}</style>
</head>
<body>
${header}
${body}
</body>
</html>`;
}
