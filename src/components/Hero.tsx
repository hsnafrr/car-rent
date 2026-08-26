"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Dictionary } from '@/i18n/types';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll positions, as a fraction of the hero scroll area, where each beat
 * enters and leaves. They line up with the four beats cut into the film:
 * departure, boulevard, open journey, arrival.
 */
const BEAT_WINDOWS: ReadonlyArray<{ enter: number | null; exit: number | null }> = [
  { enter: null, exit: 0.2 }, // painted from the top, so no entrance tween
  { enter: 0.27, exit: 0.46 },
  { enter: 0.53, exit: 0.7 },
  { enter: 0.78, exit: null }, // final state stays put for the CTAs
];

/**
 * Reads the layout decision made by BootScript before first paint. React
 * cannot make this call itself without shifting the page, so it follows.
 */
function readCinematicMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute('data-hero-mode') === 'cinematic';
}

export function Hero({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [cinematic, setCinematic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [bufferedFraction, setBufferedFraction] = useState(0);

  useEffect(() => {
    if (!readCinematicMode()) return;
    setIsMobile(window.matchMedia('(max-width: 47.99rem)').matches);
    setCinematic(true);
  }, []);

  /* Track load state so the progress readout reports real buffering. */
  useEffect(() => {
    if (!cinematic) return;
    const video = videoRef.current;
    if (!video) return;

    const readBuffered = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      const ranges = video.buffered;
      const end = ranges.length ? ranges.end(ranges.length - 1) : 0;
      setBufferedFraction(Math.min(1, end / video.duration));
    };

    const onLoadedData = () => {
      setVideoReady(true);
      readBuffered();
    };

    const onError = () => {
      // Drop back to the still hero. The layout stays as it is, so nothing
      // jumps: the scroll area simply stops driving a playhead.
      setCinematic(false);
      document.documentElement.removeAttribute('data-hero-mode');
    };

    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('progress', readBuffered);
    video.addEventListener('canplaythrough', readBuffered);
    video.addEventListener('error', onError);

    if (video.readyState >= 2) onLoadedData();

    return () => {
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('progress', readBuffered);
      video.removeEventListener('canplaythrough', readBuffered);
      video.removeEventListener('error', onError);
    };
  }, [cinematic]);

  /*
   * One scrubbed timeline drives two things: the video playhead and the staged
   * copy. Everything is built inside a gsap context so a single revert tears
   * down the ScrollTrigger, the tweens, and the inline styles together.
   */
  useEffect(() => {
    if (!cinematic || !videoReady) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const duration = video.duration;
    if (!duration || Number.isNaN(duration)) return;

    video.pause();

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.55,
        },
        defaults: { ease: 'none' },
      });

      // Playhead. Seeking is only attempted once there is decoded data, and the
      // encode is all-intra so every seek lands on a keyframe.
      const playhead = { time: 0 };
      timeline.to(
        playhead,
        {
          time: duration,
          duration: 1,
          onUpdate: () => {
            if (video.readyState >= 2) {
              video.currentTime = playhead.time;
            }
          },
        },
        0,
      );

      // Staged copy. autoAlpha also toggles visibility, which keeps hidden
      // beats out of the tab order and out of the accessibility tree.
      const beats = gsap.utils.toArray<HTMLElement>(`.${styles.beat}`, section);
      beats.forEach((beat, index) => {
        const window_ = BEAT_WINDOWS[index];
        if (!window_) return;

        if (window_.enter !== null) {
          timeline.fromTo(
            beat,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' },
            window_.enter,
          );
        }
        if (window_.exit !== null) {
          timeline.to(
            beat,
            { autoAlpha: 0, y: -16, duration: 0.06, ease: 'power2.in' },
            window_.exit,
          );
        }
      });

      timeline.to(`.${styles.scrollHint}`, { autoAlpha: 0, duration: 0.05 }, 0.04);
    }, section);

    return () => context.revert();
  }, [cinematic, videoReady]);

  const showProgress = cinematic && bufferedFraction < 1;
  const progressPercent = Math.round(bufferedFraction * 100);

  return (
    <section
      id="home"
      ref={sectionRef}
      className={styles.hero}
      aria-label={dict.hero.sectionLabel}
    >
      <div className={styles.stage}>
        <div className={styles.media}>
          {/*
            One still serves both layouts: the arrival frame. It is the frame
            composed to leave negative space for the headline and the buttons,
            so it is what reduced motion visitors keep, and what everyone else
            sees for the moment before the film has decoded. Rendering a single
            image means no second download and no swap on hydration.
          */}
          <picture>
            <source
              media="(max-width: 47.99rem)"
              srcSet="/media/hero-final-mobile.avif"
              type="image/avif"
            />
            <source
              media="(max-width: 47.99rem)"
              srcSet="/media/hero-final-mobile.webp"
              type="image/webp"
            />
            <source srcSet="/media/hero-final.avif" type="image/avif" />
            <img
              className={styles.mediaLayer}
              src="/media/hero-final.webp"
              alt={dict.hero.stillAlt}
              width={1280}
              height={720}
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          {cinematic ? (
            <video
              ref={videoRef}
              className={`${styles.mediaLayer} ${styles.video} ${
                videoReady ? styles.videoReady : ''
              }`}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              tabIndex={-1}
              aria-hidden="true"
              poster="/media/hero-poster.webp"
            >
              <source
                src={isMobile ? '/media/hero-mobile.mp4' : '/media/hero-desktop.mp4'}
                type="video/mp4"
              />
              <source src="/media/hero-desktop.webm" type="video/webm" />
            </video>
          ) : null}

          <div className={styles.scrim} aria-hidden="true" />
        </div>

        <div className={styles.content}>
          <div className={`container ${styles.copy}`}>
            <div className={styles.beat}>
              <p className={styles.brandLine}>{dict.hero.brandLine}</p>
              <h1 className={`display ${styles.headline}`}>{dict.hero.headline}</h1>
            </div>

            <div className={styles.beat}>
              <p className={styles.supporting}>{dict.hero.supporting1}</p>
            </div>

            <div className={styles.beat}>
              <p className={styles.supporting}>{dict.hero.supporting2}</p>
            </div>

            <div className={styles.beat}>
              <p className={styles.closing}>{dict.hero.closing}</p>
              <div className={styles.ctaRow}>
                <a className="btn btn--primary" href="#booking">
                  {dict.hero.ctaPrimary}
                </a>
                <a className="btn btn--secondary btn--secondary-on-dark" href="#fleet">
                  {dict.hero.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </div>

        {cinematic ? (
          <p className={styles.scrollHint} aria-hidden="true">
            <span className={styles.scrollRule} />
            {dict.hero.scrollHint}
          </p>
        ) : null}

        {showProgress ? (
          <div className={styles.loading}>
            <span>{dict.hero.loading}</span>
            <span
              className={styles.loadingTrack}
              role="progressbar"
              aria-label={dict.hero.loadingAria}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
            >
              <span className={styles.loadingBar} style={{ width: `${progressPercent}%` }} />
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
