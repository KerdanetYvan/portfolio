import Header from './components/Header';
import Footer from './components/Footer';
import type { ReactNode } from 'react';

export default function ConditionalNav({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
