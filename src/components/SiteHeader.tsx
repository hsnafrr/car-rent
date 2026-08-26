'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { navIds } from '@/data/navigation';
import { company } from '@/data/company';
import { format } from '@/lib/format';
import { usePathname } from 'next/navigation';
import { localePath, pageFromPathname, type Locale } from '@/i18n';
import type { Dictionary } from '@/i18n/types';
import { MenuIcon, CloseIcon } from './Icons';
import { ThemeToggle } from './ThemeToggle';
import styles from './SiteHeader.module.css';

export function SiteHeader({
  dict,
  locale,
  languageSwitcher,
}: {
  dict: Dictionary;
  locale: Locale;
  languageSwitcher: React.ReactNode;
}) {
  const page = pageFromPathname(usePathname() ?? '/');
  /*
   * The bar is only allowed to be transparent where the dark hero sits behind
   * it, which is the home page at the top of the scroll. On the legal pages the
   * background is the page surface, and a transparent bar there would render
   * the wordmark and nav invisible.
   */
  const overHero = page === 'home';
  const home = localePath(locale, 'home');

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Solid bar once the page has moved off the top of the hero. */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* Active section state. The band keeps exactly one section current. */
  useEffect(() => {
    const sections = navIds
      .map((navId) => document.getElementById(navId))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Keep document order so overlapping sections resolve predictably.
        const current = navIds.find((navId) => visible.has(navId));
        if (current) setActiveSection(current);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  /* Escape closes the mobile menu and returns focus to the toggle. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  /* On the legal pages the section anchors live back on the home page. */
  const sectionHref = (navId: string) => (overHero ? `#${navId}` : `${home}#${navId}`);

  return (
    <header className={`${styles.header} ${!overHero || scrolled || menuOpen ? styles.solid : ''}`}>
      <div className={`container ${styles.bar}`}>
        <a
          className={styles.wordmark}
          href={sectionHref('home')}
          aria-label={format(dict.nav.brandHome, { name: company.name })}
        >
          {/* Decorative: the link carries its own label and the name is set in
              real text beside it, so the mark must not be announced twice. */}
          <img
            className={styles.mark}
            src="/logo-mark.webp"
            srcSet="/logo-mark.webp 1x, /logo-mark@2x.webp 2x"
            alt=""
            width={96}
            height={96}
            fetchPriority="high"
            decoding="async"
          />
          <span className={styles.wordmarkText}>
            <span className={styles.wordmarkStrong}>Morfosa</span>
            <span className={styles.wordmarkLight}>Transport</span>
          </span>
        </a>

        <nav className={styles.desktopNav} aria-label={dict.nav.primary}>
          <ul className={styles.navList}>
            {navIds.map((navId) => (
              <li key={navId}>
                <a
                  className={styles.navLink}
                  href={sectionHref(navId)}
                  aria-current={overHero && activeSection === navId ? 'true' : undefined}
                >
                  {dict.nav.labels[navId]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {languageSwitcher}
          <ThemeToggle
            label={dict.nav.themeLabel}
            toDark={dict.nav.themeToDark}
            toLight={dict.nav.themeToLight}
          />
          <a className={`btn btn--primary ${styles.headerCta}`} href={sectionHref('booking')}>
            {dict.nav.bookNow}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
            <span className="visually-hidden">
              {menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={styles.mobileMenu} hidden={!menuOpen}>
        <nav className="container" aria-label={dict.nav.primaryMobile}>
          <ul className={styles.mobileList}>
            {navIds.map((navId) => (
              <li key={navId}>
                <a
                  className={styles.mobileLink}
                  href={sectionHref(navId)}
                  aria-current={overHero && activeSection === navId ? 'true' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {dict.nav.labels[navId]}
                </a>
              </li>
            ))}
            <li>
              <a
                className={`btn btn--primary ${styles.mobileCta}`}
                href={sectionHref('booking')}
                onClick={() => setMenuOpen(false)}
              >
                {dict.nav.bookNow}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
