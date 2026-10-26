# Human-AI interface design

> Designs AI features people can trust, covering suggestions, generation, copilots and agents, along with sources, uncertainty, approvals and recovery.

Canonical: https://tryraisins.dev/skills/human-ai-interface-design/
Source revision: 00061b8

Design AI-mediated interfaces that earn appropriate reliance: capability, provenance, uncertainty, approval, failure, and recovery. Use when an AI feature proposes, generates, retrieves, or acts, and the user must verify, approve, or undo it.

## When to use

- You are adding an AI feature to a product.
- Users need to see where an answer came from or how sure it is.
- An agent can take actions that need approval or undo.

## Example

Ask: Design how our assistant proposes calendar changes before it makes them.

Outcome: It designs a review step with clear sources, editable proposals, approval and a way to undo.

## Install

```text
Install the Agent Skill "yeknal-human-ai-interface-design" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-human-ai-interface-design
File list with SHA-256 hashes: https://tryraisins.dev/skills/human-ai-interface-design/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-human-ai-interface-design/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-human-ai-interface-design into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-human-ai-interface-design or ~/.claude/skills/yeknal-human-ai-interface-design, so it is available in every project.
3. If a yeknal-human-ai-interface-design folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (314 bytes)
- `references/lifecycle-and-patterns.md` (4536 bytes)
- `SKILL.md` (6417 bytes)

## Related

- [UI and UX design](https://tryraisins.dev/skills/ui-ux-designer/): Designs user-centred interface systems that balance intuitive flows with a distinctive visual direction, from information architecture to interaction patterns.
- [UI quality baseline](https://tryraisins.dev/skills/ui-quality-baseline/): Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI.

## Source

- [yeknal-human-ai-interface-design on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-human-ai-interface-design)
