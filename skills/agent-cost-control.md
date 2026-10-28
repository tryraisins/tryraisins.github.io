# Agent cost control

> Measures what agent work actually costs, finds the sessions and settings that own the spend, and changes one lever at a time without quietly losing review quality along the way.

Canonical: https://tryraisins.dev/skills/agent-cost-control/
Source revision: f9d54a7

Cut agent inference spend without losing quality. Use when an LLM bill or per-task cost is too high, sessions feel expensive, or you are choosing models, effort, or caching.

## When to use

- The inference bill rose, or one task cost far more than expected.
- You are choosing models or effort levels and want evidence rather than a hunch.
- Someone asks whether prompt caching, model routing, or a cheaper tier will actually help.

## When not to use

It does not decide who does the work and it does not review code. It will not present a saving without an outcome check that nothing important was dropped.

## Example

Ask: Why did last month cost more than the month before, with the same workload?

Outcome: It reads the harness usage log, shows that one long session carried most of the spend, checks whether caching is already warm, and recommends splitting the work at a boundary instead of switching models.

## Install

```text
Install the Agent Skill "yeknal-agent-cost-control" for all my projects.

Source, pinned to a published revision (2 files):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-agent-cost-control
File list with SHA-256 hashes: https://tryraisins.dev/skills/agent-cost-control/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-agent-cost-control/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-agent-cost-control into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-agent-cost-control or ~/.claude/skills/yeknal-agent-cost-control, so it is available in every project.
3. If a yeknal-agent-cost-control folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 2 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/measurement.md` (4627 bytes)
- `SKILL.md` (5493 bytes)

## Related

- [Orchestration specialists](https://tryraisins.dev/skills/orchestration-specialists/): Organises work across several agents and tools, covering task distribution, context management, evidence synthesis, prompt engineering and MCP design.
- [Code review](https://tryraisins.dev/skills/review/): Reads code or a whole system for real defects, regressions and maintainability risks, then sorts what it finds by severity and effort.
- [Testing strategy](https://tryraisins.dev/skills/testing-strategy/): Keeps verification end to end: proves behavior through the real entry point, bans new unit tests, and asks before any isolated check.

## Source

- [yeknal-agent-cost-control on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-agent-cost-control)
