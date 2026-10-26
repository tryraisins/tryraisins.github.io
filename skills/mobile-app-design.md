# Mobile app design

> Designs and builds mobile screens and flows that feel native, especially in Expo or React Native, covering navigation, controls, states, accessibility and performance.

Canonical: https://tryraisins.dev/skills/mobile-app-design/
Source revision: fc6b3b7

Design and implement native-feeling mobile screens and flows, especially Expo or React Native. Use for navigation, controls, states, accessibility, and performance.

## When to use

- You are building screens for an Expo or React Native app.
- Navigation or controls don’t feel like they belong on the platform.
- Loading, empty and error states are missing on mobile.

## Example

Ask: Design and build the checkout flow for our Expo app.

Outcome: It plans the screens and navigation, builds them with native-feeling controls and covers each state.

## Install

```text
Install the Agent Skill "yeknal-mobile-app-design" for all my projects.

Source, pinned to a published revision (4 files):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-mobile-app-design
File list with SHA-256 hashes: https://tryraisins.dev/skills/mobile-app-design/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-mobile-app-design/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-mobile-app-design into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-mobile-app-design or ~/.claude/skills/yeknal-mobile-app-design, so it is available in every project.
3. If a yeknal-mobile-app-design folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 4 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (242 bytes)
- `LICENSE.txt` (1103 bytes)
- `references/appllama-research.md` (4100 bytes)
- `SKILL.md` (8016 bytes)

## Related

- [Animation in Expo](https://tryraisins.dev/skills/animate-expo/): Builds animation for React Native and Expo apps with Reanimated, Gesture Handler, Expo Router and haptics, making the decisions that decide whether motion feels right on a device.
- [UI quality baseline](https://tryraisins.dev/skills/ui-quality-baseline/): Applies a shared set of visual, responsive, accessibility, state, motion and copy checks whenever an agent creates or changes visible UI.

## Source

- [yeknal-mobile-app-design on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-mobile-app-design)
