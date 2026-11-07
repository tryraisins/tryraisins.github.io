# Application security

> Designs or hardens security across web apps, APIs, cloud setup, CI/CD pipelines, payments and AI features, covering the OWASP-style risks a product is likely to face.

Canonical: https://tryraisins.dev/skills/application-security/
Source revision: 317a7b0

Design or harden application security across web, API, cloud, CI/CD, and AI systems, including payment authenticity and money-path integrity. Use for secure implementation or broad AppSec analysis.

## When to use

- You are building authentication, authorization or an API that handles user data.
- A payment callback or webhook can mark an order paid, credit a wallet or unlock access.
- A project needs a broad security pass before launch.
- You want secure defaults for headers, secrets, rate limits and logging.

## Example

Ask: Harden the API before we launch: auth, rate limiting, headers and how secrets are handled.

Outcome: It reviews each area against concrete risks, fixes what it can and lists anything that needs a decision from you.

## Install

```text
Install the Agent Skill "yeknal-application-security" for all my projects.

Source, pinned to a published revision (3 files):
https://github.com/tryraisins/MD_Files/tree/317a7b0d085a9a6c1e4c404d4bfbd1946a966c2d/skills/yeknal-application-security
File list with SHA-256 hashes: https://tryraisins.dev/skills/application-security/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-application-security/
   git -C yeknal-skill-src checkout 317a7b0d085a9a6c1e4c404d4bfbd1946a966c2d
2. Copy skills/yeknal-application-security into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-application-security or ~/.claude/skills/yeknal-application-security, so it is available in every project.
3. If a yeknal-application-security folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 3 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/PAYMENT-CALLBACKS.md` (8716 bytes)
- `Security-Master.md` (18549 bytes)
- `SKILL.md` (12914 bytes)

## Related

- [Security best practices](https://tryraisins.dev/skills/security-best-practices/): Reviews Python, JavaScript, TypeScript or Go code for security issues and writes secure-by-default code when you ask for it.
- [Threat model](https://tryraisins.dev/skills/security-threat-model/): Builds a threat model grounded in the actual repository, covering assets, trust boundaries, abuse paths and mitigations.

## Source

- [yeknal-application-security on GitHub](https://github.com/tryraisins/MD_Files/tree/317a7b0d085a9a6c1e4c404d4bfbd1946a966c2d/skills/yeknal-application-security)
