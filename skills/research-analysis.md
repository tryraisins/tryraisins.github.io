# Research and analysis

> Researches and compares sources, checks them against each other and writes evidence-backed reports for market, competitive, trend or data questions.

Canonical: https://tryraisins.dev/skills/research-analysis/
Source revision: fc6b3b7

Research, compare, validate sources, and produce evidence-backed reports. Use for market, competitive, trend, data, or explicit deep research.

## When to use

- You need a report backed by sources rather than opinion.
- You are comparing competitors or tools.
- A question needs deep research across many sources.

## Example

Ask: Compare the main open-source feature-flag tools for a small team.

Outcome: It gathers current sources, compares the tools on the criteria that matter and cites where each claim came from.

## Install

```text
Install the Agent Skill "yeknal-research-analysis" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-research-analysis
File list with SHA-256 hashes: https://tryraisins.dev/skills/research-analysis/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-research-analysis/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-research-analysis into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-research-analysis or ~/.claude/skills/yeknal-research-analysis, so it is available in every project.
3. If a yeknal-research-analysis folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `LICENSE.deep-research.txt` (1069 bytes)
- `references/deep-research.md` (6869 bytes)
- `SKILL.md` (3019 bytes)

## Related

- [Design reference research](https://tryraisins.dev/skills/design-reference-research/): Researches comparable products and collects references into an evidence ledger and brief, so design decisions come from what works rather than what’s fashionable.

## Source

- [yeknal-research-analysis on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-research-analysis)
