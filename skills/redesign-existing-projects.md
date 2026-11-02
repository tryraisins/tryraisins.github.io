# Redesign an existing product

> Refreshes the look or flow of a working site or app without breaking its behaviour or the data behind it, after deciding whether the screen needs a redesign or a targeted repair.

Canonical: https://tryraisins.dev/skills/redesign-existing-projects/
Source revision: ae2fa4e

Redesign an existing website or app without breaking behavior or data flow, deciding first whether a screen needs a redesign or a small repair. Use for visual refreshes, UX improvements, responsive repair, or de-genericization.

## When to use

- A product works but looks dated or generic.
- Responsive layouts are broken and need repairing.
- You are not sure whether a screen needs a redesign or a small repair.
- You want UX improvements without rewriting the app.

## Example

Ask: Give the admin dashboard a visual refresh without changing how anything works.

Outcome: It inventories every route and state, decides how much change the screen justifies, then restyles within that limit while keeping each feature behaving the same.

## Install

```text
Install the Agent Skill "yeknal-redesign-existing-projects" for all my projects.

Source, pinned to a published revision (2 files):
https://github.com/tryraisins/MD_Files/tree/ae2fa4e4ee981ac184880fad8de8b8474748a198/skills/yeknal-redesign-existing-projects
File list with SHA-256 hashes: https://tryraisins.dev/skills/redesign-existing-projects/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-redesign-existing-projects/
   git -C yeknal-skill-src checkout ae2fa4e4ee981ac184880fad8de8b8474748a198
2. Copy skills/yeknal-redesign-existing-projects into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-redesign-existing-projects or ~/.claude/skills/yeknal-redesign-existing-projects, so it is available in every project.
3. If a yeknal-redesign-existing-projects folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 2 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `LICENSE.txt` (1065 bytes)
- `SKILL.md` (10580 bytes)

## Related

- [Frontend design](https://tryraisins.dev/skills/frontend-design/): Sets a distinctive visual direction for new or heavily reshaped UI, from typography and composition to palette, interface copy, and where the visual richness goes.
- [UI quality baseline](https://tryraisins.dev/skills/ui-quality-baseline/): Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI, including where the visual richness belongs.
- [Slop scan](https://tryraisins.dev/skills/slopscan/): Scans a codebase locally for AI-slop indicators such as stock marketing copy, placeholder text, gradient headline text, decorative emoji, stock icon sets and kit default colors, and writes a report that explains each finding, the class it falls into, and how to fix it.

## Source

- [yeknal-redesign-existing-projects on GitHub](https://github.com/tryraisins/MD_Files/tree/ae2fa4e4ee981ac184880fad8de8b8474748a198/skills/yeknal-redesign-existing-projects)
