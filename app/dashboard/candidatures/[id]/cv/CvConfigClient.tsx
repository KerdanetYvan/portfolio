'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowUp, ArrowDown, Eye, EyeOff,
  Check, Save, FileDown, Download, Loader2,
} from 'lucide-react';
import { generateCvHtml } from '@/lib/cv/cv-template';
import { saveCvConfig, getCvDownloadUrl } from '@/app/dashboard/candidatures/actions';
import type { CvConfig, SectionId, SectionConfig, ItemConfig } from '@/lib/cv/types';
import type {
  Profile, Experience, Formation, Competence, SoftSkill, Langue,
  Certification, CentreInteret, ProjetMeta,
} from '@/db';

type CvData = {
  experiences:    Experience[];
  formations:     Formation[];
  competences:    Competence[];
  softSkills:     SoftSkill[];
  langues:        Langue[];
  certifications: Certification[];
  centresInteret: CentreInteret[];
  projets:        ProjetMeta[];
};

type Props = {
  candidatureId:    string;
  candidatureLabel: string;
  initialConfig:    CvConfig;
  hasExistingConfig: boolean;
  initialPdfPath:   string | null;
  profile:          Profile | null;
  data:             CvData;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getItemLabel(sectionId: SectionId, itemId: string, data: CvData): string {
  switch (sectionId) {
    case 'experiences': {
      const e = data.experiences.find((x) => x.id === itemId);
      return e ? `${e.poste} @ ${e.entreprise}` : itemId;
    }
    case 'formations': {
      const f = data.formations.find((x) => x.id === itemId);
      return f ? f.diplome : itemId;
    }
    case 'competences': {
      const c = data.competences.find((x) => x.id === itemId);
      return c ? c.nom : itemId;
    }
    case 'soft-skills': {
      const s = data.softSkills.find((x) => x.id === itemId);
      return s ? s.libelle : itemId;
    }
    case 'langues': {
      const l = data.langues.find((x) => x.id === itemId);
      return l ? `${l.langue} (${l.niveau})` : itemId;
    }
    case 'projets': {
      const p = data.projets.find((x) => x.id === itemId);
      return p ? p.nom : itemId;
    }
    case 'certifications': {
      const c = data.certifications.find((x) => x.id === itemId);
      return c ? c.nom : itemId;
    }
    case 'centres-interet': {
      const c = data.centresInteret.find((x) => x.id === itemId);
      return c ? c.libelle : itemId;
    }
  }
}

function scoreBadge(score: number) {
  if (score === 0)  return 'bg-[#1a1a1a] text-muted';
  if (score < 20)   return 'bg-yellow-500/10 text-yellow-400';
  return 'bg-green-500/10 text-green-400';
}

// ─── SectionRow ───────────────────────────────────────────────────────────────

function SectionRow({
  section, index, total, data, onToggleVisible, onMoveUp, onMoveDown, onToggleItem,
}: {
  section:         SectionConfig;
  index:           number;
  total:           number;
  data:            CvData;
  onToggleVisible: (id: SectionId) => void;
  onMoveUp:        (id: SectionId) => void;
  onMoveDown:      (id: SectionId) => void;
  onToggleItem:    (sectionId: SectionId, itemId: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const selectedCount = section.items.filter((i) => i.selected).length;

  return (
    <div className={`border border-[#262626] rounded-md overflow-hidden ${!section.visible ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2 px-3 py-2 bg-[#111]">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex-1 text-left text-xs font-semibold text-on-surface truncate"
        >
          {section.label}
          <span className="ml-2 font-normal text-muted">
            ({selectedCount}/{section.items.length})
          </span>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onMoveUp(section.id)}
            disabled={index === 0}
            className="p-1 rounded text-muted hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowUp size={12} />
          </button>
          <button
            onClick={() => onMoveDown(section.id)}
            disabled={index === total - 1}
            className="p-1 rounded text-muted hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowDown size={12} />
          </button>
          <button
            onClick={() => onToggleVisible(section.id)}
            className="p-1 rounded text-muted hover:text-on-surface"
            title={section.visible ? 'Masquer la section' : 'Afficher la section'}
          >
            {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>
      </div>

      {open && section.items.length > 0 && (
        <div className="divide-y divide-[#1a1a1a]">
          {section.items.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-[#0d0d0d]"
            >
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => onToggleItem(section.id, item.id)}
                className="accent-accent w-3 h-3 shrink-0"
              />
              <span className="flex-1 text-xs text-on-surface truncate">
                {getItemLabel(section.id, item.id, data)}
              </span>
              {item.score > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${scoreBadge(item.score)}`}>
                  {item.score}
                </span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────

export default function CvConfigClient({
  candidatureId, candidatureLabel, initialConfig,
  hasExistingConfig, initialPdfPath, profile, data,
}: Props) {
  const [config, setConfig] = useState<CvConfig>(initialConfig);
  // Pas de changements non sauvegardés si la config vient de la BDD
  const [hasUnsaved, setHasUnsaved] = useState(!hasExistingConfig);
  const [saving, startSavingTransition] = useTransition();
  const [savedFlash, setSavedFlash] = useState(false);

  // PDF state
  const [generating, setGenerating] = useState(false);
  const [pdfPath, setPdfPath] = useState<string | null>(initialPdfPath);
  const [downloadingUrl, setDownloadingUrl] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const sortedSections = useMemo(
    () => [...config.sections].sort((a, b) => a.order - b.order),
    [config.sections],
  );

  const html = useMemo(
    () => generateCvHtml(config, { profile, ...data }),
    [config, profile, data],
  );

  // ── Helpers config ────────────────────────────────────────────────────────────

  function updateSections(fn: (secs: SectionConfig[]) => SectionConfig[]) {
    setConfig((prev) => ({ ...prev, sections: fn(prev.sections) }));
    setHasUnsaved(true);
    setSavedFlash(false);
  }

  function handleToggleVisible(id: SectionId) {
    updateSections((secs) => secs.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  }

  function handleMoveUp(id: SectionId) {
    updateSections((secs) => {
      const sorted = [...secs].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === id);
      if (idx <= 0) return secs;
      const aOrder = sorted[idx - 1].order;
      const bOrder = sorted[idx].order;
      return secs.map((s) => {
        if (s.id === id) return { ...s, order: aOrder };
        if (s.id === sorted[idx - 1].id) return { ...s, order: bOrder };
        return s;
      });
    });
  }

  function handleMoveDown(id: SectionId) {
    updateSections((secs) => {
      const sorted = [...secs].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === id);
      if (idx >= sorted.length - 1) return secs;
      const aOrder = sorted[idx + 1].order;
      const bOrder = sorted[idx].order;
      return secs.map((s) => {
        if (s.id === id) return { ...s, order: aOrder };
        if (s.id === sorted[idx + 1].id) return { ...s, order: bOrder };
        return s;
      });
    });
  }

  function handleToggleItem(sectionId: SectionId, itemId: string) {
    updateSections((secs) =>
      secs.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((item): ItemConfig => item.id === itemId ? { ...item, selected: !item.selected } : item) }
          : s,
      ),
    );
  }

  // ── Sauvegarde ────────────────────────────────────────────────────────────────

  function handleSave() {
    startSavingTransition(async () => {
      await saveCvConfig(candidatureId, config);
      setHasUnsaved(false);
      setSavedFlash(true);
      // Met à jour le config local avec la version incrémentée
      setConfig((prev) => ({ ...prev, version: prev.version + 1, savedAt: new Date().toISOString() }));
      setTimeout(() => setSavedFlash(false), 2500);
    });
  }

  // ── Export PDF ────────────────────────────────────────────────────────────────

  async function handleExportPdf() {
    if (hasUnsaved) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch('/api/cv/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidatureId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Erreur inconnue');
      setPdfPath(json.pdfPath);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Erreur lors de la génération');
    } finally {
      setGenerating(false);
    }
  }

  // ── Téléchargement ────────────────────────────────────────────────────────────

  async function handleDownload() {
    setDownloadingUrl(true);
    try {
      const url = await getCvDownloadUrl(candidatureId);
      if (!url) { alert('URL de téléchargement introuvable'); return; }
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv-${candidatureLabel.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloadingUrl(false);
    }
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Panneau gauche : configuration ── */}
      <div className="w-[360px] shrink-0 border-r border-[#262626] flex flex-col overflow-hidden">
        {/* En-tête */}
        <div className="px-4 py-3 border-b border-[#262626] shrink-0">
          <Link
            href={`/dashboard/candidatures?id=${candidatureId}`}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-accent mb-2"
          >
            <ArrowLeft size={13} />
            Retour à la candidature
          </Link>
          <p className="text-xs font-semibold text-on-surface truncate">{candidatureLabel}</p>
          {!hasUnsaved && config.savedAt && (
            <p className="text-[10px] text-muted/60 font-mono mt-0.5">
              v{config.version} · sauvegardé {new Date(config.savedAt).toLocaleDateString('fr-FR')}
            </p>
          )}
          {hasUnsaved && (
            <p className="text-[10px] text-orange-400 font-mono mt-0.5">Modifications non sauvegardées</p>
          )}
        </div>

        {/* Mots-clés */}
        {config.keywords.length > 0 && (
          <div className="px-4 py-3 border-b border-[#262626] shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-muted mb-2">
              Mots-clés ({config.keywords.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {config.keywords.slice(0, 25).map((kw) => (
                <span key={kw} className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono">
                  {kw}
                </span>
              ))}
              {config.keywords.length > 25 && (
                <span className="text-[10px] text-muted/60">+{config.keywords.length - 25}</span>
              )}
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sortedSections.map((section, idx) => (
            <SectionRow
              key={section.id}
              section={section}
              index={idx}
              total={sortedSections.length}
              data={data}
              onToggleVisible={handleToggleVisible}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onToggleItem={handleToggleItem}
            />
          ))}
        </div>
      </div>

      {/* ── Panneau droit : aperçu ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#262626] shrink-0 gap-3">
          <span className="text-xs font-medium text-muted uppercase tracking-wider shrink-0">Aperçu</span>

          <div className="flex items-center gap-2 ml-auto">
            {/* Erreur génération */}
            {generateError && (
              <span className="text-xs text-red-400 max-w-[200px] truncate" title={generateError}>
                {generateError}
              </span>
            )}

            {/* Télécharger si PDF généré */}
            {pdfPath && (
              <button
                onClick={handleDownload}
                disabled={downloadingUrl}
                className="flex items-center gap-1.5 rounded-md border border-[#363636] px-3 py-1.5 text-xs text-on-surface hover:border-accent hover:text-accent disabled:opacity-50 transition-colors"
              >
                {downloadingUrl ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                Télécharger PDF
              </button>
            )}

            {/* Exporter PDF */}
            <button
              onClick={handleExportPdf}
              disabled={hasUnsaved || generating}
              title={hasUnsaved ? 'Sauvegardez d\'abord la configuration' : pdfPath ? 'Régénérer le PDF' : 'Générer le PDF'}
              className="flex items-center gap-1.5 rounded-md border border-[#363636] px-3 py-1.5 text-xs text-muted hover:border-[#555] hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {generating
                ? <><Loader2 size={13} className="animate-spin" /> Génération…</>
                : <><FileDown size={13} /> {pdfPath ? 'Régénérer PDF' : 'Exporter PDF'}</>
              }
            </button>

            {/* Sauvegarder */}
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsaved}
              className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-black hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {savedFlash
                ? <><Check size={13} /> Sauvegardé</>
                : <><Save size={13} /> {saving ? 'Sauvegarde…' : 'Sauvegarder'}</>
              }
            </button>
          </div>
        </div>

        {/* Aperçu iframe */}
        <div className="flex-1 overflow-hidden bg-[#0a0a0a] p-4">
          <iframe
            srcDoc={html}
            className="w-full h-full rounded border border-[#262626] bg-white"
            title="Aperçu CV"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
