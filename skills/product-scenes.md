# Product scenes

> Builds authored faux product UI for marketing and social surfaces, such as hero stills, feature cards, cursor demos and bento grids, derived from the real product and labelled so a picture is never mistaken for a live screenshot.

Canonical: https://tryraisins.dev/skills/product-scenes/
Source revision: 317a7b0

Build authored faux product UI for marketing and social surfaces: stills, feature cards, cursor demos and bento grids that read like the real product without pretending to be a live screenshot. Use for landing page hero art, README images, changelog cards, launch clips and social posts.

## When to use

- You need a hero image, changelog card or social still of the product.
- A launch page needs a feature card or bento grid showing real screens.
- You want a short loop that shows one interaction and its result.
- An existing mockup has invented metrics, names or logos in it.

## When not to use

Not for building the working interface, and not for general UI motion. Use it for the exported image or loop itself.

## Example

Ask: Make a hero image and a short loop for the invoice feature.

Outcome: It derives the real product tokens, composes one scene around a single claim, exports the still and the loop at their display sizes, and keeps the exports as the evidence.

## Install

```text
Install the Agent Skill "yeknal-product-scenes" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/317a7b0d085a9a6c1e4c404d4bfbd1946a966c2d/skills/yeknal-product-scenes
File list with SHA-256 hashes: https://tryraisins.dev/skills/product-scenes/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-product-scenes/
   git -C yeknal-skill-src checkout 317a7b0d085a9a6c1e4c404d4bfbd1946a966c2d
2. Copy skills/yeknal-product-scenes into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-product-scenes or ~/.claude/skills/yeknal-product-scenes, so it is available in every project.
3. If a yeknal-product-scenes folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/scene-composition.md` (7196 bytes)
- `references/scene-motion-and-capture.md` (6650 bytes)
- `SKILL.md` (10418 bytes)

## Related

- [Design taste for the web](https://tryraisins.dev/skills/design-taste-frontend/): Designs and builds expressive landing pages, portfolios and marketing sites from real product evidence instead of reusable AI layouts.
- [Brand kit images](https://tryraisins.dev/skills/brandkit/): Generates polished brand-guideline boards, logo systems and identity presentations as images, with deliberate composition and sparse typography.
- [Pick a UI library](https://tryraisins.dev/skills/pick-ui-library/): Recommends the right library or inspectable source registry for a frontend need from a curated list, from accessible primitives to charts, toasts and drag and drop.
- [Web animation](https://tryraisins.dev/skills/animate/): Adds purposeful, accessible motion to components, pages, scrolling, gestures, SVG and canvas, with sensible timing and a reduced-motion fallback.

## Source

- [yeknal-product-scenes on GitHub](https://github.com/tryraisins/MD_Files/tree/317a7b0d085a9a6c1e4c404d4bfbd1946a966c2d/skills/yeknal-product-scenes)
