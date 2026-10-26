# Changelog entries

> Adds or updates a Keep a Changelog entry based on the changes and history that can actually be verified, so release notes describe what shipped.

Canonical: https://tryraisins.dev/skills/add-changelog/
Source revision: 00061b8

Add or update a Keep a Changelog entry from verified changes and history when preparing release notes or recording shipped work.

## When to use

- You are preparing a release and need the notes written up.
- Work has shipped and the changelog has fallen behind.
- You want entries grouped the Keep a Changelog way under Added, Changed and Fixed.

## Example

Ask: Add a changelog entry for everything merged since the last tag.

Outcome: It reads the history since that tag, checks what each change actually did and writes a dated entry grouped by type.

## Install

```text
Install the Agent Skill "yeknal-add-changelog" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-add-changelog
File list with SHA-256 hashes: https://tryraisins.dev/skills/add-changelog/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-add-changelog/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-add-changelog into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-add-changelog or ~/.claude/skills/yeknal-add-changelog, so it is available in every project.
3. If a yeknal-add-changelog folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (1066 bytes)

## Related

- [Finalize](https://tryraisins.dev/skills/finalize/): Runs the final documentation and quality checks, summarises the diff and handles any Git publishing you asked for.
- [Git](https://tryraisins.dev/skills/git/): Handles status, diffs, branches, commits, merges and pushes while leaving unrelated work in your checkout alone.

## Source

- [yeknal-add-changelog on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-add-changelog)
