# QA checklist

Verified against the production static export (`npm run build`, served from
`out/`) in Chromium at 1440x900 and 375x812, unless noted.

Legend: `PASS` verified by running it. `NOT VERIFIED` needs a human or a
capability this environment could not provide.

---

## Build and types

| Check | Result |
| --- | --- |
| `npm run typecheck` clean | PASS |
| `npm run build` succeeds | PASS |
| Static export produces all 6 language routes plus robots and sitemap | PASS, 11 routes |
| No console errors on load | PASS |
| No hydration mismatch warnings | PASS, `suppressHydrationWarning` on `html` for the pre paint boot script |
| Every `styles.*` reference resolves to a real CSS module class | PASS, audited by script |
| Indonesian dictionary has no missing or stray keys | PASS, enforced by the type system: `Dictionary = typeof en` |

First load JS: 160 kB for the home page, 103 kB shared. GSAP core plus
ScrollTrigger plus ScrollToPlugin is the bulk of it.

---

## Languages

| Check | Result |
| --- | --- |
| `/` is English, `/id/` is Indonesian | PASS |
| `/privacy/`, `/terms/`, `/id/privacy/`, `/id/terms/` all render | PASS |
| `<html lang>` correct on all six pages | PASS, `en` on three, `id` on three |
| Per language `<title>` and description | PASS |
| Reciprocal `hreflang` including `x-default` | PASS, emitted by React as `hrefLang`, which HTML parses case insensitively |
| Canonical per page and language | PASS |
| Sitemap lists all six URLs | PASS |
| Language switcher links to the same page in the other language | PASS, from `/id/terms/` it points at `/terms/` |
| Switcher label written in the target language | PASS, "Baca dalam Bahasa Indonesia" on EN, "Read in English" on ID |
| Theme choice survives a language switch | PASS, storage is origin scoped |
| Nav, hero, fleet, recommender, about, booking, reviews, FAQ, contact, footer all translated | PASS |
| Legal pages translated, including live rates and real links | PASS |
| Booking WhatsApp message written in the reader's language | PASS |
| Dates localised in the message | PASS, "10 September 2026" |
| Prices identical across languages | PASS, single source in `src/data/fleet.ts` |

---

## Theme

| Check | Result |
| --- | --- |
| Toggle present in the header, 44px target | PASS |
| Every token flips | PASS, verified by reading custom property values, which are never transitioned |
| Choice persisted to `localStorage` | PASS |
| Choice applied before first paint, no flash | PASS by construction, `BootScript` runs before the body is parsed |
| Follows the OS when no explicit choice is stored | PASS by construction, `prefers-color-scheme` block mirrors the explicit block |
| Works with JavaScript disabled | PASS by construction, the media query block needs no script |
| Switch is atomic, no piecemeal cross fade | PASS, `data-theme-switching` suppresses transitions for one frame, with a timeout guard if frames are throttled |
| `color-scheme` declared so form controls and scrollbars match | PASS |

---

## Hero

| Check | Result |
| --- | --- |
| Scroll area within the 300vh to 400vh band | PASS, 360svh measured as 3.6x viewport |
| Stage sticky and exactly 100svh | PASS |
| Hero starts at document y=0 with no gap above it | PASS, header is `fixed` |
| Scroll progress drives `video.currentTime` across the full range | PASS, playhead matched expected time at every sampled progress from 0 to 1 |
| Exactly one copy beat visible at a time, in order | PASS, beat index went 0, 0, 0, 1, 1, 1, 2, 2, 3, 3 |
| Final beat holds to the end for the CTAs | PASS, visible from progress 0.85 |
| Scroll cue fades early, no bounce or loop | PASS |
| Video muted, `playsInline`, never autoplays | PASS |
| Correct source per breakpoint | PASS, `hero-desktop.mp4` at 1440px, `hero-mobile.mp4` at 375px |
| Every frame an independent seek point | PASS, 120 keyframes in a 121 frame clip |
| Loading indicator reports real buffered progress | PASS, `progressbar` with a live `aria-valuenow` |
| Only one hero image ever downloaded | PASS |
| No JavaScript: all four beats and both CTAs visible | PASS, checked in the raw exported HTML |
| Reduced motion collapses to a single screen | PASS, hero height equalled viewport height exactly |
| Save Data, 2g, or low core count skips the video | NOT VERIFIED, the logic is in `BootScript` but this environment cannot emulate those signals |

