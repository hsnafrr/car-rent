# Morfosa Transport

Car rental with experienced drivers, Yogyakarta, trading since 2008.

A bilingual single page marketing and booking site with a scroll driven
cinematic hero, studio films for every vehicle, and a light and dark theme.
Built as a static export, so it deploys to Netlify, Vercel, or any plain static
host with no server runtime.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build and static export into `out/` |
| `npm run typecheck` | TypeScript, no emit |
| `npm run assets` | Rebuilds every image and video in `public/` from `assets-src/`. Requires ffmpeg |

`npm run assets` is only needed when a master asset changes. The generated files
are committed, so a normal install and build does not need ffmpeg.

---

## Languages

English is the default and lives at the site root. Indonesian lives under `/id`.

| Page | English | Indonesian |
| --- | --- | --- |
| Home | `/` | `/id/` |
| Privacy | `/privacy/` | `/id/privacy/` |
| Terms | `/terms/` | `/id/terms/` |

These are **separately rendered routes, not a client side toggle**. Each
language is crawlable and shareable at its own URL, with its own `<html lang>`,
its own `<title>` and description, and a reciprocal `hreflang` pair. That
matters for a Yogyakarta business whose customers mostly search in Indonesian:
a client side switch would leave the Indonesian copy invisible to search.

The switcher in the header is a real link to the same page in the other
language, and its label is written in the language being switched to.

### How the copy is organised

```
src/i18n/
  en.ts       English. The reference language.
  id.ts       Indonesian, typed as Dictionary.
  legal.ts    Privacy and Terms for both languages, as structured blocks.
  types.ts    Dictionary = typeof en
  index.ts    getDictionary, path helpers, hreflang helpers
```

`Dictionary` is derived from the English file rather than declared separately,
so **a key that is missing, misspelled, or left over in `id.ts` is a compile
error**, not a blank space on the page. Adding a third language means copying
`id.ts` and letting TypeScript list what is missing.

Facts stay out of the dictionaries. `src/data/` holds prices, seat counts,
review dates, and the recommendation rules, all language independent, so the
two translations cannot disagree about a price.

Strings with `{placeholders}` are filled by `format()` in `src/lib/format.ts`.
Dictionaries hold plain strings rather than functions, because they are passed
to client components as props and functions do not survive that boundary.

---

## Theme

Light and dark, with a toggle in the header.

The choice is stored in `localStorage` under `morfosa-theme`. With no stored
choice the site follows the operating system through `prefers-color-scheme`,
including for visitors with JavaScript disabled.

Every token name is identical across the two themes, so **no component knows
which theme is active**; only the values in `src/app/globals.css` change. The
roles worth understanding:

| Token | Light | Dark |
| --- | --- | --- |
| `--surface` | warm off white page | warm near black page |
| `--carbon` | near black, for inverted sections | a step darker than the page |
| `--text-on-dark` | off white | off white, same as `--text` |

Switching is atomic. Buttons, inputs, and nav links carry their own hover
colour transitions, and without suppression they would each cross fade at a
different speed while untransitioned surfaces snapped. `data-theme-switching`
disables every transition for the single frame in which the palette flips.

Both themes were measured: zero contrast failures across every visible text
node on every page, in both languages. See `QA-CHECKLIST.md`.

---

## Configuration you must review before launch

Everything editable lives in `src/data/` and `src/i18n/`. There is no CMS and no
database.

### 1. Site URL

Set **`NEXT_PUBLIC_SITE_URL`** to the origin the site is actually served from,
with no trailing slash. On Vercel that is Project Settings, Environment
Variables, for Production and Preview.

It feeds canonical URLs, `hreflang` alternates, Open Graph image URLs,
`sitemap.xml`, and `robots.txt`. Without it the build falls back to
`https://morfosatransport.com`, hardcoded in `src/data/company.ts`, which is
wrong on a `.vercel.app` preview and wrong until that domain is live.

```
NEXT_PUBLIC_SITE_URL=https://morfosa-transport.vercel.app
```

