# Project Handoff

Last updated: 2026-09-30
Branch: main
HEAD: use `git rev-parse HEAD`; this handoff accompanies the animation release.

## Current Objective and State

Pocket Playground is the production TryRaisins portfolio. `src/pages/index.astro` imports `src/prototypes/portfolio-redesign/Play.astro`. Preserve the six projects, current copy, contact sheet, notebook layout and prototype selector route.

- Readable content starts after the shared red notebook rule. Decorative canvases span their full sections, sit behind content, and may cross the rule. Drawings remain display-only, transparent and hidden from assistive technology.
- Seven pencil canvases contain 20 classroom-style sketches. Uneven outlines, graphite grain, pressure changes, faint retracing and hatch shading replace clean icon strokes. Sketch parts animate after drawing: blinking faces, a wagging cat tail, walking dinosaur, swaying flower, waving robot, swimming fish, turning wheels and other object-specific movement.
- The lifecycle remains 5.2 seconds drawing, 11 seconds alive, 2.6 seconds erasing, with randomized 1-3 second initial gaps. Completed-cycle counting advances sketches even when a frame skips the erase boundary. Rendering uses device pixel ratio up to 2, runs at 30 FPS, skips offscreen drawings and pauses hidden-tab clocks. Reduced motion displays completed static originals.
- Nine tops appear above 1200px, seven otherwise. Nine variants use wooden pear, rounded enamel, angular blade, gear and turbine silhouettes, with different pegs, rim bands, spokes and fasteners. Wood uses a procedural RGBA grain texture; metal and enamel have separate finishes.
- Fixed-step simulation uses angular friction, increasing gyroscopic instability, precession, tipping, rim rocking and rest. Launches are distributed across the viewport; continuous artificial roaming/steering has been removed. A fresh cycle begins after all tops rest for three seconds. Spin duration varies by top and collisions.
- Top collisions use mass, rotational inertia, restitution below one and limited tangential friction to transfer spin while dissipating energy. Overlap correction also runs for separating contacts. A substantial hit may rock a resting top; scrolling leaves resting tops settled. Scroll nudges remain bounded at 6 and vertical speed at 165. Text and cards are not obstacles.
- Ground support uses a cached hull sampled from actual model geometry, including pegs, domes and fins. Fast spinning has a subtle blur ring. Reduced motion renders stationary tops. Small 5 Hz datasets (`phases`, `spinRange`, `topState`) support browser diagnosis; `hitCount` updates on collisions.

## Relevant Files and Decisions

- `Play.astro`: page markup, stacking, responsive sizing and drawing placements across the margin.
- `doodle-notes.js`: sketch geometry, pencil renderer, part motion and lifecycle.
- `spinning-tops.js`: procedural models, support hulls, lighting, physics and input.
- `DESIGN-EXPLORATION.md`: selected direction and notebook decoration rules.

Use the existing Canvas 2D/Three.js implementation. No new dependency or image asset is required. Keep all decoration behind links and readable content.

## Verification

- `npm run build` passes. Existing Browserslist age and large client chunk warnings remain.
- Chrome E2E exercised all 20 sketches through actual canvas rendering and pixel changes during the alive phase, including skipped-boundary cycle advancement. All seven drawings remain completed and unchanged under reduced motion.
- 1440px, 768px, 390px and 320px checks confirm zero horizontal overflow, correct 9/7 counts, ink before the red rule, and content after it. Work and Contact navigation succeed.
- Final built-preview screenshots verify the corrected wood material, no texture/shadow API warnings, identical rendered pixels under reduced motion, and resumed simulation when motion is enabled. The 1200px breakpoint retains seven tops.
- A 279-second real-time Chrome run observed spinning, wobbling, tipping, rocking, resting and two restarts. It ended with all nine resting, zero spin and zero kinetic energy; measured energy never increased between restarts. Collision counts and dissipated energy increased. Fall and rest screenshots were visually inspected.
- Browser artifacts and repeatable scripts are in ignored `output/playwright/pencil-tops/`. Open a named Chrome session, then run `npx --yes --package @playwright/cli playwright-cli -s=pencil-tops run-code --filename=drawing-e2e.js` from that directory; the script targets dev port 4321. `top-monitor.js`, `capture-fall.js` and `final-render.js` target the built preview on 4322. Reports and screenshots remain local.
- The wooden texture initially used RGB with sRGB encoding, causing WebGL warnings and black models. It now uses RGBA with opaque alpha. Three.js 0.186 uses `PCFShadowMap`; `PCFSoftShadowMap` emits a removal warning. Preserve both compatibility corrections.
- Fake-clock browser checks must pause the clock between deliberate advances and use keyboard navigation; a pointer click can wait indefinitely for stability while animation frames are paused. Do not run lifecycle tests against a dev page while code edits trigger HMR resets.

## Important Constraints and Release

- Preserve unrelated `.playwright-cli/` user state. Never commit browser scripts, screenshots, generated assets or other test artifacts.
- GitHub Pages publishes `dist` to `gh-pages` after a push to `main` through `.github/workflows/deploy-pages.yml`.
- Verify the pushed `main` SHA, Actions conclusion, and cache-busted live animation/CSS assets. A successful local build alone does not prove the release.
- No further animation feature work is pending. Follow the publication verification procedure above for every release.
