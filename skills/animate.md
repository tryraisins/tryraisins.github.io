# Web animation

> Adds purposeful, accessible motion to components, pages, scrolling, gestures, SVG and canvas, with sensible timing and a reduced-motion fallback.

Canonical: https://tryraisins.dev/skills/animate/
Source revision: 00061b8

Implement purposeful, accessible web motion. Use for new component, page, scroll, gesture, SVG, or canvas animation; use review-animations to audit existing motion.

## When to use

- You are adding an entrance, transition or gesture to a web interface.
- A component needs motion that explains a change instead of decorating it.
- You want motion that stays smooth and respects reduced-motion settings.

## When not to use

To audit motion that already exists, use Review animations instead.

## Example

Ask: Animate the settings drawer so it slides in from the right and can be interrupted halfway.

Outcome: It picks the properties, duration and easing, builds an interruptible transition and adds a reduced-motion version.

## Install

```text
Install the Agent Skill "yeknal-animate" for all my projects.

Source, pinned to a published revision (6 files):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-animate
File list with SHA-256 hashes: https://tryraisins.dev/skills/animate/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-animate/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-animate into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-animate or ~/.claude/skills/yeknal-animate, so it is available in every project.
3. If a yeknal-animate folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 6 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `RECIPES.md` (7957 bytes)
- `references/component-motion-craft.md` (17786 bytes)
- `references/frame-budget.md` (4330 bytes)
- `references/motion-principles.md` (4250 bytes)
- `references/rendered-video.md` (10652 bytes)
- `SKILL.md` (16383 bytes)

## Related

- [Review animations](https://tryraisins.dev/skills/review-animations/): Checks existing motion against a high craft bar, from easing and duration to interruption and reduced-motion behaviour, and explains each fix.
- [Find animation opportunities](https://tryraisins.dev/skills/find-animation-opportunities/): Looks through a codebase or interface for places that should animate and rejects those that shouldn’t, proposing motion with exact values but changing nothing.

## Source

- [yeknal-animate on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-animate)
