# Frontend developer

> Implements or repairs accessible web interfaces in React, Vue or Angular, covering components, state, styling and browser behaviour.

Canonical: https://tryraisins.dev/skills/frontend-developer/
Source revision: f9d54a7

Implement or repair web interfaces in React, Vue, or Angular: component architecture, the existing styling system, navigation, and theme persistence. Use for engineering changes, not visual direction.

## When to use

- You are changing frontend components or their state.
- A browser behaviour or styling bug needs fixing.
- You want accessible, working UI rather than a visual concept.

## Example

Ask: Fix the date picker so it works with the keyboard and screen readers.

Outcome: It repairs focus handling and labels, tests the keyboard path and keeps the existing look.

## Install

```text
Install the Agent Skill "yeknal-frontend-developer" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-frontend-developer
File list with SHA-256 hashes: https://tryraisins.dev/skills/frontend-developer/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-frontend-developer/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-frontend-developer into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-frontend-developer or ~/.claude/skills/yeknal-frontend-developer, so it is available in every project.
3. If a yeknal-frontend-developer folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (4005 bytes)

## Related

- [Implement](https://tryraisins.dev/skills/implement/): Takes a scoped feature or fix from plan to working code while keeping the rest of the repository behaving as it did.
- [UI quality baseline](https://tryraisins.dev/skills/ui-quality-baseline/): Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI.

## Source

- [yeknal-frontend-developer on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-frontend-developer)
