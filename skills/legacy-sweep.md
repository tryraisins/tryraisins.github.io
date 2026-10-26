# Legacy sweep

> Audits a whole repository or subsystem for unused legacy code and bloated or worthless tests, proves each candidate is obsolete before deleting it, fixes real defects instead of removing the failing test, and keeps the coverage that still protects behaviour.

Canonical: https://tryraisins.dev/skills/legacy-sweep/
Source revision: 00061b8

Prove legacy code and tests are obsolete before deleting them, repair real defects instead of removing the test that caught them, and keep the coverage that protects behaviour. Use for a dead-code sweep, "remove unused imports", or a test-suite prune.

## When to use

- A codebase has accumulated dead paths, unused exports and stale tests.
- A test suite is slow or noisy and you want to prune it without losing the checks that matter.
- A cleanup should fix the failures it uncovers instead of deleting them.
- You want a cleanup that reports what it could not prove.

## When not to use

It is not a lint pass and not a licence to delete code. Every removal needs a filled evidence row, a failing test is treated as a defect before it is treated as bloat, and it never authors unit tests.

## Example

Ask: Sweep the repo: remove the dead code and the bloated tests, but fix real bugs instead of hiding them.

Outcome: It records a baseline, splits production ownership into read-only and write lanes, removes only candidates with completed proof, fixes the failures that are real defects, and reports what it removed, the contracts it preserved and every blocked candidate.

## Install

```text
Install the Agent Skill "yeknal-legacy-sweep" for all my projects.

Source, pinned to a published revision (4 files):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-legacy-sweep
File list with SHA-256 hashes: https://tryraisins.dev/skills/legacy-sweep/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-legacy-sweep/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-legacy-sweep into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-legacy-sweep or ~/.claude/skills/yeknal-legacy-sweep, so it is available in every project.
3. If a yeknal-legacy-sweep folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 4 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/campaign-execution.md` (5231 bytes)
- `references/evidence-standard.md` (6698 bytes)
- `references/report-template.md` (2631 bytes)
- `SKILL.md` (11354 bytes)

## Related

- [Testing strategy](https://tryraisins.dev/skills/testing-strategy/): Keeps verification end to end: proves behavior through the real entry point, bans new unit tests, and asks before any isolated check.

## Source

- [yeknal-legacy-sweep on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-legacy-sweep)
