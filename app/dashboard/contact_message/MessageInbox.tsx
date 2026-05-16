'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MailOpen, Archive, Trash2, Mail, ExternalLink } from 'lucide-react';
import type { ContactMessage } from '@/db';
import {
  markMessageRead,
  markMessageUnread,
  archiveMessage,
  deleteMessage,
} from '../actions/messages';
import { useToast } from '../components/ToastProvider';
import ConfirmModal from '../components/ConfirmModal';

// ─── Types helpers ───────────────────────────────────────────────────────────

type Filter = 'non_lu' | 'tous' | 'archive' | 'alternance' | 'mission_freelance' | 'question' | 'autre';

const TYPE_LABELS: Record<string, string> = {
  alternance: 'Alternance',
  mission_freelance: 'Mission freelance',
  question: 'Question',
  autre: 'Autre',
};

const TYPE_COLORS: Record<string, string> = {
  alternance: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  mission_freelance: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  question: 'bg-[#262626] text-muted border-[#262626]',
  autre: 'bg-[#262626] text-muted border-[#262626]',
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
  if (days < 7) return `il y a ${days}j`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatFull(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  });
}

// ─── Filter sidebar ───────────────────────────────────────────────────────────

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
  const unread = nonArchived.filter((m) => m.statut === 'non_lu').length;
  const archived = messages.filter((m) => m.statut === 'archive').length;

  const typeCounts = Object.keys(TYPE_LABELS).reduce<Record<string, number>>((acc, t) => {
    acc[t] = nonArchived.filter((m) => m.type_demande === t).length;
    return acc;
  }, {});

  const btn = (f: Filter, label: string, count?: number) => (
    <button
      key={f}
      onClick={() => onFilterChange(f)}
      className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors
        ${filter === f ? 'bg-[#161616] text-on-surface' : 'text-muted hover:bg-[#111] hover:text-on-surface'}`}
    >
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-2 rounded-full bg-[#262626] px-1.5 py-0.5 font-mono text-[10px] text-muted">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <aside className="flex w-[180px] shrink-0 flex-col gap-0.5 border-r border-[#262626] p-3">
      {btn('non_lu', 'Non lus', unread)}
      {btn('tous', 'Tous', nonArchived.length)}
      <hr className="my-2 border-[#262626]" />
      {Object.entries(TYPE_LABELS).map(([t, label]) => btn(t as Filter, label, typeCounts[t]))}
      <hr className="my-2 border-[#262626]" />
      {btn('archive', 'Archivés', archived)}
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
        const isUnread = msg.statut === 'non_lu';
        const isSelected = msg.id === selectedId;

        return (
          <button
            key={msg.id}
            onClick={() => onSelect(msg)}
            className={`relative flex w-full flex-col gap-1 border-b border-[#262626] px-4 py-3 text-left transition-colors
              ${isSelected ? 'bg-[#161616]' : 'hover:bg-[#111]'}`}
          >
            {isUnread && (
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
  isPending,
}: {
  message: ContactMessage;
  onMarkUnread: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  const subject = encodeURIComponent('Re: votre message via le portfolio');
  const mailtoHref = `mailto:${message.email}?subject=${subject}`;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Actions bar */}
      <div className="flex items-center gap-2 border-b border-[#262626] px-6 py-3">
        <button
          onClick={onMarkUnread}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md border border-[#262626] px-3 py-1.5 text-xs text-muted transition-colors hover:border-[#363636] hover:text-on-surface"
          title="Marquer comme non lu"
        >
          <Mail size={13} />
          Non lu
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
        <a
          href={mailtoHref}
          className="flex items-center gap-1.5 rounded-md border border-[#262626] px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <ExternalLink size={13} />
          Répondre par email
        </a>
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
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              {message.email}
            </a>
            {message.entreprise && (
              <p className="text-sm text-muted">{message.entreprise}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <span className={`rounded border px-2 py-1 font-mono text-[10px] ${TYPE_COLORS[message.type_demande]}`}>
              {TYPE_LABELS[message.type_demande]}
            </span>
            <p className="mt-1.5 font-mono text-[10px] text-muted">
              {formatFull(message.date_reception)}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-on-surface/90">{message.message}</p>
      </div>

      {/* Footer */}
      <div className="border-t border-[#262626] px-6 py-3">
        <p className="font-mono text-[10px] text-muted">
          Reçu via le formulaire de contact le{' '}
          {new Date(message.date_reception).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Europe/Paris',
          })}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MessageInbox({ messages: initial }: { messages: ContactMessage[] }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<Filter>('non_lu');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState(initial);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sync avec refresh serveur
  useEffect(() => { setMessages(initial); }, [initial]);

  // Filtre des messages
  const filtered = messages.filter((m) => {
    if (filter === 'archive') return m.statut === 'archive';
    if (filter === 'non_lu') return m.statut === 'non_lu';
    if (filter === 'tous') return m.statut !== 'archive';
    return m.type_demande === filter && m.statut !== 'archive';
  });

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const handleSelect = (msg: ContactMessage) => {
    setSelectedId(msg.id);
    if (msg.statut === 'non_lu') {
      // Optimistic update
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, statut: 'lu' as const } : m)),
      );
      startTransition(async () => {
        await markMessageRead(msg.id);
        router.refresh();
      });
    }
  };

  const run = (fn: () => Promise<void>, msg: string, afterFn?: () => void) => {
    startTransition(async () => {
      await fn();
      showToast(msg);
      afterFn?.();
      router.refresh();
    });
  };

  return (
    <div className="flex h-full">
      <FilterSidebar messages={messages} filter={filter} onFilterChange={setFilter} />

      <MessageList messages={filtered} selectedId={selectedId} onSelect={handleSelect} />

      {selected ? (
        <MessageDetail
          message={selected}
          isPending={isPending}
          onMarkUnread={() =>
            run(async () => {
              await markMessageUnread(selected.id);
              setMessages((prev) =>
                prev.map((m) => (m.id === selected.id ? { ...m, statut: 'non_lu' as const } : m)),
              );
            }, 'Marqué comme non lu')
          }
          onArchive={() =>
            run(
              () => archiveMessage(selected.id),
              'Message archivé',
              () => setSelectedId(null),
            )
          }
          onDelete={() => setConfirmDeleteId(selected.id)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted">Sélectionnez un message</p>
        </div>
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
                setSelectedId(null);
                setConfirmDeleteId(null);
              },
            );
          }
        }}
      />
    </div>
  );
}
