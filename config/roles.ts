export interface Role {
  id: number;
  label: string;
  href: string;
}

export const ROLES: Role[] = [
  { id: 1, label: "Dev Fullstack",      href: "/projects" },
  { id: 2, label: "Spécialiste n8n",    href: "/skills"   },
  { id: 3, label: "Conception 3D",      href: "/projects" },
  { id: 4, label: "À propos",           href: "/about"    },
];
