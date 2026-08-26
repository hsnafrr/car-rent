'use client';

import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/**
 * Anchor scrolling is driven by GSAP rather than by CSS scroll-behavior.
 *
 * The hero runs a scrubbed ScrollTrigger. CSS smooth scrolling animates the
 * scroll position behind the browser's back, which fights ScrollTrigger and
 * makes programmatic jumps unreliable. GSAP owns the scroll instead, which
 * keeps the two in step.
 *
 * autoKill lets a real wheel or touch gesture interrupt the tween at any point,
 * so this stays assistive rather than becoming scroll hijacking.
 */
function headerOffset(): number {
  const styles = getComputedStyle(document.documentElement);
  const raw = styles.getPropertyValue('--header-height').trim();
  const rootSize = parseFloat(styles.fontSize) || 16;
  if (raw.endsWith('rem')) return parseFloat(raw) * rootSize;
  if (raw.endsWith('px')) return parseFloat(raw);
  return 68;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Scrolls a section into view and hands it focus, so keyboard and screen reader
 * users land where sighted users are looking.
 */
export function scrollToSection(target: HTMLElement | string): void {
  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (!element) return;

  const offset = headerOffset() + 8;

  gsap.to(window, {
    duration: prefersReducedMotion() ? 0 : 0.7,
    ease: 'power2.inOut',
    overwrite: true,
    scrollTo: { y: element, offsetY: offset, autoKill: true },
  });

  // Move focus without a second scroll. Sections are not focusable by default,
  // so a tabindex is added once and left in place.
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
  }
  element.focus({ preventScroll: true });
}
