import { getTech, techColor } from '@/lib/tech';

/**
 * Logo d'une techno (registre lib/tech.ts, techno parente comprise).
 * Ne rend rien si la techno est inconnue : à l'appelant de prévoir le repli.
 * Décoratif : le nom de la techno doit être présent à côté (texte visible ou sr-only).
 */
export default function TechLogo({ label, size = 16, className = '' }: { label: string; size?: number; className?: string }) {
  const meta = getTech(label);
  if (!meta) return null;
  const Icon = meta.icon;
  return <Icon size={size} aria-hidden="true" className={`shrink-0 ${className}`} style={{ color: techColor(meta) }} />;
}
