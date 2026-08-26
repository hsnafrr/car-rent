import type { MetadataRoute } from 'next';
import { company } from '@/data/company';
import { locales, localePath, type PageKey } from '@/i18n';

export const dynamic = 'force-static';

const pages: { page: PageKey; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
  { page: 'home', priority: 1, changeFrequency: 'monthly' },
  { page: 'privacy', priority: 0.3, changeFrequency: 'yearly' },
  { page: 'terms', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.flatMap((locale) =>
    pages.map(({ page, priority, changeFrequency }) => ({
      url: `${company.siteUrl}${localePath(locale, page)}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
  );
}
