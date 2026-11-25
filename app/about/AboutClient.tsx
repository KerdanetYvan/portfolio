'use client';
import { useRef } from 'react';
import Terminal from './Terminal';
import GitLog from './GitLog';

const LANGS = [
  { name: 'Français', level: 'Natif',    fill: 3, cert: null },
  { name: 'Anglais',  level: 'B2 / C1',  fill: 2, cert: 'TOEIC 845' },
  { name: 'Espagnol', level: 'A1',        fill: 1, cert: null },
];

const HOBBIES = [
  { emoji: '🎮', label: 'Jeux vidéo',         desc: 'FPS, MMORPG' },
  { emoji: '🧗', label: 'Escalade & sport',    desc: 'Haltérophilie, Gouren' },
  { emoji: '🎨', label: 'Créativité',          desc: 'Graphisme, Couture, Dessin' },
  { emoji: '🖨️', label: 'Impression 3D',       desc: 'Modélisation & fabrication' },
];

export default function AboutClient() {
  const contentRef = useRef<HTMLDivElement>(null);

  function scrollToContent() {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main id="main-content">
      {/* ── Part 1 : Terminal ─────────────────────────────── */}
      <Terminal onContinue={scrollToContent} />

      {/* ── Part 2 : Contenu ──────────────────────────────── */}
      <div ref={contentRef} className="mx-auto max-w-[1200px] px-4 py-16 space-y-20">

        {/* Header */}
        <div>
          <p className="font-mono text-xs text-accent-bg mb-2">// à propos</p>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-3">Yvan Kerdanet</h1>
          <p className="text-muted max-w-xl">
            Dev fullstack. Basé à Paris, origines bretonnes, disponible immédiatement en CDI, CDD ou freelance.
          </p>
        </div>

        {/* ── Parcours ──────────────────────────────────────── */}
        <section aria-labelledby="section-parcours">
          <SectionHeader id="section-parcours" slug="parcours" label="Parcours" />

          <GitLog />
        </section>

        {/* ── Comment je bosse ───────────────────────────────── */}
        <section aria-labelledby="section-workflow">
          <SectionHeader id="section-workflow" slug="workflow" label="Comment je bosse" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '⚡', title: 'Ship vite, itère souvent', desc: 'Je préfère livrer une V1 fonctionnelle et affiner que de chercher la perfection avant de déployer.' },
              { icon: '📐', title: 'Mobile-first by default',  desc: 'Chaque composant est pensé petit écran avant d\'être adapté aux formats larges.' },
              { icon: '🔍', title: 'Lisibilité avant tout',    desc: 'Code explicite, nommage soigné, commentaires uniquement quand le "pourquoi" n\'est pas évident.' },
              { icon: '🧩', title: 'Composants réutilisables', desc: 'Un bout de UI écrit une fois, paramétré, documenté - pas copié-collé.' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border bg-surface-raised p-4 flex gap-3">
                <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">{item.icon}</span>
                <div>
                  <p className="font-medium text-sm text-on-surface mb-1">{item.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Au-delà du dev ─────────────────────────────────── */}
        <section aria-labelledby="section-beyond">
          <SectionHeader id="section-beyond" slug="beyond-dev" label="Au-delà du dev" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* n8n */}
            <div className="rounded-lg border bg-surface-raised p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-accent-bg px-2 py-0.5 rounded border border-border bg-surface">automation</span>
              </div>
              <p className="font-medium text-sm text-on-surface">Automatisation no-code / low-code</p>
              <p className="text-xs text-muted leading-relaxed">
                J&apos;utilise <strong className="text-on-surface">n8n</strong> &nbsp;pour orchestrer des workflows entre services (webhooks, APIs, notifications). Convaincu que l&apos;automatisation libère du temps pour ce qui compte vraiment.
              </p>
            </div>

            {/* 3D */}
            <div className="rounded-lg border bg-surface-raised p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-pop-blue px-2 py-0.5 rounded border border-border bg-surface">3d printing</span>
              </div>
              <p className="font-medium text-sm text-on-surface">Impression 3D & modélisation</p>
              <p className="text-xs text-muted leading-relaxed">
                Du design dans <strong className="text-on-surface">Fusion 360</strong> &nbsp;à la pièce finie sur plateau. J&apos;applique la même rigueur d&apos;itération qu&apos;en code : prototype → test → ajuste.
              </p>
            </div>
          </div>
        </section>

        {/* ── Langues + Loisirs ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          <section aria-labelledby="section-langues">
            <SectionHeader id="section-langues" slug="langues" label="Langues" />
            <div className="space-y-4">
              {LANGS.map((l) => (
                <div key={l.name} className="flex items-center gap-4">
                  <span className="text-sm text-on-surface w-20 shrink-0">{l.name}</span>
                  <div className="flex gap-1.5 items-center">
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className={`w-3 h-3 rounded-full border ${
                          n <= l.fill
                            ? 'bg-accent-bg border-accent-bg'
                            : 'bg-surface border-border'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-muted">{l.level}</span>
                  {l.cert && (
                    <span className="font-mono text-[10px] text-muted px-1.5 py-0.5 rounded border border-border bg-surface ml-auto">
                      {l.cert}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="section-loisirs">
            <SectionHeader id="section-loisirs" slug="loisirs" label="Loisirs" />
            <div className="grid grid-cols-2 gap-2">
              {HOBBIES.map((h) => (
                <div key={h.label} className="flex items-start gap-2 rounded-lg border bg-surface-raised p-3">
                  <span className="text-base shrink-0" aria-hidden="true">{h.emoji}</span>
                  <div>
                    <p className="text-xs font-medium text-on-surface">{h.label}</p>
                    <p className="text-[11px] text-muted">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Credo ──────────────────────────────────────────── */}
        <section aria-labelledby="section-credo">
          <SectionHeader id="section-credo" slug="credo" label="Credo" />
          <blockquote className="border-l-2 border-accent-bg pl-5 py-1">
            <p className="text-lg md:text-xl font-medium text-on-surface italic">
              &ldquo;À tout problème, sa solution. Et si il n&apos;y en a pas, on en trouvera une.&rdquo;
            </p>
          </blockquote>
        </section>

      </div>
    </main>
  );
}

function SectionHeader({ id, slug, label }: { id: string; slug: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <p className="font-mono text-xs text-accent-bg shrink-0">// {slug}</p>
      <h2 id={id} className="text-lg font-semibold text-on-surface shrink-0">{label}</h2>
      <div className="flex-1 h-px bg-border" aria-hidden="true" />
    </div>
  );
}
