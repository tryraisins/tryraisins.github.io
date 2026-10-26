# Orchestration specialists

> Organises work across several agents and tools, covering task distribution, context management, evidence synthesis, prompt engineering and MCP design.

Canonical: https://tryraisins.dev/skills/orchestration-specialists/
Source revision: 95a39b5

Organize bounded multi-agent and tool work. Use for task distribution, context management, evidence synthesis, and handoff across agents.

## When to use

- A job is big enough to split between agents.
- Context is getting lost between steps.
- You are designing prompts or an MCP server.

## Example

Ask: Split this migration across agents so each one handles a service and reports back.

Outcome: It divides the work into bounded tasks, defines what each agent returns and merges the results with evidence.

## Install

```text
Install the Agent Skill "yeknal-orchestration-specialists" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-orchestration-specialists
File list with SHA-256 hashes: https://tryraisins.dev/skills/orchestration-specialists/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-orchestration-specialists/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-orchestration-specialists into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-orchestration-specialists or ~/.claude/skills/yeknal-orchestration-specialists, so it is available in every project.
3. If a yeknal-orchestration-specialists folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (1483 bytes)

## Source

- [yeknal-orchestration-specialists on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-orchestration-specialists)
