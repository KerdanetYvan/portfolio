export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string;
  tags: string[];
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch(`${API_URL}/blog/posts`, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as BlogPostSummary[];
  } catch (err) {
    console.error('[getBlogPosts]', err);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(`${API_URL}/blog/posts/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as BlogPostDetail;
  } catch (err) {
    console.error('[getBlogPost]', err);
    return null;
  }
}
