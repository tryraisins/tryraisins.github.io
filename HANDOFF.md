# Project Handoff

Last updated: 2026-10-05
Branch: main
HEAD: 229485dcc774204964e94706f701434b184d7020

## Current Objective and State

Pocket Playground is the production TryRaisins portfolio. `src/pages/index.astro` imports `src/prototypes/portfolio-redesign/Play.astro`. Preserve the six projects, current copy, contact sheet, notebook layout and prototype selector route.

- Readable content starts after the shared red notebook rule. Decorative canvases span their full sections, sit behind content, and may cross the rule. Drawings remain display-only, transparent and hidden from assistive technology.
- Seven pencil canvases contain 20 classroom-style sketches. Uneven outlines, graphite grain, pressure changes, faint retracing and hatch shading replace clean icon strokes. Sketch parts animate after drawing: blinking faces, a wagging cat tail, walking dinosaur, swaying flower, waving robot, swimming fish, turning wheels and other object-specific movement.
- The lifecycle remains 5.2 seconds drawing, 11 seconds alive, 2.6 seconds erasing, with randomized 1-3 second initial gaps. Completed-cycle counting advances sketches even when a frame skips the erase boundary. Rendering uses device pixel ratio up to 2, runs at 30 FPS, skips offscreen drawings and pauses hidden-tab clocks. Reduced motion displays completed static originals.
- Nine tops appear above 1200px, seven otherwise. Nine variants use wooden pear, rounded enamel, angular blade, gear and turbine silhouettes, with different pegs, rim bands, spokes and fasteners. Wood uses a procedural RGBA grain texture; metal and enamel have separate finishes.
- Fixed-step simulation uses angular friction, increasing gyroscopic instability, precession, tipping, rim rocking and rest. Launches are distributed across the viewport; continuous artificial roaming/steering has been removed. A fresh cycle begins after all tops rest for three seconds. Spin duration varies by top and collisions.
- Top collisions use mass, rotational inertia, restitution below one and limited tangential friction to transfer spin while dissipating energy. Overlap correction also runs for separating contacts. A substantial hit may rock a resting top; scrolling leaves resting tops settled. Scroll nudges remain bounded at 6 and vertical speed at 165. Text and cards are not obstacles.
- Ground support uses a cached hull sampled from actual model geometry, including pegs, domes and fins. Fast spinning has a subtle blur ring. Reduced motion renders stationary tops. Small 5 Hz datasets (`phases`, `spinRange`, `topState`) support browser diagnosis; `hitCount` updates on collisions.
- Viewport resizing preserves spin, tilt, phase, rest timers, velocity and collision history. Height-only changes keep tops anchored, with boundary clamping; width/orientation changes remap positions and retain existing tops. Only newly visible tops launch when crossing to nine. Duplicate/empty resize notifications are ignored, and reduced motion ignores scroll forces.

## Current Task

The user selected option 1: Bricolage Grotesque for headings and DM Sans for body text/controls. The desktop/390px phone proposals were approved for implementation and production deployment. The refresh is implemented; final release verification is in progress.

