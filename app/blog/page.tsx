import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPosts } from '@/lib/api/blog';
import { buildMetadata } from '@/lib/site';
import TagList from './TagList';

export const metadata: Metadata = buildMetadata({
  title: 'Blog - Yvan Kerdanet',
  description: 'Articles techniques et retours d\'expérience.',
  path: '/blog',
});

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
          {posts.map((post) => {
            const cover = post.cover_image_url;
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card-hover group relative isolate flex h-56 flex-col justify-end overflow-hidden rounded-lg border border-border bg-surface-raised p-5"
              >
                {cover && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                    />
                    {/* Dégradé bas → haut : garantit la lisibilité du texte quelle que soit l'image */}
                    <div
                      className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/40 to-black/0"
                      aria-hidden="true"
                    />
                  </>
                )}

                <span className={`font-mono text-xs mb-1.5 ${cover ? 'text-white/80' : 'text-muted'}`}>
                  {formatDate(post.published_at)}
                </span>
                <h2 className={`line-clamp-2 text-lg font-semibold leading-snug ${cover ? 'text-white' : 'text-on-surface'}`}>
                  {post.title}
                </h2>
                {post.tags.length > 0 && (
                  <TagList
                    tags={post.tags}
                    pillClassName={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                      cover
                        ? 'border-white/20 bg-black/40 text-white/90 backdrop-blur-sm'
                        : 'border-border bg-surface text-muted'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
