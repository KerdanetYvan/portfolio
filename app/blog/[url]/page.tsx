import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Metadata } from 'next';
import { RiArrowLeftLine } from 'react-icons/ri';
import { getBlogPost } from '@/lib/api/blog';
import { mdComponents } from '@/lib/markdown-components';
import { buildMetadata } from '@/lib/site';
import { ArticleViewTracker } from './ArticleViewTracker';

interface PageProps {
  params: Promise<{ url: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { url } = await params;
  const post = await getBlogPost(url);
  return buildMetadata({
    title: post ? `${post.title} — Yvan Kerdanet` : 'Article — Yvan Kerdanet',
    description: post?.excerpt ?? undefined,
    path: `/blog/${url}`,
    image: post?.cover_image_url ?? undefined,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { url } = await params;
  const post = await getBlogPost(url);

  if (!post) notFound();

  return (
    <main id="main-content" className="min-h-screen">
      <div className="mx-auto max-w-[800px] px-4 py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-on-surface transition-colors mb-8"
        >
          <RiArrowLeftLine size={14} aria-hidden="true" />
          Tous les articles
        </Link>

        <article>
          <ArticleViewTracker slug={post.slug} />
          {post.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image_url}
              alt=""
              className="mb-6 max-h-[400px] w-full rounded-md object-cover"
            />
          )}
          <p className="font-mono text-xs text-muted mb-2">{formatDate(post.published_at)}</p>
          <h1 className={`text-3xl font-bold text-on-surface ${post.tags.length > 0 ? 'mb-2' : 'mb-6'}`}>
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] px-2 py-0.5 rounded border border-border text-muted bg-surface"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose-custom">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={mdComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </main>
  );
}
