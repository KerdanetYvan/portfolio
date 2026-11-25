'use client';
import { useLayoutEffect, useRef, useState } from 'react';

const GAP = 6; // doit correspondre à gap-1.5

/**
 * Tags sur une seule ligne : affiche tous ceux qui tiennent, puis une pastille
 * « +X » pour le reste (au lieu de couper un tag au bord de la card). Une
 * rangée invisible mesure la largeur réelle de chaque tag ; le calcul est
 * refait à chaque redimensionnement du conteneur.
 */
export default function TagList({ tags, pillClassName }: { tags: string[]; pillClassName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(tags.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const compute = () => {
      const pills = Array.from(measure.children) as HTMLElement[];
      const tagWidths = pills.slice(0, tags.length).map((el) => el.offsetWidth);
      const plusWidth = pills[tags.length]?.offsetWidth ?? 0; // « +N », largeur maximale
      const available = container.clientWidth;

      const total = tagWidths.reduce((sum, w, i) => sum + w + (i > 0 ? GAP : 0), 0);
      if (total <= available) {
        setVisible(tags.length);
        return;
      }
      let used = 0;
      let count = 0;
      for (const w of tagWidths) {
        const next = used + (count > 0 ? GAP : 0) + w;
        if (next + GAP + plusWidth > available) break;
        used = next;
        count += 1;
      }
      setVisible(count);
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(container);
    return () => observer.disconnect();
  }, [tags]);

  const hidden = tags.slice(visible);

  return (
    <div ref={containerRef} className="relative mt-3">
      <div className="flex gap-1.5 overflow-hidden">
        {tags.slice(0, visible).map((tag) => (
          <span key={tag} className={`shrink-0 ${pillClassName}`}>{tag}</span>
        ))}
        {hidden.length > 0 && (
          <span className={`shrink-0 ${pillClassName}`} title={hidden.join(', ')}>
            <span aria-hidden="true">+{hidden.length}</span>
            <span className="sr-only">et {hidden.length} autres tags : {hidden.join(', ')}</span>
          </span>
        )}
      </div>

      {/* Rangée de mesure, invisible et hors flux */}
      <div ref={measureRef} className="invisible absolute left-0 top-0 flex gap-1.5" aria-hidden="true">
        {tags.map((tag) => (
          <span key={tag} className={`shrink-0 ${pillClassName}`}>{tag}</span>
        ))}
        <span className={`shrink-0 ${pillClassName}`}>+{tags.length}</span>
      </div>
    </div>
  );
}
