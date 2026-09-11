import Header from './components/Header';
import Footer from './components/Footer';
import { getBlogPosts } from '@/lib/api/blog';
import type { ReactNode } from 'react';

export default async function ConditionalNav({ children }: { children: ReactNode }) {
  const posts = await getBlogPosts();

  return (
    <>
      <Header showBlog={posts.length > 0} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
