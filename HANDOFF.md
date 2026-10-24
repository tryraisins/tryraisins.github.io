# Project Handoff

Last updated: 2026-10-24
Branch: main
HEAD: use `git rev-parse HEAD` for the latest documentation revision.

## Current Objective and State

Pocket Playground is the production TryRaisins portfolio. `src/pages/index.astro` imports `src/prototypes/portfolio-redesign/Play.astro`. The page is a ruled notebook with pencil drawings and spinning tops, and it now reads as a physical sketchbook: Caveat handwriting for annotations, a pinned sequence of project prints, and a lighter three.js scene.

- Copy, project data, destinations, the suspended BetPicks treatment, the contact reveal, the XOR-masked email and all SEO/JSON-LD are unchanged. Preserve them.
- Fonts are self-hosted from `src/styles/fonts.css` + `public/fonts/*.woff2` (five families, latin only): Bricolage Grotesque 600, DM Sans 400-600, Caveat 400-700, JetBrains Mono 400, Permanent Marker 400. There is no Google Fonts request. Barlow Condensed and Public Sans were removed; do not reintroduce them.
- Caveat carries the pencil voice: hero kicker, section titles, eyebrow, labels, project footers, margin notes, captions, page numbers and the signature. Bricolage keeps the H1 and project names; DM Sans keeps body copy, nav and buttons. Never set Caveat uppercase, tracked, or as body text.
- Paper furniture: a static SVG grain tile in the `.play-world` background stack (5% opacity), hand-drawn two-stroke dividers, page numbers `p. 01`-`p. 03`, margin notes, a launch-ring caption and a handwritten "Seun" signature.
- Projects are seven prints in a scroll-pinned sequence (`reel.js`) on wide, tall screens. Without JS, with reduced motion, below 901px wide or below 621px tall they are a static grid (desktop) or a native `scroll-snap` swipe rail (phones and tablets). "Spread them out" / "Stack them up" toggles the pinned mode and replaces the old shuffle.
- Prints are landscape (16:10), matching the 1440x900 covers, so no screenshot is cropped through its own headline. The Talent Hunter cover is a capture of its live landing page (the old one showed an authentication modal). `output/playwright/reel-perf/cover.cjs` re-captures it.
- The reel writes one custom property per print (`--frame`) from a single rAF-coalesced passive scroll listener; CSS derives transform and opacity. Geometry is measured on resize only. `data-reel-active` and `data-reel-progress` exist for tests. A print rests for 10% of its step, which keeps the sequence moving.
- Tops are now a hero toy: five above 1200px, four above 620px, three on phones. `spinning-tops.js` fades the fixed layer out (`data-idle`) once the hero falls below 12% visible and stops requesting frames entirely; it resumes when the hero returns. Physics and rendering are both paused, so the desk and contact sections cost nothing.
- Quality tiers, all at 60fps (never halve the rate; a 30fps cap reads as a stutter):
  - 0, modern desktop: device pixel ratio up to 1.5, multisampling, 1024 shadow map.
  - 1, phones and older laptops: ratio up to 1.25, multisampling, 512 shadow map.
  - 2, four threads or less (a 2013 MacBook): ratio 1, no multisampling, no shadow map.
  Measured on an Intel Iris 6100, the five tops hold 60fps at 1440x900 but drop frames at 1800x1125, which is why tier 2 renders at device pixels. A frame-time watchdog can drop one more tier at runtime. Clearcoat is gone (standard material) and the trail canvas renders at ratio 1.
- Doodles were the real bottleneck, not the tops. `doodle-notes.js` now samples at 1.7px (2.4 on lean machines), writes into flat coordinate arrays instead of allocating a point object per sample, measures each path once, batches strokes into three pressure buckets, draws at most one sketch per frame round-robin, and gives an expensive sketch its own lower rate instead of the page's. On the same machine the hero went from 50ms to 17ms per frame with the doodles running. Lean machines also skip the third pencil pass, coarser grain and the blend mode (`is-lean`).
- `public/og-notebook.png` was re-rendered from the new hero by `scripts/render-social-preview.js`. The card hides the tops and launch ring; its alt text describes the paper, handwriting and pencil sketches.

## Relevant Files

