# Break UI

> Stress-tests a screen with realistic worst-case data, such as long names, missing fields, huge counts and non-Latin text, and reports every break with its fix.

Canonical: https://tryraisins.dev/skills/break-ui/
Source revision: 95a39b5

Stress-test a component or screen with realistic worst-case data, put the demo and worst-case states behind a dev-only toggle, and report every break with its fix. Use to break, stress-test, or find UI edge cases.

## When to use

- A screen looks fine with demo data and you want to know where it fails.
- You are about to ship a list, table or card that shows user-supplied text.
- You want a dev-only toggle between demo and worst-case states.

## Example

Ask: Try the worst case on the team members table.

Outcome: It fills the table with extreme but realistic data, shows the broken states and fixes overflow, wrapping and empty values.

## Install

```text
Install the Agent Skill "yeknal-break-ui" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-break-ui
File list with SHA-256 hashes: https://tryraisins.dev/skills/break-ui/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-break-ui/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-break-ui into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-break-ui or ~/.claude/skills/yeknal-break-ui, so it is available in every project.
3. If a yeknal-break-ui folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `CATALOG.md` (7391 bytes)
- `LICENSE.txt` (1070 bytes)
- `SKILL.md` (8189 bytes)

## Related

- [UI quality baseline](https://tryraisins.dev/skills/ui-quality-baseline/): Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI.
- [Browser automation](https://tryraisins.dev/skills/playwright/): Lets your agent open a real browser from the terminal to click through a flow, fill forms, take screenshots and read what’s on the page, so it can show you a change working.

## Source

- [yeknal-break-ui on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-break-ui)
