import Link from 'next/link';
import { RiGithubFill, RiLinkedinFill, RiMailFill } from 'react-icons/ri';

export default function Footer() {
  return (
    <footer className="border-t bg-surface-raised mt-16" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Yvan Kerdanet
        </p>

        <nav aria-label="Liens légaux">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted">
            <li>
              <Link href="/legal" className="hover:text-on-surface transition-colors underline-offset-4 hover:underline">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/legal#cookies" className="hover:text-on-surface transition-colors underline-offset-4 hover:underline">
                Politique de cookies
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4" role="list" aria-label="Réseaux sociaux">
          <a
            href="mailto:kerdanety@gmail.com"
            aria-label="Envoyer un email à Yvan Kerdanet"
            className="text-muted hover:text-on-surface transition-colors"
            role="listitem"
          >
            <RiMailFill size={18} aria-hidden="true" />
          </a>
          <a
            href="https://github.com/KerdanetYvan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Profil GitHub de Yvan Kerdanet (nouvelle fenêtre)"
            className="text-muted hover:text-on-surface transition-colors"
            role="listitem"
          >
            <RiGithubFill size={18} aria-hidden="true" />
          </a>
          <a
            href="https://linkedin.com/in/yvankerdanet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Profil LinkedIn de Yvan Kerdanet (nouvelle fenêtre)"
            className="text-muted hover:text-on-surface transition-colors"
            role="listitem"
          >
            <RiLinkedinFill size={18} aria-hidden="true" />
          </a>
        </div>

      </div>
    </footer>
  );
}
