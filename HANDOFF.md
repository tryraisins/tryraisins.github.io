# Project Handoff

Last updated: 2026-09-10

## Current Objective

Pocket Playground is the selected TryRaisins portfolio direction. The page now uses a ruled student-notebook backdrop, transparent pencil sketch canvases, and a decorative five-top Beyblade-like physics scene.

## Current State

- `src/prototypes/portfolio-redesign/Play.astro` renders the portfolio on one continuous notebook surface, with three transparent pencil drawings behind hero/work content, a marker-drawn yellow sticky-note contact section, and the 3D scene. The hero leads with TryRaisins identity, followed by the serious-things thesis.
- `src/prototypes/portfolio-redesign/spinning-tops.js` contains the Three.js models, lighting, fixed-step physics, top-to-top and pointer collisions, shadows, and reduced-motion handling. Page text and other DOM elements are not physics obstacles; the canvas remains below the hero content in stacking order.
- `src/prototypes/portfolio-redesign/doodle-notes.js` contains the 20 sketch definitions and the IDLE/DRAWING/COMPLETE/REVERSING lifecycle for each drawing.
- Five tops use original procedural geometry: beveled fins, metal weight rings, hubs, drivers, and colored enamel materials. They move for roughly 85 seconds, spawn from a randomized left/center/right region each cycle, collide with stronger variable knockback, wobble and tip over independently, cast shadows, settle, then restart.
- Three transparent canvases cover the hero and desk. Each draws for 8 seconds, holds for exactly 11 seconds, reverses over 4 seconds, then advances to another sketch. During the hold, contextual rays/clouds/leaves/rings animate only for compatible sketches. User pencil strokes are accepted only during COMPLETE and retract in reverse chronology.
- The removed middle statement section is not part of the page anymore. The contact area now exposes only the subject-prefilled email link, marker-underlined social links, and Lagos location text. The copy-email action and whole footer have been removed.

## Verification

- `npm run build` passed on 2026-09-10. Astro emitted only the existing stale Browserslist database warning.
- The contact and hero revision was browser-checked at desktop and 390px. The page stayed within the viewport, the project note rendered with marker-like pencil styling, and the DOM contained zero copy-email controls and zero footer elements.
- Desktop browser check rendered five 3D models with shadows and transparent pencil canvases on the ruled page.
- Mobile layout stays bounded at 390px with no horizontal overflow; the copy-email control and footer are no longer rendered. Reduced-motion disables the continuous simulation and leaves the reveal content visible.
- Runtime checks confirmed zero `[data-battle-obstacle]` markers, battlefield `z-index: 0`, hero title `z-index: 1`, rendered tops, and nonzero top-to-top hit counts at 1280px; the same layering and no-overflow checks passed at 390px.
- Drawing layers explicitly use `z-index: 0`, while hero text and work-desk content use `z-index: 1`, so drawings stay underneath overlapping page elements.
- The supplied Sketchfab page was blocked by 403 in the research tool; Meshy’s gallery was accessible and used only for broad form cues.

## Important Constraints

- Keep `.playwright-cli/` untouched; it is unrelated user state.
- Preserve the production homepage import in `src/pages/index.astro` and the prototype selector route.
- Keep `prefers-reduced-motion` behavior and avoid adding unrelated animation or content.
