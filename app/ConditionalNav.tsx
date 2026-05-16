'use client';

import { usePathname } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import type { ReactNode } from 'react';

export default function ConditionalNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
