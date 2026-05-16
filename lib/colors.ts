export const COULEUR_CLASSES = {
  vert:  {
    dot:    'bg-[#00D26A]',
    border: 'border-[#00D26A]/25',
    bg:     'bg-[#00D26A]/8',
    text:   'text-[#00D26A]',
  },
  jaune: {
    dot:    'bg-[#f0c040]',
    border: 'border-[#f0c040]/25',
    bg:     'bg-[#f0c040]/8',
    text:   'text-[#f0c040]',
  },
  rouge: {
    dot:    'bg-[#ef4444]',
    border: 'border-[#ef4444]/25',
    bg:     'bg-[#ef4444]/8',
    text:   'text-[#ef4444]',
  },
} as const;

export type Couleur = keyof typeof COULEUR_CLASSES;
