/**
 * Owner supplied testimonials. Names and dates are facts and live here; the
 * quotes are in src/i18n keyed by these ids.
 *
 * Do not add entries the business has not provided. No avatars, no company
 * names, and no per review star ratings are stored because none were supplied.
 */
export type ReviewId = 'ahmad-rizki' | 'sari-dewi' | 'budi-santoso';

export interface Review {
  id: ReviewId;
  name: string;
  /** ISO date, formatted per locale at render time. */
  date: string;
}

export const reviews: Review[] = [
  { id: 'ahmad-rizki', name: 'Ahmad Rizki', date: '2024-01-15' },
  { id: 'sari-dewi', name: 'Sari Dewi', date: '2024-01-10' },
  { id: 'budi-santoso', name: 'Budi Santoso', date: '2024-01-05' },
];

/** Figures supplied by Morfosa Transport from their own records. */
export type ReviewStatId = 'rating' | 'total' | 'satisfaction';

export const reviewStats: { id: ReviewStatId; value: string }[] = [
  { id: 'rating', value: '4.8' },
  { id: 'total', value: '150+' },
  { id: 'satisfaction', value: '98%' },
];