The `NEXT_PUBLIC_` prefix matters: the value is inlined into both the server and
the client bundle, so the two can never disagree. See `.env.example`.

### 2. Google Maps link

`src/data/company.ts` -> `company.googleMapsUrl`

Deliberately `null`. While it is `null` the site hides the "Read reviews on
Google" button and renders the location in Contact as plain text rather than a
link. Set it to the verified Google Business Profile URL to switch both on. Do
not guess this value: a wrong pin sends customers to the wrong place.

### 3. Everything else

| File | Contains |
| --- | --- |
| `src/data/company.ts` | Contact numbers, email, social handles, trust figures |
| `src/data/fleet.ts` | The six vehicles: prices, seats, and the recommendation rules |
| `src/data/reviews.ts` | Reviewer names and dates |
| `src/data/navigation.ts` | Nav ids. Each must match a section id and a label key |
| `src/i18n/en.ts`, `src/i18n/id.ts` | All customer facing wording |

Prices are plain numbers in Rupiah (`650_000`) and are formatted in one place,
`src/lib/format.ts`. Change a price there and it updates the fleet, the
recommender, the booking select, the estimate, and both terms pages together.

---

## Project structure

```
assets-src/          Masters. Not served.
  hero-master.mp4      The cinematic hero film
  brio|avanza|innova|commuter|premio|grandmax.mp4
                       Studio turntables, one per vehicle
tools/
  build-assets.mjs     Rebuilds public/ from assets-src/ and public/logo.png
public/
  logo.png             Supplied artwork, the master for the derived marks
  media/               Hero video, posters, Open Graph card
  fleet/               Per vehicle films and posters
src/
  app/
    (en)/              English routes, own root layout
    (id)/id/           Indonesian routes, own root layout
    RootShell.tsx      The shared document shell
    metadata.ts        Per page, per language metadata and hreflang
  components/          One component plus one CSS module each
  data/                Language independent facts
  i18n/                All copy
  lib/                 Formatting, WhatsApp message building, scroll
```

Next only lets a root layout render the `<html>` element, and a root layout
cannot see which route is active. Two route groups therefore each own a root
layout so `lang` is correct per language, and both delegate to `RootShell` so
the markup stays in one place.

---

## How the hero works

This is the part worth understanding before changing anything.

**The film is scrubbed, not played.** Page scroll drives `video.currentTime`
through a GSAP ScrollTrigger. The hero is a 360svh scroll area containing a
sticky 100svh stage.

**The video is encoded all intra.** The delivered master carried a single
keyframe for the whole clip, which makes seeking catastrophically slow because
every seek decodes from frame zero. `tools/build-assets.mjs` re-encodes with
`keyint=1`, so every frame is an independent seek point. This is the single
most important detail in the build. It also made the file smaller, because the
master was heavily over bitrated. If you ever replace the hero video, keep the
all intra encode.

**Theme and hero layout are decided before first paint.** `BootScript` is a
small synchronous script that reads the stored theme, then checks reduced
motion, Save Data, connection type, and core count, and writes `data-theme` and
`data-hero-mode` onto the document element. Doing either in a React effect
would paint the wrong thing first: the wrong theme, or a hero that then jumps
by more than two screens.

**Anchor scrolling is GSAP, not CSS.** `scroll-behavior: smooth` is deliberately
not set. CSS smooth scrolling animates the scroll position in a way that fights
a scrubbed ScrollTrigger. `SmoothAnchors` handles same page anchors with
ScrollToPlugin instead, with `autoKill` so a real gesture always wins. This is
assistive scrolling, not scroll hijacking.

### The four beats

Scroll progress maps to the four beats cut into the film, and the hero copy is
staged to match. Beat windows are defined in one place, `BEAT_WINDOWS` in
`src/components/Hero.tsx`.

| Progress | Film | Copy |
| --- | --- | --- |
| 0 to 25% | Departure from a business district | brand line and headline |
| 25 to 50% | Tree lined boulevard | the trusted since 2008 line |
| 50 to 75% | Mountain and lake road, rising orbit | the fleet summary line |
| 75 to 100% | Arrival, front three quarter reveal | closing line and both CTAs |

