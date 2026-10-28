# Code graph

> Builds a local, model-free index of a repository and answers with a small ranked slice, so an unfamiliar codebase can be entered in one call instead of many searches.

Canonical: https://tryraisins.dev/skills/code-graph/
Source revision: f9d54a7

Use when a task starts in an unfamiliar or large repository and you need the right files in one call instead of many searches. Builds a zero-dependency local index of content terms plus imports, routes and tests, then answers with a small ranked slice inside a token budget. It is retrieval, not GraphRAG, and it never replaces grep for exhaustive matches.

## When to use

- You are starting work in a large repository and do not know where a behavior lives.
- The question is conceptual and searching for it would need several vocabulary guesses.
- You need call sites, importers, or the tests that touch a route.

## When not to use

It is not exhaustive and it is not GraphRAG. For every mention of a known identifier, use grep; for a small repository, grep is already one call.

## Example

Ask: In this 300-file app, where does an uploaded CV get turned into text before review?

Outcome: It builds a local index, returns the parser function and its call sites with line numbers in one call, states that recall is partial, and reads the surrounding code before changing anything.

## Install

```text
Install the Agent Skill "yeknal-code-graph" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-code-graph
File list with SHA-256 hashes: https://tryraisins.dev/skills/code-graph/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-code-graph/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-code-graph into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-code-graph or ~/.claude/skills/yeknal-code-graph, so it is available in every project.
3. If a yeknal-code-graph folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/measurements.md` (2847 bytes)
- `scripts/codegraph.py` (22237 bytes)
- `SKILL.md` (4938 bytes)

## Related

- [Agent cost control](https://tryraisins.dev/skills/agent-cost-control/): Measures what agent work actually costs, finds the sessions and settings that own the spend, and changes one lever at a time without quietly losing review quality along the way.
- [Troubleshoot](https://tryraisins.dev/skills/troubleshoot/): Works back from a reproducible error, failing build or slowdown to its cause before it suggests a fix.
- [Orchestration specialists](https://tryraisins.dev/skills/orchestration-specialists/): Organises work across several agents and tools, covering task distribution, context management, evidence synthesis, prompt engineering and MCP design.

## Source

- [yeknal-code-graph on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-code-graph)
