import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { db, contactMessages } from '@/db';
import { eq, count } from 'drizzle-orm';
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

  // Compte des messages non lus pour le badge sidebar
  const [{ value: unreadCount }] = await db
    .select({ value: count() })
    .from(contactMessages)
    .where(eq(contactMessages.statut, 'non_lu'));

  return (
    <ToastProvider>
      <KeyboardShortcuts />
      <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-on-surface">
        <Sidebar unreadCount={unreadCount} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main id="main-content" className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
