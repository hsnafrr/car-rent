'use client';

import { useEffect } from 'react';
import { scrollToSection } from '@/lib/scroll';

/**
 * Delegated handler for same page anchor links.
 *
 * Registered once at the layout level rather than wired onto every link, so
 * nav items, hero buttons, and footer links all behave the same way without
 * each component needing to know about it.
 *
 * Cross page links, modified clicks, and middle clicks are left entirely alone
 * so the browser's own behaviour, including opening in a new tab, still works.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as HTMLElement | null)?.closest('a');
      if (!link) return;
      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // A different page is a real navigation. Let the router handle it.
      if (url.pathname !== window.location.pathname) return;
      if (!url.hash || url.hash === '#') return;

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      scrollToSection(target);
      window.history.pushState(null, '', url.hash);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
