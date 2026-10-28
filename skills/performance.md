# App performance

> Measures startup, screen navigation, content loading and scrolling on a throttled production build, finds the real bottleneck, then proves each fix with before and after benchmarks rather than intuition.

Canonical: https://tryraisins.dev/skills/performance/
Source revision: f9d54a7

Make an app faster by measuring startup, navigation, content load, and scroll, fixing the real bottleneck, and proving each win with before and after numbers. Use when an app feels slow to start, to change screens, to fill in, or to scroll.

## When to use

- The app feels slow to start or slow to open a screen.
- Content takes too long to appear, especially older or deeper pages.
- Scrolling stutters or degrades during a long session.
- Every optimization needs a measured before and after.

## When not to use

It is not failure diagnosis or a motion audit. Use Troubleshoot for a broken feature and Improve animations for motion craft.

## Example

Ask: Make this app faster, benchmark every fix, and tell me what actually worked.

Outcome: It records a cold production baseline on a throttled device, traces the largest cost, changes one thing at a time, re-measures, and keeps only the wins that clear the noise floor.

## Install

```text
Install the Agent Skill "yeknal-performance" for all my projects.

Source, pinned to a published revision (8 files):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-performance
File list with SHA-256 hashes: https://tryraisins.dev/skills/performance/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-performance/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-performance into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-performance or ~/.claude/skills/yeknal-performance, so it is available in every project.
3. If a yeknal-performance folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 8 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/fix-catalog.md` (6762 bytes)
- `references/measuring.md` (5991 bytes)
- `references/report-template.md` (2776 bytes)
- `references/screens-and-content.md` (5492 bytes)
- `references/scrolling.md` (4354 bytes)
- `references/startup.md` (4797 bytes)
- `scripts/bench-web.mjs` (16825 bytes)
- `SKILL.md` (7495 bytes)

## Related

- [Troubleshoot](https://tryraisins.dev/skills/troubleshoot/): Works back from a reproducible error, failing build or slowdown to its cause before it suggests a fix.
- [Improve animations](https://tryraisins.dev/skills/improve-animations/): Surveys an app’s existing motion like a senior motion designer would, then writes a prioritised audit with self-contained plans that other agents can carry out.
- [Launch readiness](https://tryraisins.dev/skills/launch-readiness/): Audits a product before it becomes publicly reachable, covering the legal obligations that attach to the data, payments, email and user content it handles, plus the engineering gates no other workflow owns, then returns one register and a go or no-go.
- [Browser automation](https://tryraisins.dev/skills/playwright/): Lets your agent open a real browser from the terminal to click through a flow, fill forms, take screenshots and read what’s on the page, so it can show you a change working.

## Source

- [yeknal-performance on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-performance)
