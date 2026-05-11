'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { RiSunLine, RiMoonLine } from 'react-icons/ri';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md text-muted hover:text-on-surface hover:bg-surface-raised transition-colors cursor-pointer"
      aria-label={resolvedTheme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {resolvedTheme === 'dark' ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
    </button>
  );
}
