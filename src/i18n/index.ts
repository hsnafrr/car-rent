import { en } from './en';
import { id } from './id';
import { privacyEn, privacyId, termsEn, termsId, type LegalDocument } from './legal';
import type { Dictionary, Locale } from './types';

export type { Dictionary, Locale };
export type { LegalDocument, LegalBlock, LegalSection } from './legal';

export const locales: Locale[] = ['en', 'id'];

/** English is the default and lives at the site root. Indonesian is under /id. */
export const defaultLocale: Locale = 'en';

const dictionaries: Record<Locale, Dictionary> = { en, id };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getLegal(locale: Locale): { privacy: LegalDocument; terms: LegalDocument } {
  return locale === 'id'
    ? { privacy: privacyId, terms: termsId }
    : { privacy: privacyEn, terms: termsEn };
}

/** The other language, used by the switcher. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'id' : 'en';
}

export type PageKey = 'home' | 'privacy' | 'terms';

const SEGMENTS: Record<PageKey, string> = {
  home: '',
  privacy: 'privacy/',
  terms: 'terms/',
};

/**
 * Builds a site path for a page in a given language. English sits at the root,
 * Indonesian under /id, and trailingSlash is on so every path ends with one.
 */
export function localePath(locale: Locale, page: PageKey = 'home'): string {
  const prefix = locale === 'en' ? '/' : '/id/';
  return `${prefix}${SEGMENTS[page]}`;
}

/** hreflang map for a page, for the alternates block in metadata. */
export function localeAlternates(page: PageKey): Record<string, string> {
  return {
    en: localePath('en', page),
    id: localePath('id', page),
    'x-default': localePath('en', page),
  };
}

/**
 * Which page a pathname refers to, independent of language.
 *
 * A root layout cannot see the active route, so the header and the language
 * switcher work this out for themselves rather than having it threaded down.
 */
export function pageFromPathname(pathname: string): PageKey {
  if (pathname.includes('/privacy')) return 'privacy';
  if (pathname.includes('/terms')) return 'terms';
  return 'home';
}