- Selected: Bricolage Grotesque for display and DM Sans for body/controls. The active Astro page now uses these selected families, including the Play variant in the prototype selector.
- Editable Pen study: frame `ZSpUL`, named `TryRaisins typography study`, in the active document at `C:/Users/nubiaville/.pencil/documents/ac777916-4cc5-4906-9eaf-0ab64eb8a3ea/pencil-new.pen`. Existing unrelated canvas content was preserved. The tool operated on this active document despite a requested separate file path; no separate `portfolio-fonts.pen` was saved.
- Local exports are in ignored `output/typography-study/`: `ZSpUL.png` is the full comparison; `H9qxJ.png`, `wo1zU.png`, `fozS4.png`, and `S4xdDN.png` are the individual recommended, restrained, editorial, and current specimens. Samples use real portfolio copy, matched type sizes, and proposed spacing. They are typography excerpts, not complete redesigns.
- Live computed styles confirmed tight hero tracking (-0.076em) and 11px project descriptions. Consider these during the subsequent review. All specimens and the exported comparison were visually inspected; no implementation testing was needed. Pen's live-page screenshots timed out; the subsequent live review used Chrome.
- Review proposals in the same Pen document: desktop `uDYdI`, phone `CKIAN`, review notes `vg9oV`. Exports and five live screenshots are in ignored `output/design-review/`. The proposed hero uses a static crop of actual production decoration; animation is not demonstrated by the comp. Local assets are copied into the Pen document's `assets/` directory; image fills must use relative paths because absolute/remote fills did not render.
- Chrome live desktop and 390px phone inspection confirmed 11px descriptions, 9px project actions, 11px hero actions, and hidden mobile availability. Work navigation and shuffle/live announcement succeeded. The smaller-phone and reduced-motion review was interrupted by a browser disconnection; no proof exists for those checks. The Codex IAB backend was unavailable, and Pen browser capture was stuck, so Chrome via CUA supplied the live evidence.
- The proposal enlarges project descriptions to 15px and actions to 14px, loosens headline spacing, preserves all six project names/descriptions/URLs/assets and shuffle, retains taped photographs and yellow contact sheet, and keeps availability visible on phone. The proposed desktop desk is more regular with modest tilt and shadows; integration must retain real shuffle and existing animation behavior.
- Implemented: display weight 600, relaxed tracking/line height, DM Sans body, 15px descriptions, 14px project actions, responsive 3/2/1 card grid with modest tilt and shadows, visible phone availability, larger contact text and stacked phone social links. Existing project copy, destinations, covers and real drawing/physics modules are preserved. Shuffle uses DOM reordering and cancellable FLIP animations, guarantees a changed order, retains focus, and honors reduced motion. The prototype uses the same grid and fonts.
- Browser release evidence: ignored `output/playwright/design-refresh/acceptance.md`, `release-e2e.js`, `built-report.txt`, and hero/desk/contact screenshots. CLI E2E passed real font loading, all six original destinations, keyboard skip/work/contact navigation, repeated/rapid shuffle, no overlaps or overflow across 11 widths (320-1440px), >=44px controls, visible availability, static reduced-motion drawings/tops, enlarged text reachability and prototype switching. Screenshots at 1440/768/390/320px were inspected. After screenshot review, contact tape positioning was corrected and the final build plus full browser pass succeeded. Mobile E2E passed real touch scrolling, height-only resize continuity, preserved collision history and static reduced-motion rendering.
- Next: commit/push the scoped release, verify both Pages workflows and live assets, then record the final release evidence. No dependency or image asset changes.

## Relevant Files and Decisions

- `Play.astro`: page markup, stacking, responsive sizing and drawing placements across the margin.
- `doodle-notes.js`: sketch geometry, pencil renderer, part motion and lifecycle.
- `spinning-tops.js`: procedural models, support hulls, lighting, physics and input.
- `DESIGN-EXPLORATION.md`: selected direction and notebook decoration rules.

Use the existing Canvas 2D/Three.js implementation. No new dependency or image asset is required. Keep all decoration behind links and readable content.

## Verification

- `npm run build` passes. Existing Browserslist age and large client chunk warnings remain.
- Mobile scroll root cause: `ResizeObserver` previously called `reset()` on every size change, including mobile browser bar height changes. Chrome iPhone 15 emulation reproduced repeated spin reseeding before the fix and stable state afterward.
- Focused checks in ignored `output/playwright/mobile-scroll/` passed height changes, orientation, 320/390/844/1200/1440px sizing, 7/9 counts, zero overflow, bounded scroll, preserved collision history, motion resumption and reduced motion. `verify-mobile-scroll.js` observes the real dev scene and pauses its physics through the existing hidden-document branch; its settled-top fixture verifies the rest guard. `verify-release.js` exercises the unmodified built page with touch events and repeated viewport changes. Run either with a named mobile Chrome CLI session and `run-code --filename=<script>` from that directory. The first targets dev port 4321; the second uses the current tab URL, including preview port 4322 or production. Reports and screenshots remain local. Physical Safari toolbar behavior has not been tested.
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
