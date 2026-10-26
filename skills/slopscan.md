# Slop scan

> Scans a codebase locally for AI-slop indicators such as stock marketing copy, placeholder text, gradient headline text, decorative emoji, stock icon sets and kit default colors, and writes a report that explains each finding and how to fix it.

Canonical: https://tryraisins.dev/skills/slopscan/
Source revision: 00061b8

Scan a codebase locally for AI-slop signs such as stock marketing copy, placeholder text, gradient headline text, decorative emoji, and template leftovers, then act on the report. Use before a launch or when a project reads as generic.

## When to use

- You want to know whether a codebase carries the familiar signs of a shipped template.
- Copy or interface patterns need checking before a launch.
- You want findings with locations and fixes rather than a general opinion.

## When not to use

It reads source files only. It cannot see the rendered page, so checks that need a browser are reported as unassessed.

## Example

Ask: Scan this project for AI slop before we launch.

Outcome: It reports each indicator with its file and line, a plain explanation and a fix, lists what it could not assess, and writes both a readable log and a JSON report.

## Install

```text
Install the Agent Skill "yeknal-slopscan" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-slopscan
File list with SHA-256 hashes: https://tryraisins.dev/skills/slopscan/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-slopscan/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-slopscan into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-slopscan or ~/.claude/skills/yeknal-slopscan, so it is available in every project.
3. If a yeknal-slopscan folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (5209 bytes)

## Related

- [UI quality baseline](https://tryraisins.dev/skills/ui-quality-baseline/): Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI.
- [Code review](https://tryraisins.dev/skills/review/): Reads code or a whole system for real defects, regressions and maintainability risks, then sorts what it finds by severity and effort.

## Source

- [yeknal-slopscan on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-slopscan)
