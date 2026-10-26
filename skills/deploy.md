# Deploy

> Detects the hosting provider from repository configuration and follows that provider's deploy procedure, so an unnamed "deploy this" request has one entry point instead of four competing ones.

Canonical: https://tryraisins.dev/skills/deploy/
Source revision: 95a39b5

Deploy, host, publish, or push a site live to Cloudflare, Netlify, Render, or Vercel, named by the user or detected from repository config. Use when a deploy is requested; keep the first deploy a preview unless production is explicitly asked for.

## When to use

- The user asks to deploy, host, publish or push a site live.
- The provider is unstated and has to be read from wrangler, netlify, render or vercel configuration.
- A deploy failed and the provider-specific recovery step is needed.

## When not to use

It is not a hosting comparison and not an infrastructure provisioner. It detects a provider, runs the documented path, and stops to ask when two configurations match.

## Example

Ask: Deploy this app and give me the live link.

Outcome: It reads the repository configuration, identifies the provider, follows that provider's preview-first procedure, and reports the deployed URL and any missing credentials.

## Install

```text
Install the Agent Skill "yeknal-deploy" for all my projects.

Source, pinned to a published revision (10 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-deploy
File list with SHA-256 hashes: https://tryraisins.dev/skills/deploy/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-deploy/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-deploy into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-deploy or ~/.claude/skills/yeknal-deploy, so it is available in every project.
3. If a yeknal-deploy folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 10 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/cloudflare.md` (3047 bytes)
- `references/licenses/cloudflare.txt` (10776 bytes)
- `references/licenses/netlify.txt` (10776 bytes)
- `references/licenses/render.txt` (10776 bytes)
- `references/licenses/vercel.txt` (1063 bytes)
- `references/netlify.md` (2355 bytes)
- `references/render.md` (3149 bytes)
- `references/vercel.md` (2246 bytes)
- `scripts/deploy.sh` (9035 bytes)
- `SKILL.md` (3508 bytes)

## Related

- [Finalize](https://tryraisins.dev/skills/finalize/): Runs the final documentation and quality checks, summarises the diff and handles any Git publishing you asked for.
- [Commit, push and open a PR](https://tryraisins.dev/skills/yeet/): Stages, commits, pushes and opens a GitHub pull request in one flow using the GitHub CLI.

## Source

- [yeknal-deploy on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-deploy)