---

## Fleet

| Check | Result |
| --- | --- |
| Six vehicles, each with its own studio film | PASS |
| Card aspect ratio matches the film, so nothing shifts | PASS, 1.308 measured against 1088/832 |
| Poster and film paths derived from the slug | PASS, all twelve poster files referenced |
| Films absent from the initial markup, fetched only near the viewport | PASS, no `.mp4` in the exported HTML |
| Audio stripped from every card film | PASS, zero audio streams |
| Card container is not faded by the reveal animation | PASS, fixed after finding that a faded container blocks its own lazy image and playback |
| Six working "Book This Vehicle" buttons | PASS |
| Booking button preselects the correct vehicle | PASS, in both languages |
| Vehicle name and price never animated | PASS |
| Alternating composition on desktop, single column on mobile | PASS |
| No horizontal scrolling on mobile | PASS |
| Grandmax Blindvan priced at Rp550.000 | PASS, in fleet, booking select, and both terms pages |
| Prices consistent across fleet, recommender, booking, estimate, terms | PASS, single source |
| ScrollTrigger positions recomputed after webfonts load | PASS |
| All ScrollTrigger instances cleaned up on unmount | PASS |
| Film pauses when the card leaves the viewport | NOT VERIFIED, see below |

---

## Booking form

| Check | Result |
| --- | --- |
| All eleven fields present | PASS |
| Empty submit produces a focusable error summary | PASS, focus moved to the summary |
| `aria-invalid` on every failing field | PASS |
| Errors linked to inputs via `aria-describedby` | PASS |
| Selecting a vehicle shows its daily price | PASS |
| Estimate maths correct | PASS, Rp650.000 x 3 = Rp1.950.000 in EN, Rp550.000 x 3 = Rp1.650.000 in ID |
| Single day hire counts as one day | PASS, singular wording |
| Reversed date range rejected | PASS |
| Past start date rejected | PASS |
| Passenger count above capacity rejected with a useful message | PASS, names the vehicle and its seat count |
| WhatsApp message contains every field | PASS |
| Message goes to the primary number `6281804099113` | PASS |
| Alternative number `6289620928296` never receives submissions | PASS |
| FAQ quotes the primary number from config, not hardcoded copy | PASS, in both languages |
| No language claims a confirmed booking | PASS, in both translations |
| Popup blocked case still reachable | PASS, the status panel renders a real link |

---

## Navigation, reviews, FAQ, contact, footer

| Check | Result |
| --- | --- |
| All seven nav items point at a section that exists | PASS |
| Header transparent only where a dark hero sits behind it | PASS, solid on all four legal pages |
| Anchor scrolling does not fight the hero scrub | PASS, ScrollToPlugin with `autoKill` |
| Legal page nav links point back to the home page anchors | PASS |
| Mobile menu opens, sets `aria-expanded`, closes on Escape, returns focus | PASS |
| Mobile menu links at least 44px tall | PASS |
| Only the three owner supplied testimonials | PASS |
| No invented avatars, companies, or per review ratings | PASS |
| Review statistics attributed to the company's own records | PASS |
| Google review button hidden while `googleMapsUrl` is `null` | PASS, absent from the DOM |
| Six FAQ entries, closed initially, keyboard operable, readable without JS | PASS |
| Both WhatsApp links, mailto, Instagram, TikTok correct | PASS |
| No link resolves to `#` or an empty href | PASS |
| Logo mark in the header, full lockup in the footer | PASS |
| Header logo decorative, footer logo carries real alt text | PASS |
| Copyright year dynamic | PASS, renders 2026 |
| Active section state updates on scroll | NOT VERIFIED, see below |

---

## Content rules

