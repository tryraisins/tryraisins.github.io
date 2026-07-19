# TryRaisins portfolio — concept 01

## Direction

**Living sketchbook meets precision engineering.** The portfolio remains the main event: large editorial project rows, direct proof, and restrained information design. A reactive line language adds personality and creates a bridge into the hidden games.

This is an original direction informed by the references' confidence, scale, motion, and sense of play—not a visual clone.

## Visual system

- Bone paper and dense black ink as the core palette.
- Acid green and signal orange as functional accents, not gradients.
- Archivo Black for expressive display type, Manrope for readable copy, and DM Mono for technical metadata.
- Hand-drawn SVG paths cross the rigid grid. The tension between the two is the central visual motif.
- Motion hierarchy: hero line draw, typography reveal, project-row washes, then small contextual feedback.
- A complete inverted theme is included in the prototype.

## Portfolio behavior

- The first screen states the name, role, and value immediately.
- Work follows before biography or game material.
- Every project row exposes type and year and can expand into richer imagery in the final build.
- The game launcher is persistent but visually secondary. It derives its challenge from the section in view.

## Proposed game set

1. **Glyph Serpent** replaces Copy Clue. A snake moves through the active section and consumes visible characters. Each eaten glyph becomes a labeled body segment; DOM mutations are reversible, and the section restores after the run.
2. **Five-ish** replaces Signal Trace. The target is randomly selected from normalized section words longer than four letters. It uses a six-row keyboard, duplicate-letter-safe scoring, physical and on-screen input, and accessible status text.
3. **Stack Architect** is the new high-effort game. The player connects drifting requirement and technology nodes into a valid client/API/data/deployment graph. Content is based on the portfolio's real projects and skills, with multiple valid solutions and explainable constraints.
4. **Pattern Recall** stays, subject to keyboard, cleanup, and repeatability tests.
5. **Section Invaders** stays, subject to focus, mobile control, resize, collision, cleanup, and win/loss tests.

## Current game baseline review

- **Signal Trace:** marked for removal. Its hit handler is not idempotent, so fast/repeated keyboard activation can count one target more than once. A no-target path can also leave the game promise unresolved.
- **Copy Clue:** marked for removal. It has the same repeated-activation risk and can end early when a section has fewer than five unique eligible words.
- **Pattern Recall:** keep with fixes. Input is not locked while a failed sequence is replaying, so clicks can race with overlapping replay timers. Multi-letter wrapping on one text node also has edge cases that can silently reduce the target pool.
- **Section Invaders:** keep with fixes. Boundary reversal can trigger a drop on several consecutive frames because invaders are not clamped back inside the edge. That can cause an abrupt loss. Its window-level input also captures arrows/space outside the focused canvas, and it has no touch controls.

These findings are from a source-level baseline audit. Automated browser execution is reserved for the approved implementation; the current workspace does not include Playwright in its project dependencies.

## Final-build animation plan

- Use GSAP for scroll-linked typography and project transitions.
- Use Three.js only for a lightweight reactive line field or project-detail depth layer, loaded after the main content and disabled for reduced motion or constrained devices.
- Keep game rendering in Canvas 2D unless a specific mechanic materially benefits from WebGL.
- The page must remain readable and navigable with animation and games disabled.

## Approval decisions

Before full implementation, confirm:

- Overall art direction and palette.
- Oversized display typography versus a quieter scale.
- Whether the sketch line should be more geometric or more hand-drawn.
- Whether games remain hidden/contextual or receive a visible Playground index.
