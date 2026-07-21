# CityROCK concept — scroll-zoom climbing site

Single-page UI concept for CityROCK (cityrock.co.za — not the official site, no real functionality) with a scroll-scrubbed "zoom" narrative: a distant massif → the granite wall → a lone climber, then content sections based on CityROCK's real offerings (three gyms, bouldering/rope/training, courses, community). Built with GSAP + ScrollTrigger.

## Run it

```
python climbing-site/serve.py
```

Then open http://localhost:4173. (serve.py is plain `http.server` plus a `Cache-Control: no-store` header — without it browsers heuristically cache the site's files and serve stale versions after edits. If the page ever looks outdated, one Ctrl+F5 fixes it forever.)

## How it's put together

- `index.html` — structure: pinned zoom hero → The Approach → The Wall → The Send → stats → CTA.
- `styles.css` — design tokens (ink blues, stone neutrals, one ember accent), reveal system, reduced-motion + responsive fallbacks.
- `main.js` — the choreography:
  - Pinned hero (~380vh of scroll) scrubs a GSAP timeline: each stage image scales up past ~2.5× and cross-dissolves into the next, with captions timed per stage.
  - `IntersectionObserver` handles enter-viewport reveals; intensity ramps per section (fade → staggered cards + parallax → word-stagger + layered depth).
  - Stats section: the SVG route line draw is scrubbed to scroll; the counters deliberately are NOT — they count up once (~1s) when the grid enters view and then hold, because they're real facts and scrubbing made them read as wrong values mid-scroll.
  - Side climb: a fixed column of plastic gym holds (inline-SVG tile, repeat-y) on the right edge with a small climber figure that fades in after the hero and climbs UP the holds in lockstep with reading progress, topping out exactly at the CTA. Hidden on small screens and under reduced motion.
  - Marquee: a dark strip of display-type words (solid/outlined alternating) that drifts sideways, scrubbed to scroll, between the offerings and community sections.
  - Smooth anchor scrolling via GSAP ScrollToPlugin (duration scales with distance; motion path only — reduced-motion users get instant jumps).
  - "Visit us": three location cards with CityROCK's real addresses and hours; each links out to Google Maps directions.
  - Only `transform`/`opacity` are animated; `will-change` only on the hero stages.
- `assets/stage-*.jpg` — the three zoom-stage photos (generated with Higgsfield Seedream V5 Lite, chained image references for continuity; originals re-downloadable from the Higgsfield account). The `stage-*.svg` files are the earlier vector versions, kept as backups.
- `assets/offer-*.jpg/.jpeg` — photos downloaded from cityrock.co.za (their copyright; fine for this local concept, replace before any public use).
- `assets/bg-climber.jpg` — hand-drawn line-art climber (Higgsfield-generated) used as the ghosted background of "Three cities, endless walls" via `mix-blend-mode: multiply` at low opacity, with gentle parallax.

## Reduced motion / testing

`prefers-reduced-motion: reduce` gets a static page (wide massif hero, all content visible, no scrub). Append `?motion=force` to bypass the check when testing in environments that emulate reduced motion.

## If the animation looks static

The site honors `prefers-reduced-motion`. On Windows, that signal comes from **Settings → Accessibility → Visual effects → Animation effects** — if that toggle is off, every browser on the machine reports reduced motion and the site serves the static version, with an **"Enable animations" pill** bottom-left. Clicking the pill stores the choice in localStorage and reloads with full motion. `?motion=force` does the same for one visit; `?motion=off` clears the stored choice. (Both set `html.force-motion`, which also bypasses the reduced-motion CSS fallbacks.)
