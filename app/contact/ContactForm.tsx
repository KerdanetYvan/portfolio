'use client';
import { useState, useRef, useEffect } from 'react';
import { track } from '@vercel/analytics';
import {
  RiCheckLine, RiCloseLine, RiLoader4Line,
  RiFileCopyLine, RiArrowDownSLine,
} from 'react-icons/ri';
import { SiGithub, SiLinkedin, SiReddit } from 'react-icons/si';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const SOCIALS = [
  { name: 'GitHub',   handle: 'KerdanetYvan', href: 'https://github.com/KerdanetYvan',       Icon: SiGithub   },
  { name: 'LinkedIn', handle: 'yvankerdanet',  href: 'https://linkedin.com/in/yvankerdanet',  Icon: SiLinkedin },
  { name: 'Reddit',   handle: 'yvankdt',       href: 'https://reddit.com/user/yvankdt',       Icon: SiReddit   },
];

const inputBase = [
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-on-surface',
  'placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent-bg',
  'focus:border-accent-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [copied, setCopied] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const frozen = status === 'loading' || status === 'success';

  // Auto-retour à idle après 3s en état error (pour permettre un retry)
  useEffect(() => {
    if (status !== 'error') return;
    const t = setTimeout(() => setStatus('idle'), 3000);
    return () => clearTimeout(t);
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'error') { setStatus('idle'); return; }
    if (honeypotRef.current?.value) return;

    setStatus('loading');
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom:          data.name,
          email:        data.email,
          type_demande: data.type,
          entreprise:   data.company || undefined,
          message:      data.message,
          _honeypot:    data.website,
        }),
      });
      if (!res.ok) throw new Error();
      track('contact_form_submitted');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  async function copyEmail() {
    await navigator.clipboard.writeText('kerdanety@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-10 space-y-10">
      {/* Annonce live region pour les lecteurs d'écran */}
      <div aria-live="polite" className="sr-only">
        {status === 'success' && 'Message envoyé avec succès.'}
        {status === 'error' && "Erreur lors de l'envoi. Cliquez sur le bouton pour réessayer."}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-2xl space-y-5">
        {/* Honeypot anti-spam */}
        <input
          ref={honeypotRef}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -top-[9999px] left-0 h-0 w-0 opacity-0 pointer-events-none"
        />

        {/* Nom + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="cf-name" className="block text-xs font-medium text-on-surface">
              Nom <span className="text-accent-bg" aria-hidden="true">*</span>
            </label>
            <input
              id="cf-name" name="name" type="text" required
              placeholder="Yvan Kerdanet"
              className={inputBase} disabled={frozen}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cf-email" className="block text-xs font-medium text-on-surface">
              Email <span className="text-accent-bg" aria-hidden="true">*</span>
            </label>
            <input
              id="cf-email" name="email" type="email" required
              placeholder="vous@exemple.com"
              className={inputBase} disabled={frozen}
            />
          </div>
        </div>

        {/* Type + Entreprise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="cf-type" className="block text-xs font-medium text-on-surface">
              Type de demande <span className="text-accent-bg" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <select
                id="cf-type" name="type" required defaultValue=""
                className={`${inputBase} appearance-none pr-8`}
                disabled={frozen}
              >
                <option value="" disabled>Choisir...</option>
                <option value="alternance">Alternance</option>
                <option value="mission_freelance">Mission freelance</option>
                <option value="question">Question</option>
                <option value="autre">Autre</option>
              </select>
              <RiArrowDownSLine
                size={16}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cf-company" className="block text-xs font-medium text-on-surface">
              Entreprise / Structure{' '}
              <span className="font-normal text-muted">(optionnel)</span>
            </label>
            <input
              id="cf-company" name="company" type="text"
              placeholder="Acme Corp"
              className={inputBase} disabled={frozen}
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="cf-message" className="block text-xs font-medium text-on-surface">
            Message <span className="text-accent-bg" aria-hidden="true">*</span>
          </label>
          <textarea
            id="cf-message" name="message" required rows={6}
            placeholder="Décrivez votre projet ou votre demande..."
            className={`${inputBase} resize-none`}
            disabled={frozen}
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={frozen}
          className={[
            'relative w-full overflow-hidden rounded-md py-2.5 px-4 text-sm font-medium',
            'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-accent-bg focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
            status === 'success' ? 'bg-[#238636] text-white cursor-default' : '',
            status === 'error'   ? 'bg-[#da3633] text-white cursor-pointer'  : '',
            status === 'idle' || status === 'loading'
              ? 'bg-accent-bg text-[#0a0a0a] hover:bg-accent-bg-hover disabled:opacity-70'
              : '',
          ].join(' ')}
        >
          {/* Idle */}
          <span className={[
            'flex items-center justify-center gap-2',
            'transition-all duration-200 motion-reduce:transition-none',
            status === 'idle' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 motion-reduce:hidden',
          ].join(' ')}>
            Envoyer →
          </span>
          {/* Loading */}
          <span
            aria-hidden={status !== 'loading'}
            className={[
              'absolute inset-0 flex items-center justify-center',
              'transition-all duration-200 motion-reduce:transition-none',
              status === 'loading' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 motion-reduce:hidden',
            ].join(' ')}
          >
            <RiLoader4Line size={18} className="animate-spin motion-reduce:animate-none" />
          </span>
          {/* Success */}
          <span
            aria-hidden={status !== 'success'}
            className={[
              'absolute inset-0 flex items-center justify-center gap-2',
              'transition-all duration-200 motion-reduce:transition-none',
              status === 'success' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 motion-reduce:hidden',
            ].join(' ')}
          >
            <RiCheckLine size={18} /> Message envoyé
          </span>
          {/* Error */}
          <span
            aria-hidden={status !== 'error'}
            className={[
              'absolute inset-0 flex items-center justify-center gap-2',
              'transition-all duration-200 motion-reduce:transition-none',
              status === 'error' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 motion-reduce:hidden',
            ].join(' ')}
          >
            <RiCloseLine size={18} /> Erreur — réessayer
          </span>
        </button>
      </form>

      {/* Contact direct + Réseaux */}
      <div className="mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-border">
        <div>
          <p className="font-mono text-xs text-accent-bg mb-3">// contact direct</p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-on-surface">kerdanety@gmail.com</span>
            <button
              onClick={copyEmail}
              className="flex items-center gap-1.5 font-mono text-xs text-muted hover:text-on-surface transition-colors"
              aria-label="Copier l'adresse email"
            >
              {copied ? (
                <>
                  <RiCheckLine size={13} className="text-accent-bg" />
                  <span className="text-accent-bg">Copié</span>
                </>
              ) : (
                <>
                  <RiFileCopyLine size={13} />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs text-accent-bg mb-3">// réseaux</p>
          <div className="space-y-2">
            {SOCIALS.map(({ name, handle, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted hover:text-on-surface transition-colors group"
              >
                <Icon size={14} className="shrink-0 group-hover:text-accent-bg transition-colors" aria-hidden="true" />
                <span className="text-on-surface">{name}</span>
                <span className="font-mono text-xs">@{handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
