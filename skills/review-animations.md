# Review animations

> Checks existing motion against a high craft bar, from easing and duration to interruption and reduced-motion behaviour, and explains each fix.

Canonical: https://tryraisins.dev/skills/review-animations/
Source revision: 00061b8

Review animation and motion code against a high craft bar derived from Emil Kowalski's design engineering philosophy. Use when auditing interface motion, transitions, easing, or interaction choreography.

## When to use

- You are reviewing a change that adds or alters animation.
- Motion feels slow, floaty or janky.
- You want specific fixes rather than general advice.

## Example

Ask: Review the animations in this pull request.

Outcome: It checks each animation’s purpose, timing and easing, and suggests concrete changes with values.

## Install

```text
Install the Agent Skill "yeknal-review-animations" for all my projects.

Source, pinned to a published revision (2 files):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-review-animations
File list with SHA-256 hashes: https://tryraisins.dev/skills/review-animations/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-review-animations/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-review-animations into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-review-animations or ~/.claude/skills/yeknal-review-animations, so it is available in every project.
3. If a yeknal-review-animations folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 2 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (9197 bytes)
- `STANDARDS.md` (9819 bytes)

## Related

- [Improve animations](https://tryraisins.dev/skills/improve-animations/): Surveys an app’s existing motion like a senior motion designer would, then writes a prioritised audit with self-contained plans that other agents can carry out.
- [Web animation](https://tryraisins.dev/skills/animate/): Adds purposeful, accessible motion to components, pages, scrolling, gestures, SVG and canvas, with sensible timing and a reduced-motion fallback.

## Source

- [yeknal-review-animations on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-review-animations)
