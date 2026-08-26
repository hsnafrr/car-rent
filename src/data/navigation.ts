/** Each id must match a section id rendered on the home page, and a nav label key in src/i18n. */
export type NavId = 'home' | 'fleet' | 'about' | 'booking' | 'reviews' | 'faq' | 'contact';

export const navIds: NavId[] = ['home', 'fleet', 'about', 'booking', 'reviews', 'faq', 'contact'];