- `src/prototypes/portfolio-redesign/Play.astro`: markup, page script, all homepage CSS.
- `src/prototypes/portfolio-redesign/reel.js`: pinned print sequence, index rail, spread toggle, keyboard focus.
- `src/prototypes/portfolio-redesign/spinning-tops.js`: models, physics, quality tiers, hero visibility pause.
- `src/prototypes/portfolio-redesign/spinning-top-effects.js`: pooled sparks; `setPixelRatio` tracks the renderer tier.
- `src/prototypes/portfolio-redesign/doodle-notes.js`: pencil renderer, batching, lean tier.
- `src/prototypes/portfolio-redesign/launch-ring.js`: per-round pencil ring (unchanged).
- `src/styles/fonts.css`, `public/fonts/`: self-hosted faces.
- `scripts/render-social-preview.js`: OG card renderer (also runnable via `output/playwright/reel-perf/og.cjs`).

## Verification (2026-10-24, built preview on 4323)

- `npm run build` passes (96 pages, including the 93-skill snapshot at HEAD). `git diff --check` passes.
- `node output/playwright/reel/e2e.cjs http://127.0.0.1:4323/`: 62/62. Covers pinned mode at 1440/1180/960, static grid at 1440x600, reduced motion and no JS, swipe rail at 768/390/320, equal-height cards, index jumps, focus movement, the spread toggle, no overflow at 320-1440 including 24px root text, pencil notes clear of text, no console errors. Report in `output/playwright/reel/run/`.
- `node output/playwright/reel-perf/verify.cjs http://127.0.0.1:4323/`: 19/19. Covers five desktop tops, all five self-hosted families loaded, zero Google Fonts requests, Caveat vs printed type roles, `data-idle` with a frozen simulation clock behind the sheet, parked prints not painted, active print painted, a full-page scroll recorded at p50 16.7ms / p95 17.2ms with no long tasks, resume at the top, three tops on the phone rail, and the full tier still rendering with shadows. Report in `output/playwright/reel-perf/report.json`.
- Isolated frame timings (`node output/playwright/reel-perf/frames.cjs`), median of three samples on the Intel Iris 6100: hero 16.7ms with the tops running (16.7ms with them hidden), desk scroll 16.7ms. `isolate.cjs` proves the doodles, not the tops, were the expensive part: hiding both canvases changed nothing, hiding the doodle layers took the hero from ~50ms to 16.7ms.
- Before/after on the same machine, `node output/playwright/reel-perf/compare.cjs <url> <label>` against a worktree of `6190564` and this build: hero scroll 19fps -> 60fps (p50 64.6ms -> 16.7ms), desk scroll 36fps -> 59.8fps, whole page 36.8fps -> 59.3fps, draw calls 96 -> 49, triangles 31,888 -> 11,996, tops 8 -> 5. Reports in `compare-before.json` and `compare-final.json`.
- Screenshots reviewed at 1440 (hero, print 01, print 04 with the new cover, print 07, contact, spread grid), 768 (hero, rail), 390 (hero, rail) and reduced motion. Files in `output/playwright/reel-perf/shots/`.
- `output/playwright/reel-perf/shots.cjs` re-captures the spread/tablet/reduced-motion states. `og.cjs` re-runs the production OG renderer with the local Playwright. `cover.cjs` re-captures the Talent Hunter cover from its live landing page. `print.cjs <url> <index> <name>` screenshots a single print.

Unverified: Safari and Firefox (the parked-print `visibility` rule is a style query and degrades to opacity 0), physical iOS, and the user's 2013 MacBook. The quality tier for that machine is inferred from `hardwareConcurrency <= 4`, which is exactly what this dev machine reports, so tier 2 is what was tested here. All frame timings are Chrome on an Intel Iris 6100, not Safari on the user's machine.

## Decisions and Constraints

- The pinned reel is progressive enhancement: the static grid is the source of truth, and pinning only ever adds `data-reel-mode="pinned"`.
- The sticky sheet paints its own paper so the paused tops layer cannot show through it.
- Never cap the tops or doodles below 60fps to save work. Reduce resolution, shadows or per-frame work instead; a halved rate is what reads as a stutter. The doodles, not the tops, are the expensive part: keep one sketch per frame and the flat-array renderer.
- Do not reintroduce the shuffle, Barlow Condensed, Public Sans, a Google Fonts link, `mix-blend-mode` on more than one doodle layer per view, or more than five tops on desktop.
- Keep the notebook rules, the red margin rule, readable content clear of the rule, 44px targets and the 3px blue focus ring.
- Writing style: natural prose, no em dashes, no staccato fragments, no decorative underlines on links.
- Preserve unrelated `.playwright-cli/` user state. Never commit browser scripts, screenshots or generated artifacts; `output/` is ignored.

## Release

- GitHub Pages publishes `dist` to `gh-pages` after a push to `main` through `.github/workflows/deploy-pages.yml`.
- After pushing, verify the `main` SHA, the Actions conclusion, and cache-busted live HTML/CSS/font/JS parity. A local build alone does not prove the release.
