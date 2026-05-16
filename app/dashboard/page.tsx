import Link from 'next/link';
import { db, contactMessages, statusTable, learningItems } from '@/db';
import { eq, desc } from 'drizzle-orm';
import type { ContactMessage, StatusRow, LearningItem } from '@/db';

const COLOR_HEX: Record<string, string> = {
  vert: '#00D26A',
  jaune: '#f0c040',
  rouge: '#ef4444',
};

const COLOR_EMOJI: Record<string, string> = {
  vert: '🟢',
  jaune: '🟡',
  rouge: '🔴',
};

const TYPE_LABELS: Record<string, string> = {
  alternance: 'Alternance',
  mission_freelance: 'Mission freelance',
  question: 'Question',
  autre: 'Autre',
};

function formatRelative(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days === 1) return 'hier';
  if (days < 30) return `il y a ${days} jours`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function MessagesCard({ unread, latest }: { unread: ContactMessage[]; latest: ContactMessage | null }) {
  const count = unread.length;

  return (
    <Link
      href="/dashboard/contact_message"
      className="block rounded-lg border border-[#262626] bg-[#111] p-5 transition-colors hover:border-[#363636] hover:bg-[#161616]"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">Messages</span>
        {count > 0 && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-black">
            {count} non lu{count > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {count === 0 ? (
        <div className="mt-3">
          <p className="text-sm text-muted">Aucun nouveau message</p>
          {latest && (
            <p className="mt-1 font-mono text-xs text-muted/60">
              Dernier message {formatRelative(latest.date_reception)}
            </p>
          )}
        </div>
      ) : count === 1 ? (
        <div className="mt-3 space-y-1.5">
          <p className="text-sm font-semibold text-on-surface">{unread[0].nom}</p>
          <p className="line-clamp-2 text-sm text-muted">{unread[0].message}</p>
          <p className="font-mono text-xs text-muted/60">
            {formatRelative(unread[0].date_reception)} — {TYPE_LABELS[unread[0].type_demande]}
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-1.5">
          <p className="text-sm text-on-surface">
            <span className="font-semibold">{unread[0].nom}</span>
            {count > 1 && <span className="text-muted"> + {count - 1} autre{count > 2 ? 's' : ''}</span>}
          </p>
          <p className="line-clamp-2 text-sm text-muted">{unread[0].message}</p>
          <p className="font-mono text-xs text-muted/60">
            {formatRelative(unread[0].date_reception)}
          </p>
        </div>
      )}
    </Link>
  );
}

function StatusCard({ status }: { status: StatusRow | undefined }) {
  return (
    <div className="rounded-lg border border-[#262626] bg-[#111] p-5">
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">Statut actuel</div>
      {status ? (
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{COLOR_EMOJI[status.couleur]}</span>
          <span className="text-sm text-on-surface">{status.libelle}</span>
        </div>
      ) : (
        <p className="text-sm text-muted">Aucun statut actif</p>
      )}
      <Link
        href="/dashboard/personnalize?section=status"
        className="mt-4 inline-block rounded-md border border-[#262626] px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
      >
        Modifier
      </Link>
    </div>
  );
}

function LearningCard({ items }: { items: LearningItem[] }) {
  return (
    <div className="rounded-lg border border-[#262626] bg-[#111] p-5">
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">Currently Learning</div>
      {items.length === 0 ? (
        <p className="text-sm text-muted">Aucun item en cours</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-sm text-on-surface">{item.nom}</span>
              <span className="ml-auto font-mono text-xs text-muted">{item.categorie}</span>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/dashboard/personnalize?section=learning"
        className="mt-4 inline-block rounded-md border border-[#262626] px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
      >
        Gérer
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const [unread, allMessages, activeStatus, activeLearning] = await Promise.all([
    db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.statut, 'non_lu'))
      .orderBy(desc(contactMessages.date_reception)),
    db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.date_reception))
      .limit(1),
    db.select().from(statusTable).where(eq(statusTable.actif, true)).limit(1),
    db
      .select()
      .from(learningItems)
      .where(eq(learningItems.statut, 'en_cours'))
      .orderBy(learningItems.ordre)
      .limit(3),
  ]);

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <MessagesCard unread={unread} latest={allMessages[0] ?? null} />

        <div className="grid grid-cols-2 gap-4">
          <StatusCard status={activeStatus[0]} />
          <LearningCard items={activeLearning} />
        </div>

        {/* Placeholder Analytics */}
        <div className="rounded-lg border border-[#262626] border-dashed bg-[#0a0a0a] p-5">
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">Analytics</div>
          <p className="text-sm text-muted/60">Bientôt disponible</p>
        </div>
      </div>
    </div>
  );
}
