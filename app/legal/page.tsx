import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales — Kerdanet Yvan',
  description: 'Mentions légales et politique de cookies du portfolio de Yvan Kerdanet.',
};

export default function Legal() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-on-surface mb-2">Mentions légales</h1>
      <p className="text-sm text-muted mb-12">Conformément aux articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).</p>

      <section className="mb-10" aria-labelledby="editeur">
        <h2 id="editeur" className="text-xl font-semibold text-on-surface mb-3">Éditeur du site</h2>
        <ul className="text-muted space-y-1 text-sm">
          <li><span className="text-on-surface font-medium">Nom :</span> Yvan Kerdanet</li>
          <li><span className="text-on-surface font-medium">Statut :</span> Particulier</li>
          <li>
            <span className="text-on-surface font-medium">Contact :</span>{' '}
            <a href="mailto:kerdanety@gmail.com" className="text-accent hover:underline">
              kerdanety@gmail.com
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-10" aria-labelledby="hebergeur">
        <h2 id="hebergeur" className="text-xl font-semibold text-on-surface mb-3">Hébergement</h2>
        <ul className="text-muted space-y-1 text-sm">
          <li><span className="text-on-surface font-medium">Hébergeur :</span> Vercel Inc.</li>
          <li><span className="text-on-surface font-medium">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
          <li>
            <span className="text-on-surface font-medium">Site :</span>{' '}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              vercel.com
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-10" aria-labelledby="propriete">
        <h2 id="propriete" className="text-xl font-semibold text-on-surface mb-3">Propriété intellectuelle</h2>
        <p className="text-muted text-sm leading-relaxed">
          L'ensemble du contenu de ce site (textes, images, code source) est la propriété exclusive de Yvan Kerdanet, sauf mention contraire. Toute reproduction, distribution ou modification sans autorisation préalable est interdite.
        </p>
      </section>

      <section className="mb-10" aria-labelledby="donnees">
        <h2 id="donnees" className="text-xl font-semibold text-on-surface mb-3">Données personnelles</h2>
        <p className="text-muted text-sm leading-relaxed">
          Ce site ne collecte aucune donnée personnelle à des fins de suivi ou de marketing. Aucun formulaire de contact ne stocke de données ; les échanges par email sont gérés directement via votre client mail.
          Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679), vous pouvez exercer vos droits d'accès, de rectification et de suppression en contactant{' '}
          <a href="mailto:kerdanety@gmail.com" className="text-accent hover:underline">kerdanety@gmail.com</a>.
        </p>
      </section>

      <section id="cookies" aria-labelledby="cookies-title">
        <h2 id="cookies-title" className="text-xl font-semibold text-on-surface mb-3">Politique de cookies</h2>
        <p className="text-muted text-sm leading-relaxed mb-4">
          Ce site utilise un unique cookie technique, strictement nécessaire au bon fonctionnement du site. Il ne requiert pas votre consentement (article 82 de la loi Informatique et Libertés, directive ePrivacy).
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-raised">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium text-on-surface">Nom</th>
                <th scope="col" className="px-4 py-3 font-medium text-on-surface">Finalité</th>
                <th scope="col" className="px-4 py-3 font-medium text-on-surface">Durée</th>
                <th scope="col" className="px-4 py-3 font-medium text-on-surface">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3 font-mono text-on-surface">theme</td>
                <td className="px-4 py-3 text-muted">Mémorise votre préférence d'affichage (mode clair / sombre)</td>
                <td className="px-4 py-3 text-muted">1 an</td>
                <td className="px-4 py-3 text-muted">Fonctionnel — 1ère partie</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted text-sm mt-4">
          Vous pouvez supprimer ce cookie à tout moment via les paramètres de votre navigateur, sans impact sur l'accessibilité du site (votre préférence reviendra simplement à la valeur système par défaut).
        </p>
      </section>
    </div>
  );
}
