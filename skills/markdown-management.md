# Markdown management

> Creates, merges, updates and audits Markdown without losing meaning, links or repository conventions, including README files and Agent Skills.

Canonical: https://tryraisins.dev/skills/markdown-management/
Source revision: 00061b8

Create, merge, update, or audit Markdown without losing meaning, links, authority, or repository conventions. Use for README, docs, and Agent Skill maintenance.

## When to use

- Docs need merging or restructuring without losing anything.
- A README or skill file needs updating to match the code.
- You want links and headings audited.

## Example

Ask: Merge these two setup guides into one README section.

Outcome: It combines them without dropping steps, keeps the links working and follows the repository’s style.

## Install

```text
Install the Agent Skill "yeknal-markdown-management" for all my projects.

Source, pinned to a published revision (7 files):
https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-markdown-management
File list with SHA-256 hashes: https://tryraisins.dev/skills/markdown-management/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-markdown-management/
   git -C yeknal-skill-src checkout 00061b828e01544f48d56e626569f3a70272311a
2. Copy skills/yeknal-markdown-management into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-markdown-management or ~/.claude/skills/yeknal-markdown-management, so it is available in every project.
3. If a yeknal-markdown-management folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 7 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/installed-skill-conflict-resolution.md` (1610 bytes)
- `references/markdown-review-checklist.md` (2005 bytes)
- `scripts/audit-installed-skill-conflicts.ps1` (4147 bytes)
- `scripts/audit-markdown-links.ps1` (2781 bytes)
- `scripts/audit-skills.ps1` (7247 bytes)
- `scripts/validate-routing-evals.ps1` (2744 bytes)
- `SKILL.md` (7998 bytes)

## Related

- [Project handoff](https://tryraisins.dev/skills/project-handoff/): Keeps a short HANDOFF.md at the root of the repository so the next session, or the next person, can pick up exactly where the work stopped.
- [Content and SEO](https://tryraisins.dev/skills/content-seo/): Guides useful content and search visibility together, from keyword patterns and page briefs to metadata, structured data, sitemaps, local search, earned links and AI citations.

## Source

- [yeknal-markdown-management on GitHub](https://github.com/tryraisins/MD_Files/tree/00061b828e01544f48d56e626569f3a70272311a/skills/yeknal-markdown-management)
