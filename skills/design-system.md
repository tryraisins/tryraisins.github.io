# Design system

> Builds, audits, documents or migrates a product's design system: token layers, mapping hardcoded values onto tokens, component specs, drift detection and an ordered adoption plan.

Canonical: https://tryraisins.dev/skills/design-system/
Source revision: f9d54a7

Build, audit, document, or migrate a product's design system: token layers, mapping hardcoded values onto tokens, component specs, drift detection, and adoption plans. Use when the request names a design system, tokens, component documentation, or inconsistency across an app.

## When to use

- The app has a look but no rules, or the rules live in three places.
- You need to know which hardcoded colors, spacing and radii should become tokens.
- A component needs a written spec covering anatomy, tokens and states.
- The app has drifted off its system and you want an order of work.
- You are starting a design system from nothing on a shipped product.

## Example

Ask: Our buttons and cards use slightly different grays and radii. Map them onto tokens and tell me where to start.

Outcome: It inventories the near-duplicate values, clusters them, proposes role-based tokens with confidence per cluster, and returns an ordered plan with a ratchet so the drift does not return.

## Install

```text
Install the Agent Skill "yeknal-design-system" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-design-system
File list with SHA-256 hashes: https://tryraisins.dev/skills/design-system/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-design-system/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-design-system into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-design-system or ~/.claude/skills/yeknal-design-system, so it is available in every project.
3. If a yeknal-design-system folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (8039 bytes)

## Related

- [UI quality baseline](https://tryraisins.dev/skills/ui-quality-baseline/): Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI.
- [Frontend developer](https://tryraisins.dev/skills/frontend-developer/): Implements or repairs accessible web interfaces in React, Vue or Angular, covering components, state, styling and browser behaviour.

## Source

- [yeknal-design-system on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-design-system)
