# Frontend design

> Sets a distinctive visual direction for new or heavily reshaped UI, from typography and composition to palette and interface copy.

Canonical: https://tryraisins.dev/skills/frontend-design/
Source revision: fc6b3b7

Create distinctive visual direction for new or substantially reshaped UI. Use for typography, composition, palette, interface copy, and anti-generic frontend design.

## When to use

- You are designing a new screen or product surface.
- A design looks generic and needs a clear point of view.
- Typography, colour and layout need to work as one system.

## Example

Ask: Design the pricing page so it doesn’t look like every other SaaS template.

Outcome: It sets a visual direction from the product’s content, picks type and colour roles and builds the page with real copy.

## Install

```text
Install the Agent Skill "yeknal-frontend-design" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-frontend-design
File list with SHA-256 hashes: https://tryraisins.dev/skills/frontend-design/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-frontend-design/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-frontend-design into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-frontend-design or ~/.claude/skills/yeknal-frontend-design, so it is available in every project.
3. If a yeknal-frontend-design folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (326 bytes)
- `LICENSE.txt` (10775 bytes)
- `SKILL.md` (7280 bytes)

## Related

- [UI quality baseline](https://tryraisins.dev/skills/ui-quality-baseline/): Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI.
- [Design reference research](https://tryraisins.dev/skills/design-reference-research/): Researches comparable products and collects references into an evidence ledger and brief, so design decisions come from what works rather than what’s fashionable.
- [Redesign an existing product](https://tryraisins.dev/skills/redesign-existing-projects/): Refreshes the look or flow of a working site or app without breaking its behaviour or the data behind it.

## Source

- [yeknal-frontend-design on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-frontend-design)
