import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import { getActiveStatus } from '@/db/queries/status';
import { COULEUR_CLASSES } from '@/lib/colors';
import type { Couleur } from '@/lib/colors';

export const metadata: Metadata = {
  title: 'Contact — Yvan Kerdanet',
  description: "Envie de discuter d'un projet ou d'une opportunité ? Contactez-moi directement.",
};

export default async function ContactPage() {
  const status = await getActiveStatus();
  const couleurClasses = status
    ? COULEUR_CLASSES[status.couleur as Couleur]
    : null;

  return (
    <main id="main-content" className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-xs text-accent-bg mb-2">// contact</p>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-3">Contact</h1>
          <p className="text-muted max-w-xl mb-6">
            Envie de discuter d&apos;un projet ou d&apos;une opportunité ?
          </p>

          {/* Bandeau disponibilité dynamique */}
          {status && couleurClasses && (
            <div
              className={`inline-flex items-center gap-2.5 rounded-md border px-4 py-2.5 ${couleurClasses.border} ${couleurClasses.bg}`}
            >
              <span
                className={`h-4 w-4 shrink-0 rounded-full ${couleurClasses.dot}`}
                aria-hidden="true"
              />
              <span className="text-sm text-on-surface">{status.libelle}</span>
            </div>
          )}

          <p className="font-mono text-xs text-muted mt-4">
            Je réponds généralement sous 48h.
          </p>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
