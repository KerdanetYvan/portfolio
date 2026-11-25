/**
 * Parcours affiché façon `git log --graph` : le plus récent en haut, `main`
 * pour la formation, une branche `alternance` qui part du Bachelor et y est
 * mergée, qui aboutit à « Aujourd'hui ». Les lignes de commit ont une hauteur libre (le texte peut passer à
 * la ligne sur mobile) : les courbes de fork/merge vivent dans des rangées de
 * connexion à hauteur fixe, comme les `|\` et `|/` de git.
 */

type Lane = 0 | 1;
/** Nature de l'étape, affichée à la place du hash de commit (lisible par un non-dev). */
type Kind = 'now' | 'work' | 'edu';
/** Segment de lane dans une ligne de commit : au-dessus du point, en dessous, ou les deux. */
type Segment = 'above' | 'below' | 'full';

interface Ref {
  label: string;
  tone: 'head' | 'main' | 'branch';
}

type Row =
  | {
      type: 'commit';
      lane: Lane;
      /** Segment dessiné pour chaque lane active sur cette ligne. */
      lanes: Partial<Record<Lane, Segment>>;
      kind: Kind;
      refs?: Ref[];
      date: string;
      title: string;
      sub?: string;
      head?: boolean;
    }
  | { type: 'connector'; kind: 'fork' | 'merge' };

const ROWS: Row[] = [
  {
    type: 'commit', lane: 0, lanes: { 0: 'below' }, head: true,
    kind: 'now', refs: [{ label: 'HEAD -> main', tone: 'head' }],
    date: 'depuis nov. 2026', title: 'Disponible immédiatement',
    sub: 'CDI, CDD ou freelance · Paris/IDF & Finistère',
  },
  { type: 'connector', kind: 'merge' },
  {
    type: 'commit', lane: 1, lanes: { 0: 'full', 1: 'full' },
    kind: 'work', refs: [{ label: 'alternance', tone: 'branch' }],
    date: 'mars → nov. 2026', title: 'Développeur Fullstack Laravel/PHP', sub: 'Cours Progress',
  },
  { type: 'connector', kind: 'fork' },
  {
    type: 'commit', lane: 0, lanes: { 0: 'full' },
    kind: 'edu', date: '2024–2026', title: 'Bachelor CDSD', sub: 'Digital Campus - Paris',
  },
  {
    type: 'commit', lane: 0, lanes: { 0: 'full' },
    kind: 'edu', date: '2021–2024', title: 'Cursus Ingénieur Informatique', sub: 'EILCO - Calais (sans diplôme)',
  },
  {
    type: 'commit', lane: 0, lanes: { 0: 'full' },
    kind: 'edu', date: '2018–2021', title: 'CPGE TSI', sub: "Techniques et Sciences de l'Ingénieur",
  },
  {
    type: 'commit', lane: 0, lanes: { 0: 'above' },
    kind: 'edu', date: '2018', title: 'BAC STI2D - mention Bien',
  },
];

// Géométrie (px) : deux lanes de 16 px, point aligné sur la 1ʳᵉ ligne de texte.
const LANE_X: Record<Lane, number> = { 0: 8, 1: 24 };
const GRAPH_W = 32;
const DOT_Y = 8;
const CONNECTOR_H = 20;

const LANE_LINE: Record<Lane, string> = { 0: 'bg-accent-bg', 1: 'bg-pop-orange' };
const LANE_DOT: Record<Lane, string> = { 0: 'border-accent-bg', 1: 'border-pop-orange' };
const KIND_LABEL: Record<Kind, { text: string; className: string }> = {
  now: { text: "Aujourd'hui", className: 'text-pop-blue font-semibold' },
  work: { text: 'Travail', className: 'text-pop-orange' },
  edu: { text: 'Études', className: 'text-pop-green' },
};
const REF_TONE: Record<Ref['tone'], string> = {
  head: 'text-pop-blue',
  main: 'text-pop-green',
  branch: 'text-pop-orange',
};

export default function GitLog() {
  return (
    <div className="font-mono">
      <p className="text-xs text-muted mb-4" aria-hidden="true">
        <span className="text-accent-bg">$</span> git log --graph --all
      </p>
      <ol>
        {ROWS.map((row, i) =>
          row.type === 'connector' ? <ConnectorRow key={i} kind={row.kind} /> : <CommitRow key={i} row={row} />,
        )}
      </ol>
    </div>
  );
}

function CommitRow({ row }: { row: Extract<Row, { type: 'commit' }> }) {
  return (
    <li className="flex gap-3">
      <div className="relative shrink-0" style={{ width: GRAPH_W }} aria-hidden="true">
        {(Object.entries(row.lanes) as [string, Segment][]).map(([key, segment]) => {
          const lane = Number(key) as Lane;
          const top = segment === 'below' ? DOT_Y : 0;
          return (
            <span
              key={lane}
              className={`absolute w-0.5 ${LANE_LINE[lane]}`}
              style={{
                left: LANE_X[lane] - 1,
                top,
                ...(segment === 'above' ? { height: DOT_Y } : { bottom: 0 }),
              }}
            />
          );
        })}
        <span
          className={`absolute size-2.5 rounded-full border-2 ${LANE_DOT[row.lane]} ${
            row.head ? 'bg-accent-bg' : 'bg-surface'
          }`}
          style={{ left: LANE_X[row.lane] - 5, top: DOT_Y - 5 }}
        />
      </div>

      <div className="min-w-0 pb-6">
        <div className="flex flex-wrap items-baseline gap-x-2 text-[11px] leading-4">
          <span className={KIND_LABEL[row.kind].className}>{KIND_LABEL[row.kind].text}</span>
          {row.refs && (
            <span className="text-muted">
              (
              {row.refs.map((ref, i) => (
                <span key={ref.label}>
                  {i > 0 && ', '}
                  <span className={`font-semibold ${REF_TONE[ref.tone]}`}>{ref.label}</span>
                </span>
              ))}
              )
            </span>
          )}
          <time className="text-muted">{row.date}</time>
        </div>
        <p className="font-sans font-medium text-sm text-on-surface mt-1">{row.title}</p>
        {row.sub && <p className="text-xs text-muted mt-0.5">{row.sub}</p>}
      </div>
    </li>
  );
}

/** Rangée `|\` (merge, lue de haut en bas) ou `|/` (fork) : lane 0 droite + courbe vers la lane 1. */
function ConnectorRow({ kind }: { kind: 'fork' | 'merge' }) {
  const [x0, x1] = [LANE_X[0], LANE_X[1]];
  const h = CONNECTOR_H;
  const curve =
    kind === 'merge'
      ? `M${x0} 0 C${x0} ${h / 2} ${x1} ${h / 2} ${x1} ${h}`
      : `M${x1} 0 C${x1} ${h / 2} ${x0} ${h / 2} ${x0} ${h}`;
  return (
    <li aria-hidden="true" role="presentation">
      <svg width={GRAPH_W} height={h} viewBox={`0 0 ${GRAPH_W} ${h}`} className="block overflow-visible" fill="none" strokeWidth={2}>
        <path d={`M${x0} 0 V${h}`} className="stroke-accent-bg" />
        <path d={curve} className="stroke-pop-orange" />
      </svg>
    </li>
  );
}
