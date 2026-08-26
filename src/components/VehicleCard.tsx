'use client';

import { useEffect, useRef, useState } from 'react';
import { FLEET_CARD_SIZE, type VehicleSlug } from '@/data/fleet';
import styles from './Fleet.module.css';

/**
 * The visual half of a fleet stage: a studio turntable of the vehicle.
 *
 * Built the same way as the hero. A still is always rendered as the base layer,
 * and the film is layered over it and faded in once it is playing. That means
 * one image download regardless of what happens next, a correct reduced motion
 * experience with no swap on hydration, and a graceful result if the video
 * never arrives.
 *
 * The film is not fetched at all until the card is close to the viewport, and
 * it pauses again as soon as the card leaves. Six autoplaying loops running off
 * screen would cost far more than they are worth.
 */
export function VehicleCard({ slug, alt }: { slug: VehicleSlug; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // Reduced motion keeps the still and never loads the film.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mobile = window.matchMedia('(max-width: 47.99rem)').matches;
    const source = mobile ? `/fleet/${slug}-mobile.mp4` : `/fleet/${slug}.mp4`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!video.getAttribute('src')) {
              video.setAttribute('src', source);
            }
            video.play().then(
              () => setPlaying(true),
              () => {
                /* Autoplay refused. The still stays, which is a fine result. */
              },
            );
          } else if (!video.paused) {
            video.pause();
          }
        }
      },
      // Start fetching just before the card arrives so the loop is already
      // running by the time it is properly in view.
      { rootMargin: '200px 0px', threshold: 0.2 },
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [slug]);

  return (
    <div className={styles.visual} ref={containerRef}>
      <picture>
        <source srcSet={`/fleet/${slug}.avif`} type="image/avif" />
        <img
          className={styles.cardLayer}
          src={`/fleet/${slug}.webp`}
          alt={alt}
          width={FLEET_CARD_SIZE.width}
          height={FLEET_CARD_SIZE.height}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <video
        ref={videoRef}
        className={`${styles.cardLayer} ${styles.cardVideo} ${playing ? styles.cardVideoOn : ''}`}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
