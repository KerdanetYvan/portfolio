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
          <p className="font-mono text-xs text-muted mb-2">{formatDate(post.published_at)}</p>
          <h1 className="text-3xl font-bold text-on-surface mb-6">{post.title}</h1>

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
