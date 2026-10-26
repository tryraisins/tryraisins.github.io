# Raise the bar on a brief

> Raises a task or prompt to expert standard before work starts, by finding the real bottleneck and naming the raw material, the method and the outside check that decides whether the result is right.

Canonical: https://tryraisins.dev/skills/ambition/
Source revision: fc6b3b7

Raise a task or brief to expert standard before work starts by naming the real bottleneck, the rawest material, the method and the outside check. Use for "be ambitious", "raise the bar", or "what would an expert do here".

## When to use

- You want a deeper version of a task rather than a bigger one.
- A brief is thin and you want to know what an expert in the field would ask for.
- A request names an artifact when the real goal is the outcome behind it.

## When not to use

It does not expand scope, add features, or replace execution. Most briefs need no pass at all, and a pass never changes acceptance criteria, access, ownership or cost without approval.

## Example

Ask: Be more ambitious about this slow checkout page.

Outcome: It names the bottleneck, asks for production traces and a measurement on an agreed device, and writes a replacement brief with an explicit pass and fail condition.

## Install

```text
Install the Agent Skill "yeknal-ambition" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-ambition
File list with SHA-256 hashes: https://tryraisins.dev/skills/ambition/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-ambition/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-ambition into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-ambition or ~/.claude/skills/yeknal-ambition, so it is available in every project.
3. If a yeknal-ambition folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `LICENSE.txt` (1306 bytes)
- `references/worked-examples.md` (4450 bytes)
- `SKILL.md` (5653 bytes)

## Related

- [Implement](https://tryraisins.dev/skills/implement/): Takes a scoped feature or fix from plan to working code while keeping the rest of the repository behaving as it did.
- [Research and analysis](https://tryraisins.dev/skills/research-analysis/): Researches and compares sources, checks them against each other and writes evidence-backed reports for market, competitive, trend or data questions.
- [Orchestration specialists](https://tryraisins.dev/skills/orchestration-specialists/): Organises work across several agents and tools, covering task distribution, context management, evidence synthesis, prompt engineering and MCP design.

## Source

- [yeknal-ambition on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-ambition)
