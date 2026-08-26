/**
 * Vehicle facts only.
 *
 * Everything a customer reads in words lives in src/i18n, keyed by these slugs.
 * Prices, seat counts, and the recommendation rules are language independent,
 * so they stay here and cannot drift between the two translations.
 */
export type VehicleSlug =
  | 'agya-brio'
  | 'avanza-xenia'
  | 'innova-reborn'
  | 'hiace-commuter'
  | 'hiace-premio'
  | 'grandmax-blindvan';

/**
 * Intrinsic size of every fleet card film. All six studio turntables were
 * delivered at the same size, so the cards share one aspect ratio and the
 * layout never shifts between them.
 *
 * Card media is derived from the slug rather than stored, so the data and the
 * files in public/fleet cannot drift apart. Each vehicle has:
 *   /fleet/<slug>.mp4         desktop loop
 *   /fleet/<slug>-mobile.mp4  mobile loop
 *   /fleet/<slug>.webp|.avif  poster, and the reduced motion still
 */
export const FLEET_CARD_SIZE = { width: 1088, height: 832 } as const;

export interface Vehicle {
  slug: VehicleSlug;
  /** Daily rate in Indonesian Rupiah. */
  pricePerDay: number;
  seats: number;
}

export const fleet: Vehicle[] = [
  { slug: 'agya-brio', pricePerDay: 550_000, seats: 5 },
  { slug: 'avanza-xenia', pricePerDay: 650_000, seats: 7 },
  { slug: 'innova-reborn', pricePerDay: 850_000, seats: 7 },
  { slug: 'hiace-commuter', pricePerDay: 1_200_000, seats: 14 },
  { slug: 'hiace-premio', pricePerDay: 1_500_000, seats: 14 },
  { slug: 'grandmax-blindvan', pricePerDay: 550_000, seats: 2 },
];

export const fleetBySlug: Record<VehicleSlug, Vehicle> = fleet.reduce(
  (acc, vehicle) => {
    acc[vehicle.slug] = vehicle;
    return acc;
  },
  {} as Record<VehicleSlug, Vehicle>,
);

export type RecommendationId = 'city' | 'family' | 'premium' | 'group' | 'cargo';

export interface RecommendationRule {
  id: RecommendationId;
  primary: VehicleSlug;
  alternative?: VehicleSlug;
}

/** Rule based, not a chatbot. One option maps to one vehicle. */
export const recommendationRules: RecommendationRule[] = [
  { id: 'city', primary: 'agya-brio', alternative: 'avanza-xenia' },
  { id: 'family', primary: 'avanza-xenia', alternative: 'innova-reborn' },
  { id: 'premium', primary: 'innova-reborn', alternative: 'hiace-premio' },
  { id: 'group', primary: 'hiace-commuter', alternative: 'hiace-premio' },
  { id: 'cargo', primary: 'grandmax-blindvan' },
];
