# Project handoff

> Keeps a short HANDOFF.md at the root of the repository so the next session, or the next person, can pick up exactly where the work stopped.

Canonical: https://tryraisins.dev/skills/project-handoff/
Source revision: fc6b3b7

Create, update, or resume work from a concise repository-root HANDOFF.md so another agent can continue without the current conversation. Use for substantial ongoing projects, milestones, and task handoffs.

## When to use

- A project spans several sessions or people.
- You are finishing a milestone and want the context saved.
- You are picking up an unfamiliar repository.

## Example

Ask: Update the handoff with where we got to today.

Outcome: It records the current state, decisions, how to verify the work and what remains, without repeating what the code already shows.

## Install

```text
Install the Agent Skill "yeknal-project-handoff" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-project-handoff
File list with SHA-256 hashes: https://tryraisins.dev/skills/project-handoff/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-project-handoff/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-project-handoff into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-project-handoff or ~/.claude/skills/yeknal-project-handoff, so it is available in every project.
3. If a yeknal-project-handoff folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (1325 bytes)

## Related

- [Markdown management](https://tryraisins.dev/skills/markdown-management/): Creates, merges, updates and audits Markdown without losing meaning, links or repository conventions, including README files and Agent Skills.
- [Finalize](https://tryraisins.dev/skills/finalize/): Runs the final documentation and quality checks, summarises the diff and handles any Git publishing you asked for.

## Source

- [yeknal-project-handoff on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-project-handoff)
