import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RiArrowRightLine } from 'react-icons/ri';
import { getBlogPosts } from '@/lib/api/blog';

export const metadata: Metadata = {
  title: 'Blog — Yvan Kerdanet',
  description: 'Articles techniques et retours d\'expérience.',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Pas d'article publié : la page n'existe pas plutôt que de proposer une
  // section vide (cohérent avec le lien "Blog" masqué de la nav).
  if (posts.length === 0) notFound();

  return (
    <main id="main-content" className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="mb-10">
          <p className="font-mono text-xs text-accent-bg mb-2">// blog</p>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-3">Blog</h1>
          <p className="text-muted max-w-xl">
            Articles techniques et retours d&apos;expérience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card-hover flex flex-col gap-3 rounded-lg border border-border bg-surface-raised p-5"
            >
              <span className="font-mono text-xs text-muted">{formatDate(post.published_at)}</span>
              <h2 className="text-lg font-semibold text-on-surface">{post.title}</h2>
              {post.excerpt && (
                <p className="text-sm text-muted leading-relaxed flex-1">{post.excerpt}</p>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm text-accent mt-auto">
                Lire l&apos;article <RiArrowRightLine size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
