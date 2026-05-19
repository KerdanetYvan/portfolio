// Extraction de mots-clés depuis une offre d'emploi (aucune dépendance externe)

const STOPWORDS_FR = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'en', 'et', 'ou', 'ou',
  'est', 'sont', 'etre', 'avoir', 'avec', 'dans', 'sur', 'par', 'pour',
  'que', 'qui', 'dont', 'ni', 'mais', 'donc', 'or', 'a', 'au', 'aux',
  'ce', 'cet', 'cette', 'ces', 'se', 'ne', 'pas', 'plus', 'si', 'ca',
  'vous', 'nous', 'ils', 'elles', 'il', 'elle', 'on', 'je', 'tu',
  'votre', 'notre', 'leur', 'leurs', 'mon', 'ton', 'son', 'ma', 'ta', 'sa',
  'vos', 'nos', 'mes', 'tes', 'ses',
  'meme', 'aussi', 'tout', 'tous', 'toute', 'toutes', 'bien', 'tres',
  'moins', 'lors', 'deja', 'encore', 'peut', 'doit', 'faire', 'savoir',
  'selon', 'entre', 'sous', 'vers', 'chez', 'sans', 'apres', 'avant',
  'afin', 'lors', 'quand', 'comme', 'dont', 'alors', 'ainsi', 'cela',
  'quel', 'quelle', 'quels', 'quelles', 'autre', 'autres', 'chaque',
  'avoir', 'etre', 'faire', 'aller', 'voir', 'savoir', 'pouvoir', 'vouloir',
  'cette', 'partir', 'permettre', 'assurer', 'contribuer', 'participer',
  'travail', 'poste', 'equipe', 'entreprise', 'profil', 'candidat',
  'rejoindre', 'intégrer', 'intégrer', 'recherchons', 'cherchons',
]);

const STOPWORDS_EN = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'up', 'into', 'through', 'during',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'shall', 'can',
  'you', 'we', 'they', 'he', 'she', 'it', 'i', 'your', 'our', 'its',
  'this', 'that', 'these', 'those', 'all', 'any', 'both', 'each',
  'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'also', 'about',
  'working', 'work', 'team', 'company', 'position', 'role', 'join',
  'looking', 'seeking', 'candidate', 'experience', 'good', 'strong',
]);

const STOPWORDS = new Set([...STOPWORDS_FR, ...STOPWORDS_EN]);

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Extrait les mots-clés pertinents depuis un texte d'offre.
 * Retourne un tableau trié par fréquence décroissante.
 */
export function extractKeywords(text: string): string[] {
  if (!text) return [];

  const normalized = removeAccents(text.toLowerCase());

  // Split sur tout ce qui n'est pas une lettre ou un chiffre
  const tokens = normalized.split(/[^a-z0-9#.+]+/);

  const freq = new Map<string, number>();

  for (const token of tokens) {
    // Conserver les tokens techniques comme "node.js", "c++", "c#", "next.js"
    const clean = token.replace(/[^a-z0-9.#+]/g, '').replace(/\.+$/, '');

    if (clean.length < 2) continue;
    if (!clean.match(/[a-z]/)) continue; // doit contenir au moins une lettre
    if (STOPWORDS.has(clean)) continue;

    freq.set(clean, (freq.get(clean) ?? 0) + 1);
  }

  // Trier par fréquence décroissante, puis alphabétiquement
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([word]) => word);
}

/**
 * Vérifie si un terme est présent dans un texte normalisé.
 * Gère les correspondances partielles (ex: "typescript" dans "typescript/javascript")
 */
export function textContainsKeyword(text: string, keyword: string): boolean {
  const normalized = removeAccents(text.toLowerCase());
  const kw = removeAccents(keyword.toLowerCase());
  return normalized.includes(kw);
}

/**
 * Calcule un score de pertinence 0-100 pour un texte par rapport à un ensemble de mots-clés.
 */
export function computeScore(text: string, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0;
  const matches = keywords.filter((kw) => textContainsKeyword(text, kw));
  return Math.round((matches.length / keywords.length) * 100);
}
