export type LearningStatus = 'active' | 'paused';

export interface LearningItem {
  name: string;
  category: string;
  description: string;
  startDate: string;
  link?: string;
  status: LearningStatus;
}

export const LEARNING_ITEMS: LearningItem[] = [
  {
    name: 'PostgreSQL avancé',
    category: 'Backend',
    description: 'Index, transactions, requêtes complexes et optimisation des performances.',
    startDate: '2025-03-01',
    status: 'active',
  },
  {
    name: 'NextAuth v5',
    category: 'Backend',
    description: 'Authentification JWT par credentials pour protéger les routes /dashboard.',
    startDate: '2025-05-01',
    status: 'active',
  },
  {
    name: 'Three.js',
    category: 'Frontend',
    description: 'Scènes 3D interactives dans le navigateur avec WebGL, géométries et shaders de base.',
    startDate: '2025-04-01',
    status: 'active',
  },
];
