import type { en } from './en';

/**
 * The dictionary shape is derived from the English file rather than declared
 * separately. English is the reference language, so it cannot fall out of sync
 * with its own type, and every other language is checked against it.
 */
export type Dictionary = typeof en;

export type Locale = 'en' | 'id';
