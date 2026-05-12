export interface AvailabilityStatus {
  available: boolean;
  emoji: string;
  label: string;
}

export const AVAILABILITY: AvailabilityStatus = {
  available: true,
  emoji: '🟢',
  label: 'En recherche active d\'alternance (Nov. 2026) — boîte mail grande ouverte',
};
