# UI quality baseline

> Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI.

Canonical: https://tryraisins.dev/skills/ui-quality-baseline/
Source revision: 95a39b5

Apply one shared quality contract to any visible UI, covering tokens, spacing and optical centering, typography, icons, responsive containment, states, loading, motion, copy, and rendered QA. Use whenever visible interface work starts.

## When to use

- You want every UI change held to the same standard.
- Layouts break at small widths or with large text.
- Loading, empty and error states keep getting forgotten.

## Example

Ask: Check the new onboarding screens against the UI baseline.

Outcome: It checks spacing, contrast, focus, responsive containment and states, then fixes what fails.

## Install

```text
Install the Agent Skill "yeknal-ui-quality-baseline" for all my projects.

Source, pinned to a published revision (13 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-ui-quality-baseline
File list with SHA-256 hashes: https://tryraisins.dev/skills/ui-quality-baseline/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-ui-quality-baseline/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-ui-quality-baseline into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-ui-quality-baseline or ~/.claude/skills/yeknal-ui-quality-baseline, so it is available in every project.
3. If a yeknal-ui-quality-baseline folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 13 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/accessibility-design.md` (8412 bytes)
- `references/account-and-money.md` (5706 bytes)
- `references/color-systems.md` (5718 bytes)
- `references/component-patterns.md` (10543 bytes)
- `references/data-display.md` (6180 bytes)
- `references/effects-and-blends.md` (4035 bytes)
- `references/icons.md` (4443 bytes)
- `references/loading-and-timing.md` (2860 bytes)
- `references/mobile-web.md` (2620 bytes)
- `references/page-and-flow.md` (5088 bytes)
- `references/typeface-options.md` (3304 bytes)
- `references/typography.md` (5735 bytes)
- `SKILL.md` (27518 bytes)

## Related

- [Frontend design](https://tryraisins.dev/skills/frontend-design/): Sets a distinctive visual direction for new or heavily reshaped UI, from typography and composition to palette and interface copy.
- [Break UI](https://tryraisins.dev/skills/break-ui/): Stress-tests a screen with realistic worst-case data, such as long names, missing fields, huge counts and non-Latin text, and reports every break with its fix.

## Source

- [yeknal-ui-quality-baseline on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-ui-quality-baseline)
