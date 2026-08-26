export interface CompanyProfile {
  name: string;
  /**
   * Absolute origin the site is deployed to, with no trailing slash.
   *
   * Feeds canonical URLs, hreflang alternates, Open Graph image URLs, the
   * sitemap, and robots.txt. See resolveSiteUrl below for how it is chosen.
   */
  siteUrl: string;
  legalTagline: string;
  foundedYear: number;
  founder: string;
  founderRole: string;
  city: string;
  whatsappPrimary: string;
  whatsappPrimaryDisplay: string;
  whatsappAlternative: string;
  whatsappAlternativeDisplay: string;
  email: string;
  instagram: string;
  tiktok: string;
  hours: string;
  /**
   * VERIFIED GOOGLE MAPS URL.
   *
   * This is the single place the Google Business Profile link is configured.
   * It is intentionally `null` until the business owner supplies the real,
   * verified URL. While it stays `null` the site hides the "Read reviews on
   * Google" button and the map link entirely rather than pointing visitors at
   * an unverified location. Set it to the full https://... URL to switch those
   * elements on. Do not guess this value.
   */
  googleMapsUrl: string | null;
}

/** Language independent figures shown in the trust row. Labels live in src/i18n. */
export const trustFigures = {
  years: '15+',
  vehicleTypes: '6',
  availability: '24/7',
} as const;

/**
 * Where this build thinks it lives.
 *
 * Set NEXT_PUBLIC_SITE_URL in the hosting dashboard to whatever the site is
 * actually served from. On Vercel that means adding it once under Project
 * Settings, Environment Variables. Without it every canonical tag, hreflang
 * alternate, Open Graph image, and sitemap entry points at the fallback domain
 * below, which is wrong on a preview URL and wrong before the domain is live.
 *
 * NEXT_PUBLIC_ matters here: the value is inlined into both the server and the
 * client bundle, so the two can never disagree. A server only variable would
 * resolve to undefined on the client and risk a mismatch.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');
  return 'https://morfosatransport.com';
}

export const company: CompanyProfile = {
  name: 'Morfosa Transport',
  siteUrl: resolveSiteUrl(),
  legalTagline: 'Trusted car rental with experienced drivers since 2008.',
  foundedYear: 2008,
  founder: 'Mr. Salim Jefry',
  founderRole: 'Founder and CEO',
  city: 'Yogyakarta, Indonesia',
  whatsappPrimary: '6281804099113',
  whatsappPrimaryDisplay: '0818-0409-9113',
  whatsappAlternative: '6289620928296',
  whatsappAlternativeDisplay: '0896-2092-8296',
  email: 'morfosatransport@gmail.com',
  instagram: 'morfosatransport',
  tiktok: 'morfosatransport',
  hours: 'Monday to Sunday, 24 hours',
  googleMapsUrl: null,
};