| Check | Result |
| --- | --- |
| Zero em dashes or en dashes | PASS, scanned all six exported pages |
| No Lorem Ipsum or placeholder text | PASS |
| Currency is Rupiah everywhere | PASS |
| No fabricated statistics beyond the supplied data | PASS |
| No fake awards, partners, maps, availability, or confirmations | PASS |
| Indonesian testimonials are translations of the supplied text, not new reviews | PASS, noted in `src/i18n/id.ts` |
| `aggregateRating` omitted from structured data | PASS, the 4.8 figure is shown in the UI but is not machine readable, because search engines require rating markup to come from a verifiable review system |

---

## Accessibility

| Check | Result |
| --- | --- |
| Text contrast, every visible text node against its real background | PASS, 0 failures: EN light, EN dark, ID light, ID dark, and the legal pages |
| Contrast measured with error styles, estimate panel, recommender card, and open FAQ panels rendered | PASS |
| Single `h1` per page, logical heading order | PASS, all six pages |
| Semantic landmarks | PASS |
| Skip link, translated, visible on focus | PASS |
| Focus never removed, visible ring everywhere | PASS, one amber ring clearing 3:1 on light and dark |
| Zoom not disabled | PASS |
| Descriptive alt text, no text baked into content images | PASS. The footer logo does contain the brand name, which is the standard exception, and carries matching alt text |
| Touch targets | PASS, agreement checkbox 24px, contact links 44px, theme and language controls 44px |
| Off screen hero copy removed from the tab order | PASS |
| Reduced motion respected, in the hero and the fleet cards | PASS |
| Recommender result announced | PASS, live region |
| Theme toggle does not announce a state it has not confirmed | PASS, `aria-hidden` until the effect runs |

---

## Performance

| Check | Result |
| --- | --- |
| Hero video re-encoded from 10.6 MB to 3.6 MB | PASS |
| Fleet films 325 to 389 KB each, mobile variants 111 to 137 KB | PASS |
| Fleet films not fetched until near the viewport | PASS by construction |
| All images WebP with AVIF served first | PASS |
| Below the fold images lazy loaded | PASS |
| LCP image marked `fetchPriority="high"` | PASS |
| Explicit `width` and `height` on every image | PASS |
| Theme and hero layout decided before first paint, so no CLS from either | PASS |
| No continuous animation outside the viewport | PASS |
| Total deploy 17 MB, of which 5 MB is the never selected WebM | PASS, see `ASSETS.md` for how to drop it |
| Lighthouse score above 90 | NOT VERIFIED, no Lighthouse runner in this environment |
| LCP under 2.5s on a typical mobile connection | NOT VERIFIED, needs throttled field testing |

---

## Not verified here

The browser pane used for testing does not composite frames. Three browser APIs
that depend on the rendering pipeline are therefore inert in it, which was
confirmed directly rather than assumed:

- `requestAnimationFrame` fired **0 times** in a one second sample
- `IntersectionObserver` never fired, even for a plain fixed div covering the
  viewport
- Native lazy loading never triggered, while an eager image on the same page
  loaded fine

Video playback itself does work: a fleet card film reached `readyState` 4 and
played to 0.77s, so the encoded files are good.

Consequences for this checklist:

1. **The hero scrub was proven by driving the timeline directly**, not by
   scrolling with a wheel. The mapping from scroll to playhead and to beat
   visibility is correct at every sampled point. The perceived smoothness of the
   0.55s scrub still needs a real device.
2. **Anything gated on IntersectionObserver could not be exercised**: fleet card
   playback starting and pausing, and the header's active section state. The
   code paths are straightforward and were read carefully, but they were not run.
3. **Native lazy loading could not be observed.** Poster images are marked
   `loading="lazy"` and were confirmed present and correctly referenced in the
   markup.

Also still open:

4. **Visual design review.** No screenshot was ever captured, for the same
   compositing reason. Every check above is structural, geometric, or computed
   style. Someone should look at the site in both themes and both languages.
5. **Safari and iOS.** Video scrubbing behaviour differs most on iOS. Test the
   hero and the fleet cards on a real iPhone before launch.
6. **Lighthouse and field metrics.**
7. **The two WhatsApp numbers actually receiving messages.**
8. **A native Indonesian speaker reading the `/id/` copy.** The translation was
   written to match the English meaning and tone; it has not been reviewed by a
   native speaker.
