import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Seules les routes /dashboard/* sont protégées
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Sécurité par défaut : si ADMIN_USER_ID n'est pas défini, tout accès est refusé
  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId) {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
  }

  const { supabase, supabaseResponse, user } = await updateSession(request);

  // Pas de session → redirection login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Session mais mauvais utilisateur → déconnexion + redirection
  if (user.id !== adminUserId) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
