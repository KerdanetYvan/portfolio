'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

// Compteur de vues volontairement découplé de la lecture du contenu :
// generateMetadata et le corps de page appellent tous les deux getBlogPost
// (cache: 'no-store', pas de dédup garanti), et le prefetch de <Link>
// appellerait aussi le contenu sans que ce soit une vraie vue. Un composant
// client monté une fois n'est ni prefetché ni ré-exécuté par ces lectures :
// seule une vraie navigation déclenche cet effet.
export function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track('article_viewed', { slug });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/${encodeURIComponent(slug)}/view`, {
      method: 'POST',
    }).catch(() => {
      // Télémétrie non-critique : échec ignoré volontairement.
    });
  }, [slug]);

  return null;
}
