# Domain modeling

> Clarifies a project’s domain terms and boundaries and records the decisions in a glossary or architecture decision record.

Canonical: https://tryraisins.dev/skills/domain-modeling/
Source revision: f9d54a7

Clarify a project's domain concepts and record resolved terminology in a glossary or durable decisions in an ADR. Use when terms, relationships, or system boundaries are ambiguous.

## When to use

- People use different words for the same thing, or one word for two things.
- System boundaries are unclear before a larger change.
- You want a GLOSSARY.md or an ADR written down.

## Example

Ask: We keep mixing up accounts, workspaces and organisations. Sort out the terms.

Outcome: It maps how each term is used in code and conversation, proposes definitions and records them in a glossary.

## Install

```text
Install the Agent Skill "yeknal-domain-modeling" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-domain-modeling
File list with SHA-256 hashes: https://tryraisins.dev/skills/domain-modeling/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-domain-modeling/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-domain-modeling into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-domain-modeling or ~/.claude/skills/yeknal-domain-modeling, so it is available in every project.
3. If a yeknal-domain-modeling folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (3649 bytes)

## Related

- [Project handoff](https://tryraisins.dev/skills/project-handoff/): Keeps a short HANDOFF.md at the root of the repository so the next session, or the next person, can pick up exactly where the work stopped.

## Source

- [yeknal-domain-modeling on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-domain-modeling)
