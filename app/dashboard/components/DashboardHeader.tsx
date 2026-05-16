import { db, statusTable } from '@/db';
import { eq } from 'drizzle-orm';

const COLOR_HEX: Record<string, string> = {
  vert:  '#00D26A',
  jaune: '#f0c040',
  rouge: '#ef4444',
};

function getGreeting(hourNum: number): string {
  if (hourNum >= 5  && hourNum < 12) return 'Bonjour';
  if (hourNum >= 12 && hourNum < 18) return 'Bon après-midi';
  if (hourNum >= 18 && hourNum < 23) return 'Bonsoir';
  return 'Bonne nuit';
}

type Props = { displayName: string };

export default async function DashboardHeader({ displayName }: Props) {
  const rows = await db
    .select()
    .from(statusTable)
    .where(eq(statusTable.actif, true))
    .limit(1);

  const status = rows[0];
  const dotColor = status ? COLOR_HEX[status.couleur] : '#6b7280';

  const now = new Date();
  const hourStr = now.toLocaleString('fr-FR', { hour: 'numeric', hour12: false, timeZone: 'Europe/Paris' });
  const greeting = getGreeting(parseInt(hourStr, 10));

  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  });
  const dateFmt = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-[#262626] bg-[#0a0a0a] px-6">
      <div className="flex items-center gap-2.5">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: dotColor }}
          title={status?.libelle ?? 'Aucun statut actif'}
        />
        <span className="text-sm font-medium text-on-surface">
          {greeting}, {displayName}
        </span>
      </div>
      <span className="ml-auto font-mono text-xs text-muted">{dateFmt}</span>
    </header>
  );
}
