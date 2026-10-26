# Testing strategy

> Keeps verification end to end: proves behavior through the real entry point, bans new unit tests, and asks before any isolated check.

Canonical: https://tryraisins.dev/skills/testing-strategy/
Source revision: fc6b3b7

Use before writing or running tests to enforce end-to-end-only verification. Do not write unit tests; prove behavior through the real entry point, keep a repeatable artifact, and report what stayed unverified.

## When to use

- You are about to add tests for a feature.
- You want coverage of real user flows and error paths.
- An agent is about to write unit tests instead of an end-to-end flow.

## Example

Ask: Plan how we should test the new password-reset flow.

Outcome: It maps the flow's real end-to-end path and failure states, then proposes the browser or CLI run that proves them and leaves a rerunnable record.

## Install

```text
Install the Agent Skill "yeknal-testing-strategy" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-testing-strategy
File list with SHA-256 hashes: https://tryraisins.dev/skills/testing-strategy/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-testing-strategy/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-testing-strategy into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-testing-strategy or ~/.claude/skills/yeknal-testing-strategy, so it is available in every project.
3. If a yeknal-testing-strategy folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (3084 bytes)

## Related

- [Legacy sweep](https://tryraisins.dev/skills/legacy-sweep/): Audits a whole repository or subsystem for unused legacy code and bloated or worthless tests, proves each candidate is obsolete before deleting it, fixes real defects instead of removing the failing test, and keeps the coverage that still protects behaviour.
- [Browser automation](https://tryraisins.dev/skills/playwright/): Lets your agent open a real browser from the terminal to click through a flow, fill forms, take screenshots and read what’s on the page, so it can show you a change working.

## Source

- [yeknal-testing-strategy on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-testing-strategy)
