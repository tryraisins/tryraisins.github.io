# Prototype variants

> Builds several genuinely different versions of a UI piece behind a visual picker, so you can flip between them live and keep the one that feels right.

Canonical: https://tryraisins.dev/skills/prototype/
Source revision: fc6b3b7

Build multiple genuinely different versions of a UI piece you describe, rendered behind a visual picker so you can flip through them live and promote the one that feels right. Only runs when explicitly invoked; it does not trigger on its own.

## When to use

- You can’t decide between layouts until you see them working.
- You want to compare real, interactive options rather than mockups.
- A component needs exploring before it’s finalised.

## When not to use

It only runs when you ask for it by name.

## Example

Ask: Prototype three different empty states for the inbox.

Outcome: It builds three distinct versions with a picker to switch between them, ready for you to promote one.

## Install

```text
Install the Agent Skill "yeknal-prototype" for all my projects.

Source, pinned to a published revision (2 files):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-prototype
File list with SHA-256 hashes: https://tryraisins.dev/skills/prototype/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-prototype/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-prototype into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-prototype or ~/.claude/skills/yeknal-prototype, so it is available in every project.
3. If a yeknal-prototype folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 2 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `PICKER.md` (7548 bytes)
- `SKILL.md` (8974 bytes)

## Related

- [Frontend design](https://tryraisins.dev/skills/frontend-design/): Sets a distinctive visual direction for new or heavily reshaped UI, from typography and composition to palette and interface copy.

## Source

- [yeknal-prototype on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-prototype)
