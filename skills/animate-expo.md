# Animation in Expo

> Builds animation for React Native and Expo apps with Reanimated, Gesture Handler, Expo Router and haptics, making the decisions that decide whether motion feels right on a device.

Canonical: https://tryraisins.dev/skills/animate-expo/
Source revision: 00061b8

Build animations in React Native and Expo with Reanimated, Gesture Handler, Expo Router and expo-haptics, covering gestures, sheets, press feedback, haptics, and screen transitions. For web motion use `yeknal-animate`.

## When to use

- You are adding gestures, sheets, screen transitions or press feedback to an Expo app.
- Motion stutters on a real device and you need it on the right thread.
- You want haptics that match what the interface is doing.

## When not to use

For animation on the web, use Web animation.

## Example

Ask: Make the bottom sheet follow my finger and settle with a spring when I let go.

Outcome: It wires the drag with Gesture Handler, runs the motion on the UI thread with Reanimated and hands off velocity to a spring.

## Install

```text
Install the Agent Skill "yeknal-animate-expo" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-animate-expo
File list with SHA-256 hashes: https://tryraisins.dev/skills/animate-expo/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-animate-expo/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-animate-expo into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-animate-expo or ~/.claude/skills/yeknal-animate-expo, so it is available in every project.
3. If a yeknal-animate-expo folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `RECIPES.md` (16808 bytes)
- `references/setup.md` (1344 bytes)
- `SKILL.md` (16634 bytes)

## Related

- [Mobile app design](https://tryraisins.dev/skills/mobile-app-design/): Designs and builds mobile screens and flows that feel native, especially in Expo or React Native, covering navigation, controls, states, accessibility and performance.
- [Web animation](https://tryraisins.dev/skills/animate/): Adds purposeful, accessible motion to components, pages, scrolling, gestures, SVG and canvas, with sensible timing and a reduced-motion fallback.

## Source

- [yeknal-animate-expo on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-animate-expo)
