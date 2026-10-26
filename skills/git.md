# Git

> Handles status, diffs, branches, commits, merges and pushes while leaving unrelated work in your checkout alone.

Canonical: https://tryraisins.dev/skills/git/
Source revision: fc6b3b7

Run the specific Git operation the user asked for while preserving unrelated work: status, diff, branch, commit, merge, history, or push. Not the full delivery flow, which is `yeknal-finalize`.

## When to use

- You want a focused commit without sweeping in other changes.
- You need help with a branch, merge or history question.
- Your working tree has unrelated edits that must survive.

## Example

Ask: Commit only the API changes and push them to a new branch.

Outcome: It stages just those files, writes a clear commit message, creates the branch and pushes it.

## Install

```text
Install the Agent Skill "yeknal-git" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-git
File list with SHA-256 hashes: https://tryraisins.dev/skills/git/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-git/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-git into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-git or ~/.claude/skills/yeknal-git, so it is available in every project.
3. If a yeknal-git folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (998 bytes)

## Related

- [Finalize](https://tryraisins.dev/skills/finalize/): Runs the final documentation and quality checks, summarises the diff and handles any Git publishing you asked for.
- [Commit, push and open a PR](https://tryraisins.dev/skills/yeet/): Stages, commits, pushes and opens a GitHub pull request in one flow using the GitHub CLI.

## Source

- [yeknal-git on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-git)
