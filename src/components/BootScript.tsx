/**
 * Two decisions that must be made before the browser paints anything.
 *
 * 1. Theme. Reading the stored choice in a React effect would paint the wrong
 *    theme first and then flash to the right one.
 *
 * 2. Hero layout. The hero has two layouts with very different heights: a
 *    normal flow still, and a 360svh scroll area with a sticky stage. Deciding
 *    that after paint would shift everything below the hero by more than two
 *    screens and wreck CLS.
 *
 * Both write an attribute onto the document element and the stylesheet keys off
 * it. Kept small and wrapped in try/catch, because anything that throws here
 * would block the rest of the page.
 */
export const THEME_STORAGE_KEY = 'morfosa-theme';

const script = `(function(){var d=document.documentElement;
try{
var t=localStorage.getItem('${THEME_STORAGE_KEY}');
if(t==='dark'||t==='light')d.setAttribute('data-theme',t);
}catch(e){}
try{
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var c=navigator.connection||{};
if(c.saveData)return;
if(c.effectiveType&&/(^|-)2g$/.test(c.effectiveType))return;
if(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2)return;
d.setAttribute('data-hero-mode','cinematic');
}catch(e){}})();`;

export function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
