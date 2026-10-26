# Frame-based motion

> Designs and builds scrubbable web animation made from generated or captured frames and driven by scroll, pointer, touch or data, for moments ordinary CSS can’t express.

Canonical: https://tryraisins.dev/skills/oil-motion/
Source revision: fc6b3b7

Build continuous interactive web animation from generated or captured frames, driven by scroll, pointer, drag, touch, orientation, audio, data, or state. Use when CSS or component motion cannot express a transformation or a scrub-able timeline.

## When to use

- A product transformation or scene change can’t be done with CSS alone.
- You want an animation that follows the scroll or the pointer frame by frame.
- Media needs processing into an efficient, scrubbable sequence.

## When not to use

For ordinary UI transitions, use Web animation.

## Example

Ask: Make the product photo rotate as the visitor scrolls through the feature section.

Outcome: It plans the frames, processes them into an efficient sequence and wires playback to the scroll position.

## Requirements

Frame processing may need Python 3, Pillow and ffmpeg.

## Install

```text
Install the Agent Skill "yeknal-oil-motion" for all my projects.

Source, pinned to a published revision (2 files):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-oil-motion
File list with SHA-256 hashes: https://tryraisins.dev/skills/oil-motion/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-oil-motion/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-oil-motion into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-oil-motion or ~/.claude/skills/yeknal-oil-motion, so it is available in every project.
3. If a yeknal-oil-motion folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 2 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `LICENSE.txt` (1069 bytes)
- `SKILL.md` (8422 bytes)

## Related

- [Web animation](https://tryraisins.dev/skills/animate/): Adds purposeful, accessible motion to components, pages, scrolling, gestures, SVG and canvas, with sensible timing and a reduced-motion fallback.

## Source

- [yeknal-oil-motion on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-oil-motion)