### Fallbacks

The hero degrades in one direction, to a still frame with every line of copy
and both buttons visible in normal document flow. That happens under reduced
motion, Save Data, a 2g connection, two or fewer cores, a failed video, or no
JavaScript.

The still used is the arrival frame, because it is the frame composed with
negative space for the headline and buttons. It is also the base layer under
the video during loading, so there is only ever one image download.

---

## Fleet cards

Each of the six vehicles has a studio turntable film on a black floor.

The card follows the same pattern as the hero: a poster still is always the
base layer, and the film is layered over it and faded in once it is actually
playing. One image download regardless of what happens next, a correct reduced
motion result, and a graceful outcome if autoplay is refused.

The film is **not fetched until the card is near the viewport**, and it pauses
again as soon as the card leaves. Six autoplaying loops running off screen
would cost far more than they are worth.

One thing to know if you edit the fleet reveal animation: the card container
must not be faded with `autoAlpha`. A lazy image inside a hidden container is
never fetched, and the card's own IntersectionObserver will not start playback,
so fading the container stalls its own contents. The reveal is movement only.

---

## Booking flow

The form has no backend. It validates in the browser, builds a structured
message **in the visitor's language**, and opens WhatsApp with that message
ready to send.

Nothing in the flow ever claims a booking is confirmed. Submitting shows a
status that says the request is prepared and must still be sent, and the
message itself says the price is an estimate.

Validation covers required fields, phone length, past start dates, reversed
date ranges, and passenger counts that exceed the selected vehicle's seats.
Errors appear next to each field and in a focusable summary at the top.

The estimate is `pricePerDay x rental days`, where the start and end dates both
count. A one day hire is one day, Friday to Sunday is three.

Requests go to the primary number `6281804099113`. The alternative number
`6289620928296` appears only as a secondary contact and never receives form
submissions.

Which line is primary is set in one place, `src/data/company.ts`. The FAQ answer
that quotes the number reads it from there, so swapping the two cannot leave a
stale number behind in either language.

---

## Deployment

The build produces a fully static `out/` directory.

### Netlify

Build command `npm run build`, publish directory `out`.

### Vercel

Import the repository. Vercel detects Next.js. Because `output: 'export'` is
set, it publishes `out/` as static files.

### Any static host

```bash
npm run build
```

Upload the contents of `out/`.

Serve `.mp4` with byte range support, which every normal host does. The hero
scrub depends on range requests.

---

## Accessibility notes

Targeting WCAG 2.2 AA.

- Every text and background pair was measured, in both themes and both
  languages. See `QA-CHECKLIST.md` for the audit result.
- The FAQ uses `details` and `summary` rather than a scripted accordion.
  A `summary` element is exposed as a button carrying its own expanded state,
  handles Enter and Space natively, and keeps the answers readable with
  JavaScript disabled.
- Hidden hero beats use GSAP `autoAlpha`, which sets `visibility: hidden`, so
  copy that is not currently on screen is also out of the tab order.
- Vehicle names and prices are never animated.
- The theme toggle is hidden from assistive technology until its effect has
  run, rather than announcing a state it has not yet confirmed.
- Zoom is not disabled. `maximumScale` is 5.

---

## Known limitations

**Hero resolution.** The supplied master is 1280x720. The brief asked for a 4K
master. Upscaling adds no real detail, so the web encode is native 720p. On a
large desktop display the hero is soft. If a higher resolution master is
rendered later, drop it into `assets-src/hero-master.mp4` and run
`npm run assets`; the encode settings already handle it.

**Logo background.** The supplied `logo.png` is a square lockup on its own
opaque dark navy bed, with no transparency to work with. It is therefore
presented as a deliberate tile: the monogram cropped out for the header, the
full lockup in the footer. If a transparent version is ever produced, drop it
in and the tile styling in `SiteHeader.module.css` can be relaxed.
