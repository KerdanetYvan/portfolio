import { RiMapPinLine, RiGithubFill } from 'react-icons/ri';

interface LastCommit {
  repo: string;
  date: Date;
}

async function getLastCommit(): Promise<LastCommit | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    const res = await fetch(
      'https://api.github.com/users/KerdanetYvan/events/public?per_page=5',
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const events = await res.json();
    const push = events.find((e: { type: string }) => e.type === 'PushEvent');
    if (!push) return null;
    return {
      repo: push.repo.name.replace('KerdanetYvan/', ''),
      date: new Date(push.created_at),
    };
  } catch {
    return null;
  }
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

export default async function StatusBar() {
  const lastCommit = await getLastCommit();

  return (
    <div className="border-y bg-surface-raised">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-2.5 text-xs font-mono text-muted">

          {/* Disponibilité */}
          <span className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bg opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent-bg" />
            </span>
            Disponible pour alternance — Nov. 2025
          </span>

          <span className="hidden sm:block text-border">|</span>

          {/* Localisation */}
          <span className="flex items-center gap-1">
            <RiMapPinLine size={13} aria-hidden="true" />
            Paris, France
          </span>

          {/* Dernière activité GitHub */}
          {lastCommit && (
            <>
              <span className="hidden sm:block text-border">|</span>
              <span className="flex items-center gap-1">
                <RiGithubFill size={13} aria-hidden="true" />
                Dernier commit sur{' '}
                <span className="text-on-surface">{lastCommit.repo}</span>
                {' '}— {timeAgo(lastCommit.date)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
