# Fix failing CI

> Inspects failing GitHub Actions checks on a pull request, summarises the logs, drafts a fix plan and only makes changes once you approve.

Canonical: https://tryraisins.dev/skills/gh-fix-ci/
Source revision: f9d54a7

Debug failing GitHub PR checks that run in GitHub Actions: inspect checks and logs with `gh`, summarize the failure, propose a fix, and implement after approval. Use when a PR check fails; external providers are out of scope.

## When to use

- Checks are failing on a pull request.
- You want the failure explained before anything changes.
- CI runs on GitHub Actions.

## When not to use

Checks from other providers, such as Buildkite, are reported by link only.

## Example

Ask: The tests job is failing on my PR. Find out why.

Outcome: It pulls the failing job’s logs, explains the cause, proposes a fix and waits for your go-ahead.

## Requirements

Needs the GitHub CLI signed in to your account.

## Install

```text
Install the Agent Skill "yeknal-gh-fix-ci" for all my projects.

Source, pinned to a published revision (6 files):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-gh-fix-ci
File list with SHA-256 hashes: https://tryraisins.dev/skills/gh-fix-ci/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-gh-fix-ci/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-gh-fix-ci into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-gh-fix-ci or ~/.claude/skills/yeknal-gh-fix-ci, so it is available in every project.
3. If a yeknal-gh-fix-ci folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 6 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (302 bytes)
- `assets/github-small.svg` (853 bytes)
- `assets/github.png` (1838 bytes)
- `LICENSE.txt` (10776 bytes)
- `scripts/inspect_pr_checks.py` (15222 bytes)
- `SKILL.md` (2993 bytes)

## Related

- [Address PR comments](https://tryraisins.dev/skills/gh-address-comments/): Works through the review and issue comments on the open GitHub pull request for your current branch, using the GitHub CLI.
- [Troubleshoot](https://tryraisins.dev/skills/troubleshoot/): Works back from a reproducible error, failing build or slowdown to its cause before it suggests a fix.

## Source

- [yeknal-gh-fix-ci on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-gh-fix-ci)
