# Browser automation

> Lets your agent open a real browser from the terminal to click through a flow, fill forms, take screenshots and read what’s on the page, so it can show you a change working.

Canonical: https://tryraisins.dev/skills/playwright/
Source revision: 95a39b5

Automate a real browser from the terminal for navigation, forms, snapshots, screenshots, extraction, or UI-flow debugging.

## When to use

- You want proof that a sign-up, checkout or settings flow still works after a change.
- A layout problem only shows up at one screen size or after a few clicks.
- You need screenshots or page text captured the same way every time.

## When not to use

If you want a permanent test suite in the repository, ask for Playwright test files instead, because this skill drives the browser from the command line.

## Example

Ask: Open the sign-up page at phone width, fill the form with test values and send me a screenshot of the confirmation screen.

Outcome: It opens a browser through the bundled wrapper, steps through the form, saves the screenshot and reports anything that overlapped or clipped.

## Requirements

Needs Node.js with npx, which the bundled wrapper uses to run playwright-cli.

## Install

```text
Install the Agent Skill "yeknal-playwright" for all my projects.

Source, pinned to a published revision (9 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-playwright
File list with SHA-256 hashes: https://tryraisins.dev/skills/playwright/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-playwright/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-playwright into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-playwright or ~/.claude/skills/yeknal-playwright, so it is available in every project.
3. If a yeknal-playwright folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 9 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (353 bytes)
- `assets/playwright-small.svg` (828 bytes)
- `assets/playwright.png` (1730 bytes)
- `LICENSE.txt` (11351 bytes)
- `NOTICE.txt` (403 bytes)
- `references/cli.md` (1863 bytes)
- `references/workflows.md` (1864 bytes)
- `scripts/playwright_cli.sh` (526 bytes)
- `SKILL.md` (4060 bytes)

## Related

- [Break UI](https://tryraisins.dev/skills/break-ui/): Stress-tests a screen with realistic worst-case data, such as long names, missing fields, huge counts and non-Latin text, and reports every break with its fix.
- [Testing strategy](https://tryraisins.dev/skills/testing-strategy/): Keeps verification end to end: proves behavior through the real entry point, bans new unit tests, and asks before any isolated check.
- [Troubleshoot](https://tryraisins.dev/skills/troubleshoot/): Works back from a reproducible error, failing build or slowdown to its cause before it suggests a fix.

## Source

- [yeknal-playwright on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-playwright)
