'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TiThMenu } from 'react-icons/ti';
import { RiCloseLine } from 'react-icons/ri';
import Logo from '../../public/favicon.webp';
import ThemeToggle from './ThemeToggle';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/projects',  label: 'Projets'       },
  { href: '/skills',    label: 'Compétences'   },
  { href: '/about',     label: 'À Propos'      },
  { href: '/blog',      label: 'Blog'          },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        <Link href="/" className="flex items-center gap-2 font-semibold text-on-surface">
          <Image src={Logo} alt="logo" width={24} height={24} className="rounded-sm" />
          <span>Yvan Kerdanet</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-sm text-muted hover:text-on-surface rounded-md hover:bg-surface-raised transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="ml-2 h-4 w-px bg-border" />
          <ThemeToggle />
          <Link
            href="/contact"
            className="ml-2 px-3 py-1.5 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            Me contacter
          </Link>
        </nav>

        {/* Mobile : toggle + burger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-muted hover:text-on-surface hover:bg-surface-raised transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <RiCloseLine size={20} /> : <TiThMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Nav mobile */}
      {isOpen && (
        <div className="md:hidden border-t bg-surface px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm text-muted hover:text-on-surface rounded-md hover:bg-surface-raised transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-2 px-3 py-2 text-sm font-medium text-center rounded-md bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            Me contacter
          </Link>
        </div>
      )}
    </header>
  );
}
