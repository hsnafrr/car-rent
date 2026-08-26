import { BookingProvider } from '@/components/BookingContext';
import { Hero } from '@/components/Hero';
import { TrustIntro } from '@/components/TrustIntro';
import { Fleet } from '@/components/Fleet';
import { Recommender } from '@/components/Recommender';
import { About } from '@/components/About';
import { Booking } from '@/components/Booking';
import { Reviews } from '@/components/Reviews';
import { Faq } from '@/components/Faq';
import { Contact } from '@/components/Contact';
import type { Locale } from '@/i18n';
import type { Dictionary } from '@/i18n/types';

/**
 * The whole site is one page, rendered once per language.
 *
 * BookingProvider is the thread that lets any "Book This Vehicle" button,
 * anywhere on the page, preselect the right vehicle in the form and move the
 * visitor to it.
 */
export function HomePage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <BookingProvider>
      <Hero dict={dict} />
      <TrustIntro dict={dict} />
      <Fleet dict={dict} />
      <Recommender dict={dict} />
      <About dict={dict} />
      <Booking dict={dict} locale={locale} />
      <Reviews dict={dict} locale={locale} />
      <Faq dict={dict} />
      <Contact dict={dict} />
    </BookingProvider>
  );
}
