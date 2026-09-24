# Project Handoff

Last updated: 2026-09-24

## Current Objective

Pocket Playground is the selected TryRaisins portfolio direction. The page now uses a ruled student-notebook backdrop with a shared book-margin layout boundary, transparent pencil sketch canvases, and a responsive Beyblade-like physics scene.

## Current State

- `src/prototypes/portfolio-redesign/Play.astro` renders the portfolio on one continuous notebook surface, with seven display-only transparent pencil drawing canvases: two in the hero, three in the work area, and two in clear space above/below the contact sheet. The contact sheet sits above its drawings. The hero introduces Seun as a Lagos-based engineer building useful web products, names React/TypeScript/Next.js/Node.js/Python, and links directly to work and contact. Copy uses a clear, first-person practitioner voice.
- `src/pages/index.astro` provides the six live project descriptions and matching SEO description. Project copy explains each product's purpose in plain language.
- `src/prototypes/portfolio-redesign/spinning-tops.js` contains the Three.js models, lighting, fixed-step physics, Beyblade-to-Beyblade and pointer interactions, shadows, and reduced-motion handling. Scroll motion applies a small bounded nudge only to active tops, and resting tops stay settled; regular motion has enough tabletop drag to recover without long glides. Nine tops are active above 1200px and seven below that breakpoint. Their spawn positions and individual roaming destinations span the hero instead of steering toward one shared upper-right point. Tops only collide with other active tops, regardless of device width. The canvas remains below the hero content in stacking order.
- `src/prototypes/portfolio-redesign/doodle-notes.js` contains 20 sketch definitions and a draw/hold/reverse lifecycle. Hold motion deforms or moves parts of the actual sketch (for example: blinking portrait/robot eyes, wagging cat tail, rotating bicycle spokes/cassette reels, and bending flower stem). Reduced-motion shows the original completed sketch without moving paths.
- Nine tops use original procedural geometry: beveled fins, metal weight rings, hubs, drivers, and colored enamel materials. Nine are active above 1200px and seven below that breakpoint. They move for roughly 85 seconds, spawn across the full hero each cycle, roam toward changing individual destinations, collide with stronger variable knockback, wobble and tip over independently, cast shadows, settle, then restart.
- Seven transparent display-only canvases span the hero, work area, and contact area. Each draws for 5.2 seconds, holds for exactly 11 seconds, erases over 2.6 seconds, then advances to another sketch. During the hold, the primary paths animate in a way specific to the doodle. Reduced-motion presents the completed drawing without animation.
- The removed middle statement section is not part of the page anymore. The contact area now exposes only the subject-prefilled email link, marker-underlined social links, and Lagos location text. The copy-email action and whole footer have been removed.

## Verification

- `npm run build` passed on 2026-09-24. Astro emitted the existing stale Browserslist data and large client chunk warnings.
- The contact and hero revision was browser-checked at desktop and 390px. The page stayed within the viewport, the revised hero actions remained accessible, the project note rendered with marker-like pencil styling, and the DOM contained zero copy-email controls and zero footer elements.
- On 2026-09-24, Chrome rendered the nine-top scene with shadows distributed across the 1440px viewport and no browser runtime errors. At 390px, runtime reported seven active tops and no browser runtime errors. Commit `29b53eb` deployed successfully in Pages workflow run `35975131108`; the cache-busted live animation bundle returned HTTP 200 and matched the local build's SHA-256.
- Mobile layout stays bounded at 390px with no horizontal overflow; the contact sheet uses reduced spacing and a three-link social row to stay compact while retaining a 56px email action and 44px social targets. The copy-email control and footer are no longer rendered. Reduced-motion disables the continuous simulation and leaves the reveal content visible.
- On 2026-09-23, Chrome checks confirmed seven doodle canvases at 1440px, 390px, and 320px with no horizontal overflow; each visible canvas changed pixels during its hold animation. A path-level check confirmed all 20 doodle types animate their own sketch geometry. Reduced-motion draws completed sketches once without a looping redraw.
- Earlier runtime checks confirmed the battlefield `z-index: 0`, hero title `z-index: 1`, rendered tops, and nonzero top-to-top hit counts at 1280px; the current wide-desktop collision markers are intentionally limited to `>1200px`.
- Runtime checks on 2026-09-14 confirmed seven active tops at 1440px and five tops at 1200px and 390px, with no DOM obstacle collision system, updated hero copy, transparent `.play-world` background, darker paper body color, and no horizontal overflow at mobile width.
- Drawing layers explicitly use `z-index: 0`, while hero text and work-desk content use `z-index: 1`, so drawings stay underneath overlapping page elements.
- Contact drawings remain behind the contact sheet and occupy the reserved top/bottom padding; verify these open-space placements at desktop and narrow mobile widths when changing contact layout.
- The notebook’s red rule and the hero, work desk, and contact content all share `--play-page-margin`. At wider viewports, the reading area is capped at `--play-content-width` so content keeps book-like line lengths; Beyblades and drawings remain full-section decorative layers and can cross the page margin.
- The supplied Sketchfab page was blocked by 403 in the research tool; Meshy’s gallery was accessible and used only for broad form cues.
- Copy was refreshed on 2026-09-23 using goodylili.com as a high-level reference for concise first-person technical positioning; no source phrasing was reused.

## Important Constraints

- Keep `.playwright-cli/` untouched; it is unrelated user state.
- Preserve the production homepage import in `src/pages/index.astro` and the prototype selector route.
- Keep `prefers-reduced-motion` behavior and avoid adding unrelated animation or content.
- GitHub Pages deploys automatically on pushes to `main` through `.github/workflows/deploy-pages.yml`.
