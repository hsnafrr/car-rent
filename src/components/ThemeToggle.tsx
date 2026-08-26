'use client';

import { useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from './BootScript';
import { SunIcon, MoonIcon } from './Icons';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

/** What the page is showing right now, whether chosen or inherited from the OS. */
function currentTheme(): Theme {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'dark' || explicit === 'light') return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle({
  label,
  toLight,
  toDark,
}: {
  label: string;
  toLight: string;
  toDark: string;
}) {
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
    setReady(true);

    // Follow the OS while the visitor has not made an explicit choice.
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!document.documentElement.hasAttribute('data-theme')) {
        setTheme(query.matches ? 'dark' : 'light');
      }
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;

    // Suppress every transition for the frame in which the palette changes, so
    // the whole page flips at once instead of cross fading piecemeal.
    root.setAttribute('data-theme-switching', '');
    root.setAttribute('data-theme', next);

    const restore = () => root.removeAttribute('data-theme-switching');
    // Two frames is the reliable way to land after the new styles are applied.
    // The timeout is a guard: if frames are throttled, as they are in a
    // background tab, transitions must not stay disabled for the whole session.
    window.requestAnimationFrame(() => window.requestAnimationFrame(restore));
    window.setTimeout(restore, 250);

    setTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* Private browsing can refuse storage. The choice still applies for this visit. */
    }
  }

  const goingDark = theme === 'light';

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      // Until the effect has run the rendered icon is a guess, so the control is
      // hidden from assistive technology rather than announcing the wrong state.
      aria-hidden={ready ? undefined : true}
      tabIndex={ready ? undefined : -1}
      aria-label={`${label}. ${goingDark ? toDark : toLight}`}
    >
      {goingDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
