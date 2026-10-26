# Security ownership map

> Maps who owns sensitive code from Git history and highlights bus-factor risk and code nobody looks after.

Canonical: https://tryraisins.dev/skills/security-ownership-map/
Source revision: 95a39b5

Map sensitive-code ownership and bus-factor risk from Git history with Python 3 and networkx. Use only for explicit security ownership, orphaned-code, or CODEOWNERS risk analysis.

## When to use

- You want to know who maintains authentication or payment code.
- Sensitive areas may depend on one person.
- You are writing or checking a CODEOWNERS file.

## When not to use

It only runs when you ask about security ownership.

## Example

Ask: Who owns our auth and billing code, and where are we exposed?

Outcome: It analyses commit history for sensitive paths and reports owners, gaps and single points of failure.

## Install

```text
Install the Agent Skill "yeknal-security-ownership-map" for all my projects.

Source, pinned to a published revision (8 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-security-ownership-map
File list with SHA-256 hashes: https://tryraisins.dev/skills/security-ownership-map/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-security-ownership-map/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-security-ownership-map into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-security-ownership-map or ~/.claude/skills/yeknal-security-ownership-map, so it is available in every project.
3. If a yeknal-security-ownership-map folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 8 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (253 bytes)
- `LICENSE.txt` (10776 bytes)
- `references/neo4j-import.md` (2428 bytes)
- `scripts/build_ownership_map.py` (34330 bytes)
- `scripts/community_maintainers.py` (18122 bytes)
- `scripts/query_ownership.py` (17991 bytes)
- `scripts/run_ownership_map.py` (5890 bytes)
- `SKILL.md` (5344 bytes)

## Related

- [Threat model](https://tryraisins.dev/skills/security-threat-model/): Builds a threat model grounded in the actual repository, covering assets, trust boundaries, abuse paths and mitigations.

## Source

- [yeknal-security-ownership-map on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-security-ownership-map)
