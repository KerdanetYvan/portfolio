import Link from 'next/link';
import { RiMailSendLine } from 'react-icons/ri';

export default function ContactCTA() {
  return (
    <section
      aria-labelledby="contact-cta-title"
      className="mx-auto max-w-[1200px] px-4 py-20 border-t"
    >
      <div className="rounded-xl border bg-surface-raised p-8 md:p-12 text-center">
        <p className="font-mono text-xs text-accent-bg mb-2">// contact</p>
        <h2 id="contact-cta-title" className="text-2xl md:text-3xl font-bold text-on-surface mb-3">
          Un projet ? Une opportunité ?
        </h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          Je suis disponible pour une alternance à partir de novembre 2026.
          N'hésitez pas à me contacter.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent-bg text-[#0a0a0a] font-medium hover:bg-accent-bg-hover transition-colors"
        >
          <RiMailSendLine size={16} aria-hidden="true" />
          Me contacter
        </Link>
      </div>
    </section>
  );
}
