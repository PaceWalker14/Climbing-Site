# Climbing site — scroll animation experiment

A personal experiment in building **scroll-driven web animations**. I used
**Claude** (to write and refine the code) and **Higgsfield** (to generate the
imagery) to see how far I could push a modern, cinematic scroll experience —
a hero that zooms from a distant mountain, down to a wall, down to a climber,
followed by sections that reveal, count, and parallax as you scroll.

## Please note

- **This is front-end UI only.** It is HTML, CSS, and JavaScript — there is
  **no backend**, no database, no accounts, and no server-side logic.
- **It is not a real, functioning website.** Nothing is clickable-to-purchase,
  no forms submit anywhere, and no data is stored or sent. Buttons and links are
  visual placeholders that demonstrate where real functionality *would* go.
- It is a **design/animation concept**, styled around a fictional treatment of a
  climbing gym for a realistic subject. It is **not affiliated with, endorsed by,
  or representative of any real company.** All imagery was generated with AI.

## What it demonstrates

- A pinned, scroll-scrubbed hero that zooms through three scenes.
- Elements that fade, slide, and scale in as they enter the viewport, with the
  effects layering up (staggered reveals, parallax) the deeper you scroll.
- A scroll-linked stat counter and an SVG line that "draws" as you scroll.
- A little climber that ascends a column of holds down the side of the page,
  tracking your reading progress.
- A scroll-reactive word marquee and smooth animated anchor scrolling.
- Respects `prefers-reduced-motion` for accessibility.

## Built with

- [GSAP](https://gsap.com/) + ScrollTrigger + ScrollToPlugin (animation)
- Plain HTML / CSS / JavaScript — no framework, no build step
- Imagery generated with [Higgsfield](https://higgsfield.ai/)
- Code written with [Claude](https://claude.ai/)

## Running it locally

It's a static site, so any static file server works:

```
python serve.py
```

Then open <http://localhost:4173>.

(`serve.py` is just Python's built-in server with a `Cache-Control: no-store`
header so edits always show up. Any other static server is fine too.)

### Seeing the animations

The site honors your operating system's "reduce motion" accessibility setting.
If your OS has animations turned off (on Windows: Settings → Accessibility →
Visual effects → Animation effects), the page loads in a static form and shows
an **"Enable animations"** button in the bottom-left — click it once to opt in
to the full motion experience.
