# Brand kit images

> Generates polished brand-guideline boards, logo systems and identity presentations as images, with deliberate composition and sparse typography.

Canonical: https://tryraisins.dev/skills/brandkit/
Source revision: 95a39b5

Generate premium brand-kit boards: logo systems, identity decks, and visual-world presentations in a restrained, art-directed style. Use when the user wants a brand kit as an image.

## When to use

- You want visual concepts for a new brand or product identity.
- You need a brand-guidelines board to share with a team.
- You are exploring logo directions before committing to one.

## Example

Ask: Create a brand board for a calm budgeting app: logo ideas, palette and type.

Outcome: It plans the identity, then generates a board with logo concepts, colours, type and a couple of mockups.

## Requirements

Needs an image-generation tool available to your agent.

## Install

```text
Install the Agent Skill "yeknal-brandkit" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-brandkit
File list with SHA-256 hashes: https://tryraisins.dev/skills/brandkit/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-brandkit/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-brandkit into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-brandkit or ~/.claude/skills/yeknal-brandkit, so it is available in every project.
3. If a yeknal-brandkit folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `LICENSE.txt` (1065 bytes)
- `references/brand-system-and-prompts.md` (11439 bytes)
- `SKILL.md` (4661 bytes)

## Related

- [Frontend design](https://tryraisins.dev/skills/frontend-design/): Sets a distinctive visual direction for new or heavily reshaped UI, from typography and composition to palette and interface copy.

## Source

- [yeknal-brandkit on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-brandkit)
