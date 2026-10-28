# Design taste for the web

> Designs and builds expressive landing pages, portfolios and marketing sites from real product evidence instead of reusable AI layouts.

Canonical: https://tryraisins.dev/skills/design-taste-frontend/
Source revision: f9d54a7

Design and build expressive landing pages, portfolios, and marketing interfaces from product evidence instead of reusable AI recipes, including showcase-level art direction. For an existing product use `yeknal-redesign-existing-projects`.

## When to use

- A new web experience needs distinctive art direction and working code.
- You want a landing page that doesn’t look like a template.
- The brand has a story the layout should carry.

## When not to use

For an existing product, use Redesign an existing product instead.

## Example

Ask: Design and build a launch page for our note-taking app that feels like ours.

Outcome: It pulls the visual direction from the product itself, then builds a responsive page with real copy and states.

## Install

```text
Install the Agent Skill "yeknal-design-taste-frontend" for all my projects.

Source, pinned to a published revision (4 files):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-design-taste-frontend
File list with SHA-256 hashes: https://tryraisins.dev/skills/design-taste-frontend/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-design-taste-frontend/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-design-taste-frontend into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-design-taste-frontend or ~/.claude/skills/yeknal-design-taste-frontend, so it is available in every project.
3. If a yeknal-design-taste-frontend folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 4 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `LICENSE.txt` (1065 bytes)
- `references/dials-and-arsenal.md` (7252 bytes)
- `references/patterns-redesign-and-sources.md` (6509 bytes)
- `SKILL.md` (7587 bytes)

## Related

- [Frontend design](https://tryraisins.dev/skills/frontend-design/): Sets a distinctive visual direction for new or heavily reshaped UI, from typography and composition to palette and interface copy.
- [High-end visual design](https://tryraisins.dev/skills/high-end-visual-design/): Creates art-directed, showcase-level web interfaces with a product-specific visual idea, expressive type, deliberate composition and considered motion.

## Source

- [yeknal-design-taste-frontend on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-design-taste-frontend)
