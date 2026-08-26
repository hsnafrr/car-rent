import { Archivo, Newsreader } from 'next/font/google';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { BootScript } from '@/components/BootScript';
import { SmoothAnchors } from '@/components/SmoothAnchors';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { company } from '@/data/company';
import { getDictionary, type Locale } from '@/i18n';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const newsreader = Newsreader({ subsets: ['latin'], display: 'swap', variable: '--font-serif' });

/**
 * The document shell, shared by both language route groups.
 *
 * Next only lets the root layout render the html element, and a root layout
 * cannot see which route is active. Two route groups therefore each own a root
 * layout, and both delegate here so the markup stays in one place while the
 * lang attribute is correct per language.
 */
export function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);

  /**
   * Structured data describing the business.
   *
   * Deliberately omits aggregateRating. The owner supplied a 4.8 average from
   * their own records, and that figure is shown in the reviews section, but
   * search engines require rating markup to come from a verifiable review
   * system. Publishing an unverifiable rating as markup risks a penalty.
   */
  const businessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: company.name,
    description: dict.meta.description,
    url: company.siteUrl,
    email: company.email,
    telephone: `+${company.whatsappPrimary}`,
    foundingDate: String(company.foundedYear),
    founder: { '@type': 'Person', name: company.founder },
    areaServed: { '@type': 'Place', name: dict.contact.city },
    address: { '@type': 'PostalAddress', addressLocality: 'Yogyakarta', addressCountry: 'ID' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [
      `https://www.instagram.com/${company.instagram}`,
      `https://www.tiktok.com/@${company.tiktok}`,
    ],
  };

  return (
    // BootScript writes data-theme and data-hero-mode onto this element before
    // React hydrates, which is the whole point of it running early. Suppressing
    // the warning is scoped to this element's own attributes and does not
    // affect anything nested inside it.
    <html
      lang={dict.htmlLang}
      className={`${archivo.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Theme and hero layout, both settled before first paint. */}
        <BootScript />
        <a className="skipLink" href="#main">
          {dict.nav.skip}
        </a>
        <SmoothAnchors />
        <SiteHeader
          dict={dict}
          locale={locale}
          languageSwitcher={<LanguageSwitcher locale={locale} />}
        />
        <main id="main">{children}</main>
        <SiteFooter dict={dict} locale={locale} />
        <script
          type="application/ld+json"
          // Serialised from a local object literal, never from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </body>
    </html>
  );
}
