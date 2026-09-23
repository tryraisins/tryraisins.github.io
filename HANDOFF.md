# Project Handoff

Last updated: 2026-09-23

## Current Objective

Pocket Playground is the selected TryRaisins portfolio direction. The page now uses a ruled student-notebook backdrop with a shared book-margin layout boundary, transparent pencil sketch canvases, and a responsive Beyblade-like physics scene.

## Current State

- `src/prototypes/portfolio-redesign/Play.astro` renders the portfolio on one continuous notebook surface, with three display-only transparent pencil drawings behind hero/work content, a marker-drawn yellow sticky-note contact section, and the 3D scene. The hero introduces Seun as a Lagos-based engineer building useful web products, names React/TypeScript/Next.js/Node.js/Python, and links directly to work and contact. Copy uses a clear, first-person practitioner voice.
- `src/pages/index.astro` provides the six live project descriptions and matching SEO description. Project copy explains each product's purpose in plain language.
- `src/prototypes/portfolio-redesign/spinning-tops.js` contains the Three.js models, lighting, fixed-step physics, Beyblade-to-Beyblade and pointer interactions, shadows, and reduced-motion handling. Seven tops are active above 1200px and five below that breakpoint; tops only collide with other active tops, regardless of device width. The canvas remains below the hero content in stacking order.
- `src/prototypes/portfolio-redesign/doodle-notes.js` contains the 20 sketch definitions and the IDLE/DRAWING/COMPLETE/REVERSING lifecycle for each drawing.
- Seven tops use original procedural geometry: beveled fins, metal weight rings, hubs, drivers, and colored enamel materials. Seven are active above 1200px and five below that breakpoint. They move for roughly 85 seconds, spawn from a randomized left/center/right region each cycle, collide with stronger variable knockback, wobble and tip over independently, cast shadows, settle, then restart.
- Three transparent display-only canvases cover the hero and desk. Each draws for 5.2 seconds, holds for exactly 11 seconds, erases over 2.6 seconds, then advances to another sketch. During the hold, contextual rays/clouds/leaves/rings animate only for compatible sketches.
- The removed middle statement section is not part of the page anymore. The contact area now exposes only the subject-prefilled email link, marker-underlined social links, and Lagos location text. The copy-email action and whole footer have been removed.

## Verification

- `npm run build` passed on 2026-09-10. Astro emitted only the existing stale Browserslist database warning.
- The contact and hero revision was browser-checked at desktop and 390px. The page stayed within the viewport, the revised hero actions remained accessible, the project note rendered with marker-like pencil styling, and the DOM contained zero copy-email controls and zero footer elements.
- Desktop browser check rendered the 3D models with shadows and transparent pencil canvases on the ruled page; the latest 1440px pass confirmed seven active tops.
- Mobile layout stays bounded at 390px with no horizontal overflow; the contact sheet uses reduced spacing and a three-link social row to stay compact while retaining a 56px email action and 44px social targets. The copy-email control and footer are no longer rendered. Reduced-motion disables the continuous simulation and leaves the reveal content visible.
- Earlier runtime checks confirmed the battlefield `z-index: 0`, hero title `z-index: 1`, rendered tops, and nonzero top-to-top hit counts at 1280px; the current wide-desktop collision markers are intentionally limited to `>1200px`.
- Runtime checks on 2026-09-14 confirmed seven active tops at 1440px and five tops at 1200px and 390px, with no DOM obstacle collision system, updated hero copy, transparent `.play-world` background, darker paper body color, and no horizontal overflow at mobile width.
- Drawing layers explicitly use `z-index: 0`, while hero text and work-desk content use `z-index: 1`, so drawings stay underneath overlapping page elements.
- The notebook’s red rule and the hero, work desk, and contact content all share `--play-page-margin`. At wider viewports, the reading area is capped at `--play-content-width` so content keeps book-like line lengths; Beyblades and drawings remain full-section decorative layers and can cross the page margin.
- The supplied Sketchfab page was blocked by 403 in the research tool; Meshy’s gallery was accessible and used only for broad form cues.
- Copy was refreshed on 2026-09-23 using goodylili.com as a high-level reference for concise first-person technical positioning; no source phrasing was reused.

## Important Constraints

- Keep `.playwright-cli/` untouched; it is unrelated user state.
- Preserve the production homepage import in `src/pages/index.astro` and the prototype selector route.
- Keep `prefers-reduced-motion` behavior and avoid adding unrelated animation or content.
- GitHub Pages deploys automatically on pushes to `main` through `.github/workflows/deploy-pages.yml`.
