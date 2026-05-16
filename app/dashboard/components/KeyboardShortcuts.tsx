'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function KeyboardShortcuts() {
  const router = useRouter();
  const lastKey = useRef('');
  const lastKeyTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        document.dispatchEvent(new CustomEvent('dashboard:escape'));
        return;
      }

      const now = Date.now();
      if (lastKey.current === 'g' && now - lastKeyTime.current < 500) {
        if (e.key === 'd') { router.push('/dashboard'); lastKey.current = ''; return; }
        if (e.key === 'p') { router.push('/dashboard/personnalize'); lastKey.current = ''; return; }
        if (e.key === 'm') { router.push('/dashboard/contact_message'); lastKey.current = ''; return; }
      }

      lastKey.current = e.key;
      lastKeyTime.current = now;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null;
}
