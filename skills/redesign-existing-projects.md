# Redesign an existing product

> Refreshes the look or flow of a working site or app without breaking its behaviour or the data behind it.

Canonical: https://tryraisins.dev/skills/redesign-existing-projects/
Source revision: f9d54a7

Redesign an existing website or app without breaking behavior or data flow. Use for visual refreshes, UX improvements, responsive repair, or de-genericization.

## When to use

- A product works but looks dated or generic.
- Responsive layouts are broken and need repairing.
- You want UX improvements without rewriting the app.

## Example

Ask: Give the admin dashboard a visual refresh without changing how anything works.

Outcome: It inventories every route and state first, then restyles them while keeping each feature behaving the same.

## Install

```text
Install the Agent Skill "yeknal-redesign-existing-projects" for all my projects.

Source, pinned to a published revision (2 files):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-redesign-existing-projects
File list with SHA-256 hashes: https://tryraisins.dev/skills/redesign-existing-projects/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-redesign-existing-projects/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-redesign-existing-projects into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-redesign-existing-projects or ~/.claude/skills/yeknal-redesign-existing-projects, so it is available in every project.
3. If a yeknal-redesign-existing-projects folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 2 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `LICENSE.txt` (1065 bytes)
- `SKILL.md` (6495 bytes)

## Related

- [Frontend design](https://tryraisins.dev/skills/frontend-design/): Sets a distinctive visual direction for new or heavily reshaped UI, from typography and composition to palette and interface copy.
- [UI quality baseline](https://tryraisins.dev/skills/ui-quality-baseline/): Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI.

## Source

- [yeknal-redesign-existing-projects on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-redesign-existing-projects)
