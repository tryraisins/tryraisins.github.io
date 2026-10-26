# Design reference research

> Researches comparable products and collects references into an evidence ledger and brief, so design decisions come from what works rather than what’s fashionable.

Canonical: https://tryraisins.dev/skills/design-reference-research/
Source revision: 95a39b5

Research interface references into an evidence ledger and implementation brief. Use before design or redesign when references or benchmark evidence should drive direction.

## When to use

- You are about to design or redesign something and want evidence first.
- The team disagrees about direction and needs references to compare.
- You want patterns from real products, not gallery trends.

## Example

Ask: Research how five scheduling apps handle rescheduling before we redesign ours.

Outcome: It studies each flow, records what it saw and what it couldn’t verify, and writes a short brief with recommendations.

## Install

```text
Install the Agent Skill "yeknal-design-reference-research" for all my projects.

Source, pinned to a published revision (5 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-design-reference-research
File list with SHA-256 hashes: https://tryraisins.dev/skills/design-reference-research/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-design-reference-research/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-design-reference-research into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-design-reference-research or ~/.claude/skills/yeknal-design-reference-research, so it is available in every project.
3. If a yeknal-design-reference-research folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 5 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (283 bytes)
- `references/pattern-atlas.md` (5093 bytes)
- `references/responsive-matrix.md` (3728 bytes)
- `references/source-atlas.md` (9383 bytes)
- `SKILL.md` (5912 bytes)

## Related

- [Frontend design](https://tryraisins.dev/skills/frontend-design/): Sets a distinctive visual direction for new or heavily reshaped UI, from typography and composition to palette and interface copy.
- [UI and UX design](https://tryraisins.dev/skills/ui-ux-designer/): Designs user-centred interface systems that balance intuitive flows with a distinctive visual direction, from information architecture to interaction patterns.

## Source

- [yeknal-design-reference-research on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-design-reference-research)
