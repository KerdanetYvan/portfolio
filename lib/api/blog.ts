export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch(`${API_URL}/blog/posts`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return (await res.json()) as BlogPostSummary[];
  } catch {
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(`${API_URL}/blog/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as BlogPostDetail;
  } catch {
    return null;
  }
}
