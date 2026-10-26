# Finalize

> Runs the final documentation and quality checks, summarises the diff and handles any Git publishing you asked for.

Canonical: https://tryraisins.dev/skills/finalize/
Source revision: fc6b3b7

Run final documentation and quality gates, summarize the diff, and perform requested Git publication. Use when preparing completed work for delivery.

## When to use

- The work is done and needs a last check before delivery.
- You want a clear summary of what changed.
- You are ready to commit and push but want the gates run first.

## Example

Ask: Finalize this branch: run the checks, update the docs and push it.

Outcome: It runs the repository’s checks, updates documentation that the change affects, summarises the diff and pushes.

## Install

```text
Install the Agent Skill "yeknal-finalize" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-finalize
File list with SHA-256 hashes: https://tryraisins.dev/skills/finalize/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-finalize/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-finalize into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-finalize or ~/.claude/skills/yeknal-finalize, so it is available in every project.
3. If a yeknal-finalize folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (1300 bytes)

## Related

- [Git](https://tryraisins.dev/skills/git/): Handles status, diffs, branches, commits, merges and pushes while leaving unrelated work in your checkout alone.
- [Changelog entries](https://tryraisins.dev/skills/add-changelog/): Adds or updates a Keep a Changelog entry based on the changes and history that can actually be verified, so release notes describe what shipped.

## Source

- [yeknal-finalize on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-finalize)
