# Commit, push and open a PR

> Stages, commits, pushes and opens a GitHub pull request in one flow using the GitHub CLI.

Canonical: https://tryraisins.dev/skills/yeet/
Source revision: 00061b8

Use only when the user explicitly asks to stage, commit, push, and open a GitHub pull request in one flow using the GitHub CLI (`gh`).

## When to use

- You want the whole commit-to-PR flow done in one go.
- Your changes are ready and reviewed locally.
- You use the gh CLI.

## When not to use

It only runs when you explicitly ask for the full flow.

## Example

Ask: Yeet this: commit, push and open a PR.

Outcome: It stages the changes, writes the commit, pushes the branch and opens a pull request with a summary.

## Requirements

Needs the GitHub CLI signed in to your account.

## Install

```text
Install the Agent Skill "yeknal-yeet" for all my projects.

Source, pinned to a published revision (5 files):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-yeet
File list with SHA-256 hashes: https://tryraisins.dev/skills/yeet/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-yeet/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-yeet into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-yeet or ~/.claude/skills/yeknal-yeet, so it is available in every project.
3. If a yeknal-yeet folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 5 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (273 bytes)
- `assets/yeet-small.svg` (967 bytes)
- `assets/yeet.png` (1262 bytes)
- `LICENSE.txt` (10776 bytes)
- `SKILL.md` (2663 bytes)

## Related

- [Git](https://tryraisins.dev/skills/git/): Handles status, diffs, branches, commits, merges and pushes while leaving unrelated work in your checkout alone.
- [Address PR comments](https://tryraisins.dev/skills/gh-address-comments/): Works through the review and issue comments on the open GitHub pull request for your current branch, using the GitHub CLI.

## Source

- [yeknal-yeet on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-yeet)
