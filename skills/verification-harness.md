# Verification harness

> Generates a project-local skill that launches the real app, drives a feature the way a user would, and captures proof, with a feature map for the next agent to follow.

Canonical: https://tryraisins.dev/skills/verification-harness/
Source revision: 00061b8

Generate a project-local verification harness that starts a real app, drives a feature like a user, and captures proof. Use only when explicitly asked to build one for a repository with no scripted way to prove behavior.

## When to use

- A repository has no scripted way to prove its UI, CLI or service behavior.
- You are tired of re-deriving how to start the app and check a flow.
- You want screenshots, transcripts or response bodies kept as evidence.

## When not to use

It builds the harness; for what counts as proof, use Testing strategy.

## Example

Ask: This repo has no way to prove a flow end to end. Set one up.

Outcome: It inspects how the app starts and can be driven, writes a verify skill with launch, doctor, drive, evidence and cleanup, seeds a feature map and then proves it once.

## Install

```text
Install the Agent Skill "yeknal-verification-harness" for all my projects.

Source, pinned to a published revision (6 files):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-verification-harness
File list with SHA-256 hashes: https://tryraisins.dev/skills/verification-harness/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-verification-harness/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-verification-harness into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-verification-harness or ~/.claude/skills/yeknal-verification-harness, so it is available in every project.
3. If a yeknal-verification-harness folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 6 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `LICENSE.txt` (1142 bytes)
- `references/feature-map-example/create-note.md` (2926 bytes)
- `references/feature-map-example/README.md` (2601 bytes)
- `references/feature-map-example/search.md` (3478 bytes)
- `references/upkeep.md` (5130 bytes)
- `SKILL.md` (7917 bytes)

## Related

- [Testing strategy](https://tryraisins.dev/skills/testing-strategy/): Keeps verification end to end: proves behavior through the real entry point, bans new unit tests, and asks before any isolated check.
- [Browser automation](https://tryraisins.dev/skills/playwright/): Lets your agent open a real browser from the terminal to click through a flow, fill forms, take screenshots and read what’s on the page, so it can show you a change working.

## Source

- [yeknal-verification-harness on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-verification-harness)
