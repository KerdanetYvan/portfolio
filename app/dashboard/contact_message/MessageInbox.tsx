'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MailOpen, Archive, Trash2, Mail, MessageSquare, ExternalLink,
} from 'lucide-react';
import type { ContactMessage } from '@/db';
import {
  markMessageRead,
  markMessageUnread,
  markMessageReplied,
  archiveMessage,
  deleteMessage,
} from '../actions/messages';
import { useToast } from '../components/ToastProvider';
import ConfirmModal from '../components/ConfirmModal';

// ─── Types ────────────────────────────────────────────────────────────────────

type Filter =
  | 'non_lu'
  | 'tous'
  | 'archive'
  | 'alternance'
  | 'mission_freelance'
  | 'question'
  | 'autre';

const TYPE_LABELS: Record<string, string> = {
  alternance:        'Alternance',
  mission_freelance: 'Mission freelance',
  question:          'Question',
  autre:             'Autre',
};

const TYPE_COLORS: Record<string, string> = {
  alternance:        'bg-[#00D26A]/10 text-[#00D26A] border-[#00D26A]/20',
  mission_freelance: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  question:          'bg-violet-500/10 text-violet-400 border-violet-500/20',
  autre:             'bg-[#262626] text-muted border-[#262626]',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  if (days < 7) return `il y a ${days}j`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatFull(date: Date | string): string {
  const d = new Date(date);
  const datePart = d.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Europe/Paris',
  });
  const timePart = d.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris',
  });
  return `Reçu le ${datePart} à ${timePart}`;
}

function buildMailto(msg: ContactMessage): string {
  const subject = encodeURIComponent('Re: votre message via le portfolio');
  const citation = msg.message.split('\n').map((l) => `> ${l}`).join('\n');
  const body = encodeURIComponent(
    `\n\n---\nMessage original de ${msg.nom} :\n\n${citation}`,
  );
  return `mailto:${msg.email}?subject=${subject}&body=${body}`;
}

function syncURL(filter: Filter, id: string | null) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  if (filter !== 'non_lu') params.set('filter', filter);
  if (id) params.set('id', id);
  const qs = params.toString();
  window.history.replaceState(
    null,
    '',
    `/dashboard/contact_message${qs ? `?${qs}` : ''}`,
  );
}

// ─── Filter sidebar ───────────────────────────────────────────────────────────

function FilterBtn({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'relative flex w-full items-center justify-between overflow-hidden rounded-md px-3 py-1.5 text-sm transition-colors',
        active
          ? 'bg-[#161616] text-on-surface'
          : 'text-muted hover:bg-[#111] hover:text-on-surface',
      ].join(' ')}
    >
      {active && (
        <span className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-accent" />
      )}
      <span className={active ? 'pl-1' : undefined}>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-2 rounded-full bg-[#262626] px-1.5 py-0.5 font-mono text-[10px] text-muted">
          {count}
        </span>
      )}
    </button>
  );
}

function FilterSidebar({
  messages,
  filter,
  onFilterChange,
}: {
  messages: ContactMessage[];
  filter: Filter;
  onFilterChange: (f: Filter) => void;
}) {
  const nonArchived = messages.filter((m) => m.statut !== 'archive');
  const unread    = nonArchived.filter((m) => m.statut === 'non_lu').length;
  const archived  = messages.filter((m) => m.statut === 'archive').length;
  const typeCounts = Object.keys(TYPE_LABELS).reduce<Record<string, number>>((acc, t) => {
    acc[t] = nonArchived.filter((m) => m.type_demande === t).length;
    return acc;
  }, {});

  return (
    <aside className="flex w-[180px] shrink-0 flex-col gap-0.5 border-r border-[#262626] p-3">
      <FilterBtn label="Non lus"   count={unread}           active={filter === 'non_lu'} onClick={() => onFilterChange('non_lu')} />
      <FilterBtn label="Tous"       count={nonArchived.length} active={filter === 'tous'}   onClick={() => onFilterChange('tous')} />

      <hr className="my-2 border-[#262626]" />
      <p className="mb-1 px-3 font-mono text-[10px] uppercase tracking-wider text-muted/60">
        Par type
      </p>
      {(Object.keys(TYPE_LABELS) as Filter[]).map((t) => (
        <FilterBtn
          key={t}
          label={TYPE_LABELS[t]}
          count={typeCounts[t]}
          active={filter === t}
          onClick={() => onFilterChange(t)}
        />
      ))}

      <hr className="my-2 border-[#262626]" />
      <FilterBtn label="Archivés" count={archived} active={filter === 'archive'} onClick={() => onFilterChange('archive')} />
    </aside>
  );
}

