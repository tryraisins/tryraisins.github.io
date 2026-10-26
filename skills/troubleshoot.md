# Troubleshoot

> Works back from a reproducible error, failing build or slowdown to its cause before it suggests a fix.

Canonical: https://tryraisins.dev/skills/troubleshoot/
Source revision: fc6b3b7

Diagnose code, build, performance, deployment, or system failures from reproducible evidence when the user reports an error or regression.

## When to use

- Something broke and you don’t know why.
- A build or deployment fails with an unclear error.
- Performance got worse after a change.

## Example

Ask: The app crashes when I open the settings page. Figure out why.

Outcome: It reproduces the crash, traces it to the cause, fixes it and confirms the page opens.

## Install

```text
Install the Agent Skill "yeknal-troubleshoot" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-troubleshoot
File list with SHA-256 hashes: https://tryraisins.dev/skills/troubleshoot/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-troubleshoot/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-troubleshoot into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-troubleshoot or ~/.claude/skills/yeknal-troubleshoot, so it is available in every project.
3. If a yeknal-troubleshoot folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (2750 bytes)

## Related

- [Browser automation](https://tryraisins.dev/skills/playwright/): Lets your agent open a real browser from the terminal to click through a flow, fill forms, take screenshots and read what’s on the page, so it can show you a change working.
- [Fix failing CI](https://tryraisins.dev/skills/gh-fix-ci/): Inspects failing GitHub Actions checks on a pull request, summarises the logs, drafts a fix plan and only makes changes once you approve.

## Source

- [yeknal-troubleshoot on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-troubleshoot)
