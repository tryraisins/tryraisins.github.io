# UI quality baseline

> Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI, including where the visual richness belongs.

Canonical: https://tryraisins.dev/skills/ui-quality-baseline/
Source revision: 796d3bc

Apply one shared quality contract to any visible UI, covering tokens, spacing and optical centering, typography, icons, responsive containment, states, loading, motion, copy, where the visual richness belongs, and rendered QA. Use whenever visible interface work starts.

## When to use

- You want every UI change held to the same standard.
- Layouts break at small widths or with large text.
- A screen is clean but could belong to any product.
- Loading, empty and error states keep getting forgotten.

## Example

Ask: Check the new onboarding screens against the UI baseline.

Outcome: It checks spacing, contrast, focus, responsive containment and states, then fixes what fails.

## Install

```text
Install the Agent Skill "yeknal-ui-quality-baseline" for all my projects.

Source, pinned to a published revision (14 files):
https://github.com/tryraisins/MD_Files/tree/796d3bc2c70059fc861465d1156e2bdfed50b6d7/skills/yeknal-ui-quality-baseline
File list with SHA-256 hashes: https://tryraisins.dev/skills/ui-quality-baseline/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-ui-quality-baseline/
   git -C yeknal-skill-src checkout 796d3bc2c70059fc861465d1156e2bdfed50b6d7
2. Copy skills/yeknal-ui-quality-baseline into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-ui-quality-baseline or ~/.claude/skills/yeknal-ui-quality-baseline, so it is available in every project.
3. If a yeknal-ui-quality-baseline folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 14 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/accessibility-design.md` (8412 bytes)
- `references/account-and-money.md` (5706 bytes)
- `references/color-systems.md` (6090 bytes)
- `references/component-patterns.md` (10780 bytes)
- `references/data-display.md` (6180 bytes)
- `references/effects-and-blends.md` (4035 bytes)
- `references/icons.md` (4922 bytes)
- `references/loading-and-timing.md` (3731 bytes)
- `references/mobile-web.md` (2620 bytes)
- `references/notifications-and-toasts.md` (6492 bytes)
- `references/page-and-flow.md` (5088 bytes)
- `references/typeface-options.md` (5714 bytes)
- `references/typography.md` (5735 bytes)
- `SKILL.md` (30955 bytes)

## Related

- [Frontend design](https://tryraisins.dev/skills/frontend-design/): Sets a distinctive visual direction for new or heavily reshaped UI, from typography and composition to palette, interface copy, and where the visual richness goes.
- [Break UI](https://tryraisins.dev/skills/break-ui/): Stress-tests a screen with realistic worst-case data, such as long names, missing fields, huge counts and non-Latin text, and reports every break with its fix.

## Source

- [yeknal-ui-quality-baseline on GitHub](https://github.com/tryraisins/MD_Files/tree/796d3bc2c70059fc861465d1156e2bdfed50b6d7/skills/yeknal-ui-quality-baseline)
