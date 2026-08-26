import type { Locale } from '@/i18n/types';

/**
 * Fills {placeholders} in a dictionary string.
 *
 * Dictionaries hold plain strings rather than functions, because they are
 * handed to client components as props and functions do not survive that
 * boundary. An unknown key is left visible rather than silently blanked, so a
 * typo shows up immediately.
 */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in vars ? String(vars[key]) : whole,
  );
}

/** Indonesian Rupiah is the only currency used anywhere on this site. */
const rupiah = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

export function formatIDR(value: number): string {
  return `Rp${rupiah.format(value)}`;
}

/** `perDaySuffix` comes from the dictionary, for example "/day" or "/hari". */
export function formatPerDay(value: number, perDaySuffix: string): string {
  return `${formatIDR(value)}${perDaySuffix}`;
}

const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  id: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
};

/**
 * Formats an ISO date string in the reader's language. The date is rebuilt at
 * local midnight so the calendar day never shifts across timezones between the
 * build and the browser.
 */
export function formatDate(iso: string, locale: Locale = 'en'): string {
  const [year, month, day] = iso.split('-').map(Number);
  return dateFormatters[locale].format(new Date(year, month - 1, day));
}

/** Parses a yyyy-mm-dd input value into a local-midnight timestamp. */
function parseDateValue(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return Number.NaN;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  // Reject impossible calendar dates such as 2026-02-31.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return Number.NaN;
  }
  return date.getTime();
}

const MS_PER_DAY = 86_400_000;

/**
 * Number of chargeable rental days between two yyyy-mm-dd values.
 *
 * Both the start and the end date count, so a single day hire is one day and a
 * Friday to Sunday hire is three. Returns 0 when either date is unusable or the
 * range runs backwards, which the caller treats as a validation failure.
 */
export function rentalDays(start: string, end: string): number {
  const from = parseDateValue(start);
  const to = parseDateValue(end);
  if (Number.isNaN(from) || Number.isNaN(to) || to < from) return 0;
  return Math.round((to - from) / MS_PER_DAY) + 1;
}

/** Today as yyyy-mm-dd in the visitor's own timezone, for date input minimums. */
export function todayValue(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
