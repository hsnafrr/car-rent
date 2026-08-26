"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary, localePath, otherLocale, pageFromPathname, type Locale } from '@/i18n';
import styles from './LanguageSwitcher.module.css';

/**
 * A real link to the same page in the other language, not a client side toggle.
 *
 * Both languages are separately rendered routes, so switching is a navigation.
 * That keeps each language crawlable and shareable at its own URL, which
 * matters for a business whose customers mostly search in Indonesian.
 *
 * The label is written in the language being switched to, so it reads correctly
 * to the person who needs it.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const page = pageFromPathname(usePathname() ?? '/');
  const target = otherLocale(locale);
  const targetDict = getDictionary(target);
  const dict = getDictionary(locale);

  return (
    <Link
      className={styles.switcher}
      href={localePath(target, page)}
      hrefLang={targetDict.htmlLang}
      lang={targetDict.htmlLang}
      aria-label={`${dict.nav.languageLabel}: ${dict.nav.switchLanguage}`}
    >
      <span aria-hidden="true">{targetDict.shortName}</span>
    </Link>
  );
}
