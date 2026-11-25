import type { CSSProperties } from 'react';
import { RiArrowRightUpLine } from 'react-icons/ri';
import { TECH, techColor } from '@/lib/tech';

/** Technos affichées, dans l'ordre (logo, couleur et lien viennent du registre lib/tech.ts). */
const STACK_LABELS = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB', 'PostgreSQL',
  'Three.js', 'n8n', 'Blender', 'Figma', 'Docker', 'Git', 'GitHub Actions',
];

const STACK = STACK_LABELS.map((label) => ({ label, ...TECH[label] }));

export default function TechStack() {
  return (
    <section aria-labelledby="stack-title" className="mx-auto max-w-[1200px] px-4 py-20 border-t">
      <p className="font-mono text-xs text-accent-bg mb-1">// stack</p>
      <h2 id="stack-title" className="text-2xl font-bold text-on-surface mb-8">
        Technologies
      </h2>
      <ul className="flex flex-wrap justify-center gap-2">
        {STACK.map(({ label, icon: Icon, href, color }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              // --brand pilote la couleur du logo, de la bordure et du fond au survol / focus
              style={{ '--brand': techColor({ icon: Icon, color }) } as CSSProperties}
              className="group relative inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-raised px-3 py-1.5 font-mono text-xs leading-none text-muted transition-colors hover:border-(--brand) hover:bg-[color-mix(in_srgb,var(--brand)_10%,var(--surface-raised))] hover:text-on-surface focus-visible:border-(--brand) focus-visible:text-on-surface"
            >
              <Icon size={15} aria-hidden="true" className="shrink-0 text-(--brand)" />
              {label}
              {/* Badge « lien externe » hors flux : ne décale pas le contenu centré */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full border border-(--brand) bg-surface text-on-surface opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <RiArrowRightUpLine size={10} />
              </span>
              <span className="sr-only"> (site officiel, nouvel onglet)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
