'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Settings2,
  MessageSquare,
  FileText,
  Calendar,
  Wallet,
  CheckSquare,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type NavItem = {
  icon: LucideIcon;
  label: string;
  href?: string;
  exact?: boolean;
  disabled?: boolean;
  badgeCount?: number;
};

type Props = { unreadCount: number };

export default function Sidebar({ unreadCount }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { icon: Home, label: 'Accueil', href: '/dashboard', exact: true },
    { icon: Settings2, label: 'Personnaliser', href: '/dashboard/personnalize' },
    { icon: FileText, label: 'Mon CV', href: '/dashboard/cv' },
    {
      icon: MessageSquare,
      label: 'Messages',
      href: '/dashboard/contact_message',
      badgeCount: unreadCount,
    },
    { icon: Calendar, label: 'Planning', disabled: true },
    { icon: Wallet, label: 'Argent', disabled: true },
    { icon: CheckSquare, label: 'Tâches', disabled: true },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <aside className="group/sidebar relative flex h-screen w-[60px] shrink-0 flex-col overflow-hidden border-r border-[#262626] bg-[#0a0a0a] transition-[width] duration-200 ease-out hover:w-[220px]">
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-[#262626] px-[18px]">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent font-bold text-xs text-black">
          YK
        </div>
        <span className="ml-3 whitespace-nowrap text-sm font-semibold text-on-surface opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">
          Dashboard
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 p-2 pt-3">
        {navItems.map((item) => {
          const isActive = item.href
            ? item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            : false;

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="group/item relative flex h-9 cursor-not-allowed items-center rounded-md px-2.5 opacity-35"
                title={`${item.label} — bientôt`}
              >
                <item.icon size={18} className="shrink-0 text-muted" />
                <span className="ml-3 whitespace-nowrap text-sm text-muted opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">
                  {item.label}
                  <span className="ml-2 text-[10px] opacity-60">bientôt</span>
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`group/item relative flex h-9 items-center rounded-md px-2.5 transition-colors
                ${isActive
                  ? 'bg-[#161616] text-on-surface'
                  : 'text-muted hover:bg-[#111] hover:text-on-surface'
                }`}
            >
              {isActive && (
                <span className="absolute -left-2 top-1.5 bottom-1.5 w-0.5 rounded-full bg-accent" />
              )}
              <item.icon size={18} className="shrink-0" />
              <span className="ml-3 flex-1 whitespace-nowrap text-sm opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">
                {item.label}
              </span>
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span className="ml-auto shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-black opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">
                  {item.badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#262626] p-2">
        <button
          onClick={handleLogout}
          className="flex h-9 w-full items-center rounded-md px-2.5 text-muted transition-colors hover:bg-[#111] hover:text-red-400"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="ml-3 whitespace-nowrap text-sm opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
}
