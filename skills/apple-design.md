# Apple-style interface design

> Brings Apple’s approach to fluid, physical motion and interface design to the web, from springs and interruptible gestures to materials, depth and typography.

Canonical: https://tryraisins.dev/skills/apple-design/
Source revision: 95a39b5

Apple-style fluid UI for the web: press response, 1:1 tracking, interruptible springs, velocity handoff, momentum projection, rubber-banding, translucent materials, and optical type. Use for gesture-driven or spring-based interfaces.

## When to use

- You are building drag, swipe or sheet interactions that should feel physical.
- You want spring animation and momentum that can be interrupted.
- Typography, translucency and depth need the restraint Apple interfaces are known for.

## Example

Ask: Review our swipe-to-dismiss card and make it feel more like iOS.

Outcome: It checks how the gesture tracks the finger, tunes the spring and velocity hand-off and adds a reduced-motion alternative.

## Install

```text
Install the Agent Skill "yeknal-apple-design" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-apple-design
File list with SHA-256 hashes: https://tryraisins.dev/skills/apple-design/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-apple-design/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-apple-design into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-apple-design or ~/.claude/skills/yeknal-apple-design, so it is available in every project.
3. If a yeknal-apple-design folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/design-foundations.md` (4417 bytes)
- `references/motion.md` (16938 bytes)
- `SKILL.md` (2290 bytes)

## Related

- [Web animation](https://tryraisins.dev/skills/animate/): Adds purposeful, accessible motion to components, pages, scrolling, gestures, SVG and canvas, with sensible timing and a reduced-motion fallback.

## Source

- [yeknal-apple-design on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-apple-design)
