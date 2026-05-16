import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUnreadMessagesCount } from '@/db/queries/dashboard';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import { ToastProvider } from './components/ToastProvider';
import KeyboardShortcuts from './components/KeyboardShortcuts';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const adminId = process.env.ADMIN_USER_ID;
  if (adminId && user.id !== adminId) redirect('/login?error=unauthorized');

  // Prénom depuis user_metadata GitHub OAuth (full_name ou name), fallback email
  const meta = user.user_metadata as Record<string, string> | undefined;
  const displayName =
    (meta?.full_name ?? meta?.name ?? '').split(' ')[0] ||
    (user.email?.split('@')[0] ?? 'Admin');

  const unreadCount = await getUnreadMessagesCount();

  return (
    <ToastProvider>
      <KeyboardShortcuts />
      <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-on-surface">
        <Sidebar unreadCount={unreadCount} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader displayName={displayName} />
          <main id="main-content" className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