// ─── Message list ─────────────────────────────────────────────────────────────

function MessageList({
  messages,
  selectedId,
  onSelect,
}: {
  messages: ContactMessage[];
  selectedId: string | null;
  onSelect: (msg: ContactMessage) => void;
}) {
  return (
    <div className="w-[340px] shrink-0 overflow-y-auto border-r border-[#262626]">
      {messages.length === 0 && (
        <div className="flex h-32 items-center justify-center">
          <p className="text-sm text-muted">Aucun message</p>
        </div>
      )}
      {messages.map((msg) => {
        const isUnread   = msg.statut === 'non_lu';
        const isSelected = msg.id === selectedId;

        return (
          <button
            key={msg.id}
            onClick={() => onSelect(msg)}
            className={[
              'relative flex w-full flex-col gap-1 border-b border-[#262626] px-4 py-3 text-left transition-colors',
              isSelected ? 'bg-[#161616]' : 'hover:bg-[#111]',
            ].join(' ')}
          >
            {isSelected && (
              <span className="absolute inset-y-0 left-0 w-0.5 bg-accent" />
            )}
            {isUnread && !isSelected && (
              <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent" />
            )}
            <div className="flex items-center justify-between gap-2">
              <span className={`truncate text-sm ${isUnread ? 'font-semibold text-on-surface' : 'text-on-surface/80'}`}>
                {msg.nom}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-muted">
                {formatRelative(msg.date_reception)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${TYPE_COLORS[msg.type_demande]}`}>
                {TYPE_LABELS[msg.type_demande]}
              </span>
            </div>
            <p className="truncate text-xs text-muted">{msg.message}</p>
          </button>
        );
      })}
    </div>
  );
}

// ─── Message detail ───────────────────────────────────────────────────────────

function MessageDetail({
  message,
  onMarkUnread,
  onArchive,
  onDelete,
  onReplied,
  isPending,
}: {
  message: ContactMessage;
  onMarkUnread: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onReplied: () => void;
  isPending: boolean;
}) {
  const isRead = message.statut === 'lu' || message.statut === 'repondu';

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Actions bar */}
      <div className="flex items-center gap-2 border-b border-[#262626] px-6 py-3">
        <a
          href={buildMailto(message)}
          onClick={onReplied}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-accent-hover"
        >
          <ExternalLink size={13} />
          Répondre
        </a>

        <button
          onClick={onMarkUnread}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md border border-[#262626] px-3 py-1.5 text-xs text-muted transition-colors hover:border-[#363636] hover:text-on-surface"
          title={isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
        >
          {isRead ? <Mail size={13} /> : <MailOpen size={13} />}
          {isRead ? 'Non lu' : 'Lu'}
        </button>

        {message.statut !== 'archive' && (
          <button
            onClick={onArchive}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-md border border-[#262626] px-3 py-1.5 text-xs text-muted transition-colors hover:border-[#363636] hover:text-on-surface"
          >
            <Archive size={13} />
            Archiver
          </button>
        )}

        <button
          onClick={onDelete}
          disabled={isPending}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
        >
          <Trash2 size={13} />
          Supprimer
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-[#262626] px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-on-surface">{message.nom}</p>
            <a
              href={`mailto:${message.email}`}
              className="font-mono text-sm text-accent transition-colors hover:text-accent-hover"
            >
              {message.email}
            </a>
            {message.entreprise && (
              <p className="text-sm text-muted">{message.entreprise}</p>
            )}
            <p className="font-mono text-[10px] text-muted/60">
              {formatFull(message.date_reception)}
            </p>
          </div>
          <span className={`shrink-0 rounded border px-2 py-1 font-mono text-[10px] ${TYPE_COLORS[message.type_demande]}`}>
            {TYPE_LABELS[message.type_demande]}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-on-surface/90">
          {message.message}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#262626] px-6 py-3">
        <p className="font-mono text-[10px] text-muted">
          Reçu via le formulaire de contact
        </p>
        <p className="font-mono text-[10px] text-muted/40">
          ID: {message.id.substring(0, 8)}…
        </p>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyDetail() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <MessageSquare size={32} className="text-muted/30" />
      <p className="text-sm text-muted">Sélectionnez un message pour voir le détail</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  messages: ContactMessage[];
  initialFilter: string;
  initialId: string | null;
};

export default function MessageInbox({ messages: initial, initialFilter, initialId }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [filter, setFilter]         = useState<Filter>((initialFilter as Filter) ?? 'non_lu');
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const [messages, setMessages]     = useState(initial);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => { setMessages(initial); }, [initial]);

  // Filtered list
  const filtered = messages.filter((m) => {
    if (filter === 'archive') return m.statut === 'archive';
    if (filter === 'non_lu')  return m.statut === 'non_lu';
    if (filter === 'tous')    return m.statut !== 'archive';
    return m.type_demande === filter && m.statut !== 'archive';
  });

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  // Change filter: update state + URL (no server refetch)
  const handleFilterChange = (f: Filter) => {
    setFilter(f);
    setSelectedId(null);
    syncURL(f, null);
  };

  // Select message: optimistic read + URL sync
  const handleSelect = (msg: ContactMessage) => {
    setSelectedId(msg.id);
    syncURL(filter, msg.id);

    if (msg.statut === 'non_lu') {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, statut: 'lu' as const } : m)),
      );
      startTransition(async () => {
        try {
          await markMessageRead(msg.id);
          router.refresh();
        } catch {
          // rollback optimistic update on error
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, statut: 'non_lu' as const } : m)),
          );
          showToast('Erreur lors de la mise à jour', 'error');
        }
      });
    }
  };

  const run = (fn: () => Promise<void>, successMsg: string, afterFn?: () => void) => {
    startTransition(async () => {
      try {
        await fn();
        showToast(successMsg, 'success');
        afterFn?.();
        router.refresh();
      } catch {
        showToast('Une erreur est survenue', 'error');
      }
    });
  };

  const handleDeselect = () => {
    setSelectedId(null);
    syncURL(filter, null);
  };

  return (
    <div className="flex h-full">
      <FilterSidebar
        messages={messages}
        filter={filter}
        onFilterChange={handleFilterChange}
      />

      <MessageList
        messages={filtered}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      {selected ? (
        <MessageDetail
          message={selected}
          isPending={isPending}
          onMarkUnread={() => {
            const isRead = selected.statut === 'lu' || selected.statut === 'repondu';
            if (isRead) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === selected.id ? { ...m, statut: 'non_lu' as const } : m,
                ),
              );
              run(() => markMessageUnread(selected.id), 'Marqué comme non lu');
            } else {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === selected.id ? { ...m, statut: 'lu' as const } : m,
                ),
              );
              run(() => markMessageRead(selected.id), 'Marqué comme lu');
            }
          }}
          onArchive={() =>
            run(
              () => archiveMessage(selected.id),
              'Message archivé',
              handleDeselect,
            )
          }
          onDelete={() => setConfirmDeleteId(selected.id)}
          onReplied={() => {
            if (selected.statut !== 'repondu') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === selected.id ? { ...m, statut: 'repondu' as const } : m,
                ),
              );
              startTransition(async () => {
                try {
                  await markMessageReplied(selected.id);
                  router.refresh();
                } catch {
                  // non-critical — don't rollback, just don't show toast
                }
              });
            }
          }}
        />
      ) : (
        <EmptyDetail />
      )}

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        title="Supprimer le message"
        message="Cette action est irréversible. Le message sera définitivement supprimé."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            run(
              () => deleteMessage(confirmDeleteId),
              'Message supprimé',
              () => {
                handleDeselect();
                setConfirmDeleteId(null);
              },
            );
          }
        }}
      />
    </div>
  );
}
