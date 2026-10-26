# Implement

> Takes a scoped feature or fix from plan to working code while keeping the rest of the repository behaving as it did.

Canonical: https://tryraisins.dev/skills/implement/
Source revision: fc6b3b7

Implement a scoped feature or fix end to end while preserving repository behavior. Use when the user asks to build, change, add, or repair code; not for the closing gates, review, or publication, which is `yeknal-finalize`.

## When to use

- You want a feature built or a bug fixed from start to finish.
- The change has to fit existing conventions and not break other behaviour.
- You want the work verified rather than just written.

## Example

Ask: Add CSV export to the reports page.

Outcome: It reads how the page works today, adds the export following existing patterns and runs the flow to confirm it works.

## Install

```text
Install the Agent Skill "yeknal-implement" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-implement
File list with SHA-256 hashes: https://tryraisins.dev/skills/implement/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-implement/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-implement into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-implement or ~/.claude/skills/yeknal-implement, so it is available in every project.
3. If a yeknal-implement folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (3102 bytes)

## Related

- [Code review](https://tryraisins.dev/skills/review/): Reads code or a whole system for real defects, regressions and maintainability risks, then sorts what it finds by severity and effort.
- [Testing strategy](https://tryraisins.dev/skills/testing-strategy/): Keeps verification end to end: proves behavior through the real entry point, bans new unit tests, and asks before any isolated check.

## Source

- [yeknal-implement on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-implement)
