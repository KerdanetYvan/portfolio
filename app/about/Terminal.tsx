'use client';
import { useEffect, useRef, useState } from 'react';

interface Line {
  kind: 'prompt' | 'response' | 'continue';
  text: string;
}

const SCRIPT: Line[] = [
  { kind: 'prompt',   text: 'whoami' },
  { kind: 'response', text: 'Yvan Kerdanet — dev fullstack' },
  { kind: 'prompt',   text: 'cat status.txt' },
  { kind: 'response', text: '🟢  En alternance · disponible nov. 2026' },
  { kind: 'response', text: 'Paris, FR · origines bretonnes' },
  { kind: 'response', text: 'Bachelor CDSD · Digital Campus Paris' },
  { kind: 'prompt',   text: 'ls interests/' },
  { kind: 'response', text: 'web-dev/  automation/  3d-printing/' },
  { kind: 'prompt',   text: 'echo $MOTTO' },
  { kind: 'response', text: '"À tout problème, sa solution."' },
  { kind: 'continue', text: './continue.sh' },
];

const CHAR_DELAY = 38;
const RESPONSE_DELAY = 120;
const PROMPT_PAUSE = 350;

export default function Terminal({ onContinue }: { onContinue: () => void }) {
  const [lines, setLines] = useState<{ line: Line; typed: string; done: boolean }[]>([]);
  const [showSkip, setShowSkip] = useState(false);
  const [finished, setFinished] = useState(false);
  const progressRef = useRef({ lineIdx: 0, charIdx: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alreadyPlayed = sessionStorage.getItem('about-terminal-played') === '1';

    if (prefersReduced || alreadyPlayed) {
      const full = SCRIPT.map((line) => ({ line, typed: line.text, done: true }));
      setLines(full);
      setFinished(true);
      return;
    }

    const skipTimer = setTimeout(() => setShowSkip(true), 1500);

    function tick() {
      const { lineIdx, charIdx } = progressRef.current;

      if (lineIdx >= SCRIPT.length) {
        sessionStorage.setItem('about-terminal-played', '1');
        setFinished(true);
        return;
      }

      const line = SCRIPT[lineIdx];

      if (charIdx === 0) {
        setLines((prev) => [...prev, { line, typed: '', done: false }]);
        const pause = line.kind === 'response' ? RESPONSE_DELAY : PROMPT_PAUSE;
        progressRef.current.charIdx = 1;
        timerRef.current = setTimeout(tick, pause);
        return;
      }

      if (line.kind === 'response' || line.kind === 'continue') {
        setLines((prev) => {
          const next = [...prev];
          next[next.length - 1] = { line, typed: line.text, done: true };
          return next;
        });
        progressRef.current = { lineIdx: lineIdx + 1, charIdx: 0 };
        timerRef.current = setTimeout(tick, RESPONSE_DELAY);
        return;
      }

      const typed = line.text.slice(0, charIdx);
      const isDone = charIdx >= line.text.length;

      setLines((prev) => {
        const next = [...prev];
        next[next.length - 1] = { line, typed, done: isDone };
        return next;
      });

      if (isDone) {
        progressRef.current = { lineIdx: lineIdx + 1, charIdx: 0 };
        timerRef.current = setTimeout(tick, PROMPT_PAUSE);
      } else {
        progressRef.current.charIdx = charIdx + 1;
        timerRef.current = setTimeout(tick, CHAR_DELAY);
      }
    }

    timerRef.current = setTimeout(tick, 600);

    return () => {
      clearTimeout(skipTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  function skip() {
    if (timerRef.current) clearTimeout(timerRef.current);
    const full = SCRIPT.map((line) => ({ line, typed: line.text, done: true }));
    setLines(full);
    setFinished(true);
    sessionStorage.setItem('about-terminal-played', '1');
  }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-surface px-4">
      {/* macOS chrome */}
      <div className="w-full max-w-2xl rounded-xl border border-border bg-[#0d1117] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-auto font-mono text-[11px] text-muted">yvan@portfolio ~ %</span>
        </div>

        <div
          ref={containerRef}
          className="h-72 overflow-y-auto p-5 font-mono text-sm leading-relaxed scroll-smooth"
        >
          {lines.map((entry, i) => {
            if (entry.line.kind === 'prompt') {
              return (
                <p key={i}>
                  <span className="text-accent-bg">❯ </span>
                  <span className="text-on-surface">{entry.typed}</span>
                  {!entry.done && <span className="inline-block w-[7px] h-[1em] bg-on-surface animate-pulse align-middle ml-px" aria-hidden="true" />}
                </p>
              );
            }
            if (entry.line.kind === 'continue') {
              return (
                <p key={i} className="mt-2">
                  <span className="text-accent-bg">❯ </span>
                  {finished ? (
                    <button
                      onClick={onContinue}
                      className="text-accent-bg underline underline-offset-2 hover:text-accent transition-colors focus:outline-none"
                    >
                      {entry.typed}
                    </button>
                  ) : (
                    <span className="text-on-surface">{entry.typed}</span>
                  )}
                </p>
              );
            }
            return (
              <p key={i} className="text-muted pl-3">
                {entry.typed}
              </p>
            );
          })}
        </div>
      </div>

      {/* Skip */}
      {showSkip && !finished && (
        <button
          onClick={skip}
          className="mt-6 font-mono text-xs text-muted hover:text-on-surface transition-colors"
        >
          passer →
        </button>
      )}

      {/* Scroll CTA */}
      {finished && (
        <button
          onClick={onContinue}
          className="mt-8 flex flex-col items-center gap-2 font-mono text-xs text-muted hover:text-on-surface transition-colors"
          aria-label="Voir le profil complet"
        >
          <span>profil complet</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
