# Improve animations

> Surveys an app’s existing motion like a senior motion designer would, then writes a prioritised audit with self-contained plans that other agents can carry out.

Canonical: https://tryraisins.dev/skills/improve-animations/
Source revision: 00061b8

Audit animation and motion code and produce prioritized, self-contained plans for another agent to execute; never edits source. Use when asked to improve or audit the motion, not to review one diff (`yeknal-review-animations`).

## When to use

- You want a roadmap of animation fixes across an app.
- Motion feels inconsistent and you don’t know where to start.
- You plan to hand the fixes to other agents or a cheaper model.

## When not to use

It plans changes but doesn’t edit source code.

## Example

Ask: Audit the motion across the dashboard and plan what to fix first.

Outcome: It inventories each animation, ranks the problems and writes a standalone fix plan for each.

## Install

```text
Install the Agent Skill "yeknal-improve-animations" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-improve-animations
File list with SHA-256 hashes: https://tryraisins.dev/skills/improve-animations/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-improve-animations/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-improve-animations into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-improve-animations or ~/.claude/skills/yeknal-improve-animations, so it is available in every project.
3. If a yeknal-improve-animations folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `AUDIT.md` (7399 bytes)
- `PLAN-TEMPLATE.md` (3100 bytes)
- `SKILL.md` (8005 bytes)

## Related

- [Review animations](https://tryraisins.dev/skills/review-animations/): Checks existing motion against a high craft bar, from easing and duration to interruption and reduced-motion behaviour, and explains each fix.
- [Web animation](https://tryraisins.dev/skills/animate/): Adds purposeful, accessible motion to components, pages, scrolling, gestures, SVG and canvas, with sensible timing and a reduced-motion fallback.

## Source

- [yeknal-improve-animations on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-improve-animations)
