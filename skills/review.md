# Code review

> Reads code or a whole system for real defects, regressions and maintainability risks, then sorts what it finds by severity and effort.

Canonical: https://tryraisins.dev/skills/review/
Source revision: f9d54a7

Review code or systems for concrete defects, regressions, and maintainability risks when the user requests an audit or quality assessment.

## When to use

- You want a second opinion before merging.
- A system needs a quality assessment.
- You want findings you can act on, not style nitpicks.

## Example

Ask: Review the payments module for bugs and risky code.

Outcome: It reports concrete defects with locations and reasons, ranked by severity, and suggests fixes.

## Install

```text
Install the Agent Skill "yeknal-review" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-review
File list with SHA-256 hashes: https://tryraisins.dev/skills/review/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-review/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-review into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-review or ~/.claude/skills/yeknal-review, so it is available in every project.
3. If a yeknal-review folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (4001 bytes)

## Related

- [Testing strategy](https://tryraisins.dev/skills/testing-strategy/): Keeps verification end to end: proves behavior through the real entry point, bans new unit tests, and asks before any isolated check.
- [Security best practices](https://tryraisins.dev/skills/security-best-practices/): Reviews Python, JavaScript, TypeScript or Go code for security issues and writes secure-by-default code when you ask for it.

## Source

- [yeknal-review on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-review)
