export interface AvailabilityStatus {
  available: boolean;
  emoji: string;
  label: string;
}

export const AVAILABILITY: AvailabilityStatus = {
  available: true,
  emoji: '🟢',
  label: 'Disponible immédiatement - CDI, CDD ou freelance · Paris/IDF & Finistère',
};
