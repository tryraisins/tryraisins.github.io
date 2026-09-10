# Project Handoff

Last updated: 2026-09-10

## Current Objective

Pocket Playground is the selected TryRaisins portfolio direction. The page now uses a ruled student-notebook backdrop, sticky-note sketch canvases, and a decorative five-top Beyblade-like physics scene.

## Current State

- `src/prototypes/portfolio-redesign/Play.astro` renders the portfolio on one continuous notebook surface, with five sticky doodle notes, and mounts the 3D scene.
- `src/prototypes/portfolio-redesign/spinning-tops.js` contains the Three.js models, lighting, fixed-step physics, collisions, pointer interaction, shadows, and reduced-motion handling.
- `src/prototypes/portfolio-redesign/doodle-notes.js` contains the 20 sketch definitions and the IDLE/DRAWING/COMPLETE/REVERSING lifecycle for each note.
- Five tops use original procedural geometry: beveled fins, metal weight rings, hubs, drivers, and colored enamel materials. They move for roughly 85 seconds, spawn from a randomized left/center/right region each cycle, collide with stronger variable knockback, wobble and tip over independently, cast shadows, settle, then restart.
- Five sticky canvases cover the hero, desk, blue note, and footer. Each draws for 8 seconds, holds for exactly 11 seconds, reverses over 4 seconds, then advances to another sketch. During the hold, contextual rays/clouds/leaves/rings animate only for compatible sketches. User pencil strokes are accepted only during COMPLETE and retract in reverse chronology.

## Verification

- `npm run build` passed on 2026-09-10. Astro emitted only the existing stale Browserslist database warning.
- Desktop browser check rendered five 3D models with shadows and five visible sticky-note canvases on the ruled page.
- Mobile layout keeps the sticky notes bounded and retains the existing no-overflow intent; reduced-motion disables the continuous simulation and leaves the reveal content visible.
- The supplied Sketchfab page was blocked by 403 in the research tool; Meshy’s gallery was accessible and used only for broad form cues.

## Important Constraints

- Keep `.playwright-cli/` untouched; it is unrelated user state.
- Preserve the production homepage import in `src/pages/index.astro` and the prototype selector route.
- Keep `prefers-reduced-motion` behavior and avoid adding unrelated animation or content.
