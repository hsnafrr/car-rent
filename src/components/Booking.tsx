"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import type { VehicleSlug } from '@/data/fleet';
import { company } from '@/data/company';
import { primaryWhatsapp, alternativeWhatsapp } from '@/lib/whatsapp';
import type { Dictionary, Locale } from '@/i18n/types';
import { useBooking } from './BookingContext';
import styles from './Booking.module.css';

/**
 * The booking form itself lives in the Apps Script web app (availability check,
 * Google Sheets, Calendar, Gmail, WhatsApp automation). This section embeds it
 * so a request and the admin dashboard always read the same data.
 */
const APP_VEHICLE_ID: Record<VehicleSlug, string> = {
  'agya-brio': 'city-car',
  'avanza-xenia': 'family-car',
  'innova-reborn': 'premium-mpv',
  'hiace-commuter': 'group-transport',
  'hiace-premio': 'premium-van',
  'grandmax-blindvan': 'blindvan',
};

const MIN_HEIGHT = 640;

export function Booking({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { selectedVehicle, registerVehicleField } = useBooking();
  const t = dict.booking;

  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [near, setNear] = useState(false);
  const [height, setHeight] = useState(1000);
  const [loaded, setLoaded] = useState(false);

  /* Focus lands on the frame wrapper when a vehicle card sends the visitor here. */
  useEffect(() => {
    registerVehicleField(hostRef.current);
    return () => registerVehicleField(null);
  }, [registerVehicleField]);

  /* Load the form only when the visitor is close to it, so it never costs the first paint. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !('IntersectionObserver' in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* A vehicle chosen elsewhere on the page always loads the form, even before it scrolled near. */
  useEffect(() => {
    if (selectedVehicle) setNear(true);
  }, [selectedVehicle]);

  /* The embedded page reports its own height so there is no inner scrollbar. */
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const frame = frameRef.current;
      const data = event.data as { type?: string; h?: number } | null;
      if (!frame || event.source !== frame.contentWindow || !data || data.type !== 'mrf-height') return;
      const next = Math.max(MIN_HEIGHT, Math.min(2600, Number(data.h) || 0) + 8);
      setHeight(next);
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const src = useMemo(() => {
    const vehicle = selectedVehicle ? `&v=${encodeURIComponent(APP_VEHICLE_ID[selectedVehicle])}` : '';
    return `${company.bookingAppUrl}?embed=1&lang=${locale}${vehicle}`;
  }, [locale, selectedVehicle]);

  const frameTitle = locale === 'id' ? 'Formulir pemesanan Morfosa Transport' : 'Morfosa Transport booking form';
  const newTabLabel = locale === 'id' ? 'Buka formulir di tab baru' : 'Open the form in a new tab';

  return (
    <section id="booking" ref={sectionRef} className={`section ${styles.booking}`}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className={`display ${styles.title}`}>{t.title}</h2>
            <p className="lede">{t.lede}</p>

            <dl className={styles.contactAside}>
              <div>
                <dt>{t.primaryWhatsapp}</dt>
                <dd>
                  <a className="textLink" href={primaryWhatsapp()}>
                    {company.whatsappPrimaryDisplay}
                  </a>
                </dd>
              </div>
              {company.whatsappAlternative ? (
                <div>
                  <dt>{t.alternativeWhatsapp}</dt>
                  <dd>
                    <a className="textLink" href={alternativeWhatsapp()}>
                      {company.whatsappAlternativeDisplay}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className={styles.frame} ref={hostRef} tabIndex={-1}>
            {near ? (
              <iframe
                ref={frameRef}
                key={src}
                src={src}
                title={frameTitle}
                className={styles.frameEl}
                style={{ height }}
                loading="lazy"
                referrerPolicy="no-referrer"
                onLoad={() => setLoaded(true)}
              />
            ) : null}
            {!loaded ? (
              <div className={styles.frameLoading} role="status">
                {locale === 'id' ? 'Memuat formulir pemesanan' : 'Loading the booking form'}
              </div>
            ) : null}
            <noscript>
              <a className="textLink" href={company.bookingAppUrl} rel="noopener noreferrer">
                {newTabLabel}
              </a>
            </noscript>
          </div>
        </div>
        <p className={styles.frameFallback}>
          <a className="textLink" href={src} target="_blank" rel="noopener noreferrer">
            {newTabLabel}
          </a>
        </p>
      </div>
    </section>
  );
}
