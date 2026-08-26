import type { Metadata, Viewport } from 'next';
import { company } from '@/data/company';
import { getDictionary, localeAlternates, localePath, type Locale, type PageKey } from '@/i18n';
import { getLegal } from '@/i18n';

export const sharedViewport: Viewport = {
  themeColor: '#101109',
  width: 'device-width',
  initialScale: 1,
  // Zoom is never disabled.
  maximumScale: 5,
};

/**
 * Builds metadata for one page in one language, including the hreflang pair so
 * search engines can serve the right version.
 */
export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const dict = getDictionary(locale);
  const path = localePath(locale, page);

  let title = dict.meta.title;
  let description = dict.meta.description;

  if (page !== 'home') {
    const legal = getLegal(locale);
    const doc = page === 'privacy' ? legal.privacy : legal.terms;
    title = `${doc.title} | ${company.name}`;
    description = doc.description;
  }

  return {
    metadataBase: new URL(company.siteUrl),
    title,
    description,
    applicationName: company.name,
    keywords: dict.meta.keywords,
    authors: [{ name: company.name }],
    creator: company.name,
    alternates: {
      canonical: path,
      languages: localeAlternates(page),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      url: `${company.siteUrl}${path}`,
      siteName: company.name,
      title,
      description,
      images: [
        { url: '/media/og-cover.jpg', width: 1200, height: 630, alt: dict.meta.ogAlt },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/media/og-cover.jpg'],
    },
    icons: {
      icon: [{ url: '/favicon.png', type: 'image/png', sizes: '32x32' }],
      apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
    },
    robots: { index: true, follow: true },
  };
}
