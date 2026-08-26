import Link from 'next/link';
import { company } from '@/data/company';
import { format } from '@/lib/format';
import { localePath, type Locale } from '@/i18n';
import type { Dictionary } from '@/i18n/types';
import { primaryWhatsapp } from '@/lib/whatsapp';
import styles from './SiteFooter.module.css';

export function SiteFooter({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  /* Rendered at build time and refreshed on every deploy. */
  const year = new Date().getFullYear();
  const home = localePath(locale, 'home');

  const sectionLinks = (['about', 'fleet', 'booking', 'faq', 'contact'] as const).map((id) => ({
    href: `${home}#${id}`,
    label: dict.nav.labels[id],
  }));

  const legalLinks = [
    { href: localePath(locale, 'privacy'), label: dict.footer.privacy },
    { href: localePath(locale, 'terms'), label: dict.footer.terms },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <img
              className={styles.logoLockup}
              src="/logo-lockup.webp"
              srcSet="/logo-lockup.webp 1x, /logo-lockup@2x.webp 2x"
              alt="Morfosa Transport, established 2008"
              width={320}
              height={310}
              loading="lazy"
              decoding="async"
            />
            <p className={styles.tagline}>{dict.footer.tagline}</p>
            <a
              className="btn btn--secondary btn--secondary-on-dark"
              href={primaryWhatsapp(dict.message.generalEnquiry)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {format(dict.footer.whatsappCta, { number: company.whatsappPrimaryDisplay })}
            </a>
          </div>

          <nav className={styles.nav} aria-label={dict.nav.footerNav}>
            <div className={styles.navGroup}>
              <h2 className={styles.navTitle}>{dict.footer.sectionsTitle}</h2>
              <ul className={styles.navList}>
                {sectionLinks.map((link) => (
                  <li key={link.href}>
                    <a className={styles.navLink} href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.navGroup}>
              <h2 className={styles.navTitle}>{dict.footer.informationTitle}</h2>
              <ul className={styles.navList}>
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link className={styles.navLink} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.navGroup}>
              <h2 className={styles.navTitle}>{dict.footer.followTitle}</h2>
              <ul className={styles.navList}>
                <li>
                  <a
                    className={styles.navLink}
                    href={`https://www.instagram.com/${company.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dict.contact.instagram}
                  </a>
                </li>
                <li>
                  <a
                    className={styles.navLink}
                    href={`https://www.tiktok.com/@${company.tiktok}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dict.contact.tiktok}
                  </a>
                </li>
                <li>
                  <a className={styles.navLink} href={`mailto:${company.email}`}>
                    {dict.contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>{format(dict.footer.rights, { year, name: company.name })}</p>
          <p>{dict.contact.city}</p>
        </div>
      </div>
    </footer>
  );
}
