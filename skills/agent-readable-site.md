# Agent-readable site

> Gives every public page a markdown version and gives agents the files that explain the site: llms.txt, llms-full.txt, ai.txt, head signals and a crawler policy, plus a checker that separates host-blocked requirements from real failures.

Canonical: https://tryraisins.dev/skills/agent-readable-site/
Source revision: 95a39b5

Use when a public site must be readable and quotable by AI agents: per-page markdown, llms.txt, llms-full.txt, ai.txt, head signals, crawler policy and a coverage check. Not content strategy or keywords.

## When to use

- You want AI agents and answer engines to fetch your pages cheaply and attribute them correctly.
- You are adding llms.txt, llms-full.txt or ai.txt and want them generated rather than hand-maintained.
- You need to know which parts of an agent-readable surface your host can actually support.

## When not to use

It does not choose keywords, rewrite pages or promise citations. Query and metadata work stays with content SEO, and a published file is never reported as a visibility result.

## Example

Ask: Make our whole site readable by AI agents and show me which pages still have no markdown version.

Outcome: Every public route gets a markdown endpoint from the existing data loaders, the site files generate from one config, and the checker reports per-route coverage with the host's real limits named.

## Install

```text
Install the Agent Skill "yeknal-agent-readable-site" for all my projects.

Source, pinned to a published revision (4 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-agent-readable-site
File list with SHA-256 hashes: https://tryraisins.dev/skills/agent-readable-site/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-agent-readable-site/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-agent-readable-site into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-agent-readable-site or ~/.claude/skills/yeknal-agent-readable-site, so it is available in every project.
3. If a yeknal-agent-readable-site folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 4 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/markdown-endpoints.md` (7939 bytes)
- `references/site-files.md` (8864 bytes)
- `scripts/check-ai-surface.mjs` (21187 bytes)
- `SKILL.md` (5528 bytes)

## Related

- [Content and SEO](https://tryraisins.dev/skills/content-seo/): Guides useful content and search visibility together, from keyword patterns and page briefs to metadata, structured data, sitemaps, local search, earned links and AI citations.
- [Deploy](https://tryraisins.dev/skills/deploy/): Detects the hosting provider from repository configuration and follows that provider's deploy procedure, so an unnamed "deploy this" request has one entry point instead of four competing ones.

## Source

- [yeknal-agent-readable-site on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-agent-readable-site)
