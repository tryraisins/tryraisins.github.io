# Find animation opportunities

> Looks through a codebase or interface for places that should animate and rejects those that shouldn’t, proposing motion with exact values but changing nothing.

Canonical: https://tryraisins.dev/skills/find-animation-opportunities/
Source revision: 00061b8

Search a UI for moments that should animate and reject the rest, with exact values for each surviving suggestion. Read-only; it proposes motion, it does not implement it. For fixes use `yeknal-improve-animations`.

## When to use

- You wonder what could be animated in an app.
- An interface feels static and you want it to feel more alive.
- You want proposals before anyone writes animation code.

## When not to use

To fix existing animation, use Improve animations or Review animations.

## Example

Ask: What in the onboarding flow would benefit from motion?

Outcome: It lists a few specific opportunities with durations and easing, and explains why other spots should stay still.

## Install

```text
Install the Agent Skill "yeknal-find-animation-opportunities" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-find-animation-opportunities
File list with SHA-256 hashes: https://tryraisins.dev/skills/find-animation-opportunities/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-find-animation-opportunities/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-find-animation-opportunities into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-find-animation-opportunities or ~/.claude/skills/yeknal-find-animation-opportunities, so it is available in every project.
3. If a yeknal-find-animation-opportunities folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (10208 bytes)

## Related

- [Web animation](https://tryraisins.dev/skills/animate/): Adds purposeful, accessible motion to components, pages, scrolling, gestures, SVG and canvas, with sensible timing and a reduced-motion fallback.
- [Improve animations](https://tryraisins.dev/skills/improve-animations/): Surveys an app’s existing motion like a senior motion designer would, then writes a prioritised audit with self-contained plans that other agents can carry out.

## Source

- [yeknal-find-animation-opportunities on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-find-animation-opportunities)
