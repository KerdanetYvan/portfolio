'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RiSearchLine, RiArrowRightSLine } from 'react-icons/ri';

interface Command {
  label: string;
  href: string;
  shortcut: string | null;
}

const COMMANDS: Command[] = [
  { label: 'Accueil',           href: '/',        shortcut: 'G H' },
  { label: 'Projets',           href: '/projects', shortcut: 'G P' },
  { label: 'Compétences',       href: '/skills',   shortcut: 'G S' },
  { label: 'À propos',          href: '/about',    shortcut: 'G A' },
  { label: 'Contact',           href: '/contact',  shortcut: 'G C' },
  { label: 'Blog',              href: '/blog',     shortcut: 'G B' },
  { label: 'Mentions légales',  href: '/legal',    shortcut: null  },
];

export default function CommandPalette() {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const [idx, setIdx]     = useState(0);
  const inputRef          = useRef<HTMLInputElement>(null);
  const router            = useRouter();

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const close    = useCallback(() => { setOpen(false); setQuery(''); setIdx(0); }, []);
  const navigate = useCallback((href: string) => { router.push(href); close(); }, [router, close]);

  /* Cmd+K / Ctrl+K to open */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  /* Focus input on open */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[idx]) navigate(filtered[idx].href);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Palette de commandes"
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-surface-raised shadow-2xl overflow-hidden">

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <RiSearchLine size={16} className="text-muted shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIdx(0); }}
            onKeyDown={onKeyDown}
            placeholder="Rechercher une page..."
            className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-muted outline-none font-mono"
            aria-autocomplete="list"
            aria-controls="cmd-list"
          />
          <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted">
            ESC
          </kbd>
        </div>

        {/* Liste */}
        <ul id="cmd-list" role="listbox" className="py-1 max-h-72 overflow-y-auto">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted text-center">Aucun résultat</li>
          )}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.href}
              role="option"
              aria-selected={i === idx}
              onClick={() => navigate(cmd.href)}
              onMouseEnter={() => setIdx(i)}
              className={`
                flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors
                ${i === idx ? 'bg-surface-elevated text-on-surface' : 'text-muted hover:bg-surface-elevated hover:text-on-surface'}
              `}
            >
              <span className="flex items-center gap-2">
                <RiArrowRightSLine size={14} aria-hidden="true" />
                {cmd.label}
              </span>
              {cmd.shortcut && (
                <kbd className="font-mono text-[10px] text-muted">{cmd.shortcut}</kbd>
              )}
            </li>
          ))}
        </ul>

        <div className="px-4 py-2 border-t flex gap-4 text-[10px] font-mono text-muted">
          <span>↑↓ naviguer</span>
          <span>↵ ouvrir</span>
          <span>esc fermer</span>
        </div>
      </div>
    </div>
  );
}
