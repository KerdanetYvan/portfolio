/**
 * Icône d'un projet curaté (public/projects/<url>/) dans une case carrée :
 * `icon` (+ `iconDark` éventuel pour le thème sombre), sinon un monogramme
 * texte, pour que toutes les cards restent alignées.
 */
interface ProjectIconProps {
  project: { url: string; name: string; icon?: string; iconDark?: string; monogram?: string };
  size?: 'sm' | 'lg';
}

const BOX = { sm: 'size-8 p-1 rounded-md', lg: 'size-12 p-1.5 rounded-lg' };
const MONO = { sm: 'text-[9px]', lg: 'text-xs' };

export default function ProjectIcon({ project, size = 'sm' }: ProjectIconProps) {
  const box = `flex shrink-0 items-center justify-center border border-border bg-surface ${BOX[size]}`;
  const src = (file: string) => `/projects/${project.url}/${file}`;

  if (!project.icon) {
    return (
      <span className={`${box} font-mono font-semibold text-muted ${MONO[size]}`} aria-hidden="true">
        {project.monogram ?? project.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span className={box} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src(project.icon)}
        alt=""
        className={`size-full object-contain ${project.iconDark ? 'dark:hidden' : ''}`}
      />
      {project.iconDark && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src(project.iconDark)} alt="" className="hidden size-full object-contain dark:block" />
      )}
    </span>
  );
}
