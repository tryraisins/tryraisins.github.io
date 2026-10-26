# Sentry errors

> Inspects Sentry issues and events, summarises recent production errors and pulls basic health data, using read-only queries.

Canonical: https://tryraisins.dev/skills/sentry/
Source revision: fc6b3b7

Inspect Sentry issues or events, summarize recent production errors, and pull basic Sentry health data through the read-only API. Use when the user names Sentry or asks what is failing in production.

## When to use

- You want a summary of recent production errors.
- A specific Sentry issue needs investigating.
- You want health numbers without opening the dashboard.

## Example

Ask: What are the top errors in production this week?

Outcome: It queries Sentry read-only and summarises the most frequent issues with links and affected users.

## Requirements

Uses Python and needs a SENTRY_AUTH_TOKEN.

## Install

```text
Install the Agent Skill "yeknal-sentry" for all my projects.

Source, pinned to a published revision (6 files):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-sentry
File list with SHA-256 hashes: https://tryraisins.dev/skills/sentry/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-sentry/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-sentry into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-sentry or ~/.claude/skills/yeknal-sentry, so it is available in every project.
3. If a yeknal-sentry folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 6 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (316 bytes)
- `assets/sentry-small.svg` (661 bytes)
- `assets/sentry.png` (1998 bytes)
- `LICENSE.txt` (10776 bytes)
- `scripts/sentry_api.py` (7289 bytes)
- `SKILL.md` (2382 bytes)

## Related

- [Troubleshoot](https://tryraisins.dev/skills/troubleshoot/): Works back from a reproducible error, failing build or slowdown to its cause before it suggests a fix.

## Source

- [yeknal-sentry on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-sentry)
