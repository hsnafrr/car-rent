"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fleet } from '@/data/fleet';
import { format, formatPerDay } from '@/lib/format';
import type { Dictionary } from '@/i18n/types';
import { useBooking } from './BookingContext';
import { VehicleCard } from './VehicleCard';
import styles from './Fleet.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Fleet({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { bookVehicle } = useBooking();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add(
      {
        wide: '(min-width: 64rem) and (prefers-reduced-motion: no-preference)',
        narrow: '(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { wide } = context.conditions as { wide: boolean; narrow: boolean };
        const stages = gsap.utils.toArray<HTMLElement>(`.${styles.stage}`, section);

        stages.forEach((stage, index) => {
          const visual = stage.querySelector(`.${styles.visual}`);
          const specs = stage.querySelectorAll('[data-reveal]');
          const mirrored = index % 2 === 1;

          if (visual) {
            /*
             * Movement only, deliberately no opacity. The card holds the poster
             * image and the looping film, and both depend on the element being
             * visible: a lazy image inside a hidden container is not fetched,
             * and the card's own IntersectionObserver will not start playback.
             * Fading the container would stall its own contents.
             */
            gsap.from(visual, {
              // Within the 6 to 10 percent offset the brief calls for, pushed
              // from whichever side the visual sits on.
              xPercent: wide ? (mirrored ? -8 : 8) : 0,
              y: wide ? 0 : 24,
              scale: 0.96,
              rotateY: wide ? (mirrored ? -3 : 3) : 0,
              duration: wide ? 0.9 : 0.6,
              ease: 'power3.out',
              scrollTrigger: { trigger: stage, start: 'top 80%', once: true },
            });
          }

          if (specs.length) {
            gsap.from(specs, {
              y: 14,
              autoAlpha: 0,
              duration: 0.5,
              stagger: 0.07,
              ease: 'power2.out',
              scrollTrigger: { trigger: stage, start: 'top 72%', once: true },
            });
          }
        });
      },
    );

    /*
     * Trigger positions are measured at creation. Webfonts load with swap, so
     * text metrics change afterwards and shift every stage below the fold.
     * Recomputing on fonts ready and on window load keeps the starts honest.
     */
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      media.revert();
    };
  }, []);

  return (
    <section id="fleet" ref={sectionRef} className={`section ${styles.fleet}`}>
      <div className="container">
        <header className={styles.header}>
          <p className="eyebrow">{dict.fleet.eyebrow}</p>
          <h2 className={`display ${styles.title}`}>{dict.fleet.title}</h2>
          <p className="lede">{dict.fleet.lede}</p>
        </header>
      </div>

      <div className={styles.stages}>
        {fleet.map((vehicle, index) => {
          const copy = dict.vehicles[vehicle.slug];
          return (
            <article
              key={vehicle.slug}
              className={`${styles.stage} ${index % 2 === 1 ? styles.stageMirrored : ''}`}
              aria-labelledby={`vehicle-${vehicle.slug}`}
            >
              <div className={`container ${styles.stageInner}`}>
                <div className={styles.visualColumn}>
                  <VehicleCard
                    slug={vehicle.slug}
                    alt={format(dict.fleet.cardAlt, { name: copy.name })}
                  />
                </div>

                <div className={styles.info}>
                  {/* Name and price are never animated. They stay readable from
                      the moment the stage enters the viewport. */}
                  <p className={styles.category}>{copy.category}</p>
                  <h3 id={`vehicle-${vehicle.slug}`} className={styles.name}>
                    {copy.name}
                  </h3>
                  <p className={styles.price}>
                    {formatPerDay(vehicle.pricePerDay, dict.fleet.perDay)}
                    <span className={styles.priceNote}>{dict.fleet.includedNote}</span>
                  </p>

                  <p className={styles.summary} data-reveal>
                    {copy.summary}
                  </p>

                  <dl className={styles.specs}>
                    <div className={styles.spec} data-reveal>
                      <dt>{dict.fleet.specSeats}</dt>
                      <dd>{vehicle.seats}</dd>
                    </div>
                    {copy.transmission ? (
                      <div className={styles.spec} data-reveal>
                        <dt>{dict.fleet.specTransmission}</dt>
                        <dd>{copy.transmission}</dd>
                      </div>
                    ) : null}
                    <div className={styles.spec} data-reveal>
                      <dt>{dict.fleet.specIncluded}</dt>
                      <dd>{copy.includes.join(', ')}</dd>
                    </div>
                    {copy.features.length ? (
                      <div className={styles.spec} data-reveal>
                        <dt>{dict.fleet.specFeatures}</dt>
                        <dd>{copy.features.join(', ')}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <button
                    type="button"
                    className={`btn btn--primary ${styles.bookButton}`}
                    onClick={() => bookVehicle(vehicle.slug)}
                  >
                    {dict.fleet.bookButton}
                    <span className="visually-hidden">, {copy.name}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="container">
        <p className={styles.notice}>{dict.fleet.notice}</p>
      </div>
    </section>
  );
}
