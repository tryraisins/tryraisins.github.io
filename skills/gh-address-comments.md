# Address PR comments

> Works through the review and issue comments on the open GitHub pull request for your current branch, using the GitHub CLI.

Canonical: https://tryraisins.dev/skills/gh-address-comments/
Source revision: 95a39b5

Address review and issue comments on the open GitHub PR for the current branch using the `gh` CLI. Verifies `gh` auth first and asks the user to authenticate if needed.

## When to use

- A pull request has review comments waiting.
- You want each comment addressed or answered in turn.
- You use the gh CLI and want the agent to read the PR directly.

## Example

Ask: Address the review comments on my PR.

Outcome: It checks gh is signed in, reads each comment, makes the changes and summarises what it did for each one.

## Requirements

Needs the GitHub CLI signed in to your account.

## Install

```text
Install the Agent Skill "yeknal-gh-address-comments" for all my projects.

Source, pinned to a published revision (6 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-gh-address-comments
File list with SHA-256 hashes: https://tryraisins.dev/skills/gh-address-comments/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-gh-address-comments/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-gh-address-comments into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-gh-address-comments or ~/.claude/skills/yeknal-gh-address-comments, so it is available in every project.
3. If a yeknal-gh-address-comments folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 6 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (303 bytes)
- `assets/github-small.svg` (853 bytes)
- `assets/github.png` (1838 bytes)
- `LICENSE.txt` (11357 bytes)
- `scripts/fetch_comments.py` (6537 bytes)
- `SKILL.md` (1208 bytes)

## Related

- [Fix failing CI](https://tryraisins.dev/skills/gh-fix-ci/): Inspects failing GitHub Actions checks on a pull request, summarises the logs, drafts a fix plan and only makes changes once you approve.
- [Git](https://tryraisins.dev/skills/git/): Handles status, diffs, branches, commits, merges and pushes while leaving unrelated work in your checkout alone.

## Source

- [yeknal-gh-address-comments on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-gh-address-comments)
