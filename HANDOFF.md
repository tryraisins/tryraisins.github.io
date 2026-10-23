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
- The reel writes one custom property per print (`--frame`) from a single rAF-coalesced passive scroll listener; CSS derives transform and opacity. Geometry is measured on resize only. `data-reel-active` and `data-reel-progress` exist for tests.
- Tops are now a hero toy: five above 1200px, four above 620px, three on phones. `spinning-tops.js` fades the fixed layer out (`data-idle`) once the hero falls below 12% visible and stops requesting frames entirely; it resumes when the hero returns. Physics and rendering are both paused, so the desk and contact sections cost nothing.
- Quality tiers: 0 (modern desktop: DPR 1.5, 1024 shadow map, 60fps), 1 (phones and older laptops: DPR 1.25, 512 shadow map), 2 (four threads or less, e.g. a 2013 MacBook: DPR 1, no shadows, 30fps). A frame-time watchdog can drop one more tier at runtime. Clearcoat was replaced with standard material, and the trail canvas renders at DPR 1.
- Doodles batch strokes into three pressure buckets (about 20-30x fewer canvas calls), draw at 30fps (18fps on four-thread machines), skip the faint third pass and the blend mode on those machines (`is-lean`), and stop requesting frames when no drawing is visible.
- `public/og-notebook.png` was re-rendered from the new hero by `scripts/render-social-preview.js`. The card now hides the tops and launch ring; its alt text describes the paper, handwriting and pencil sketches.

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

- `npm run build` passes (94 pages). `git diff --check` passes.
- `node output/playwright/reel/e2e.cjs http://127.0.0.1:4323/`: 62/62. Covers pinned mode at 1440/1180/960, static grid at 1440x600, reduced motion and no JS, swipe rail at 768/390/320, equal-height cards, index jumps, focus movement, the spread toggle, no overflow at 320-1440 including 24px root text, pencil notes clear of text, no console errors. Report in `output/playwright/reel/run/`.
- `node output/playwright/reel-perf/verify.cjs http://127.0.0.1:4323/`: 20/20. Covers five desktop tops, all five self-hosted families loaded, zero Google Fonts requests, Caveat vs printed type roles, `data-idle` with a frozen simulation clock behind the sheet, parked prints not painted, active print painted, a 4s full-page scroll at p50 16.4ms / p95 21.5ms / max 50ms with 0ms long tasks, resume at the top, three tops on the phone rail, and the full tier still rendering with shadows (quality 0, about 39-76 draw calls). Report in `output/playwright/reel-perf/report.json`.
- Screenshots reviewed at 1440 (hero, print 01, mid-turn, contact, spread grid), 768 (hero, rail), 390 (hero, rail) and reduced motion. Files in `output/playwright/reel-perf/shots/`.
- `output/playwright/reel-perf/shots.cjs` re-captures the spread/tablet/reduced-motion states. `og.cjs` re-runs the production OG renderer with the local Playwright.

Unverified: Safari and Firefox (the parked-print `visibility` rule is a style query and degrades to opacity 0), physical iOS, and the user's 2013 MacBook. The quality tier for that machine is inferred from `hardwareConcurrency <= 4`, which is exactly what this dev machine reports, so tier 2 is what was tested here.

## Decisions and Constraints

- The pinned reel is progressive enhancement: the static grid is the source of truth, and pinning only ever adds `data-reel-mode="pinned"`.
- The sticky sheet paints its own paper so the paused tops layer cannot show through it.
- Do not reintroduce the shuffle, Barlow Condensed, Public Sans, a Google Fonts link, `mix-blend-mode` on more than one doodle layer per view, or more than five tops on desktop.
- Keep the notebook rules, the red margin rule, readable content clear of the rule, 44px targets and the 3px blue focus ring.
- Writing style: natural prose, no em dashes, no staccato fragments, no decorative underlines on links.
- Preserve unrelated `.playwright-cli/` user state. Never commit browser scripts, screenshots or generated artifacts; `output/` is ignored.

## Release

- GitHub Pages publishes `dist` to `gh-pages` after a push to `main` through `.github/workflows/deploy-pages.yml`.
- After pushing, verify the `main` SHA, the Actions conclusion, and cache-busted live HTML/CSS/font/JS parity. A local build alone does not prove the release.
