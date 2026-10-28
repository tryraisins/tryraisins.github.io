# Threat model

> Builds a threat model grounded in the actual repository, covering assets, trust boundaries, abuse paths and mitigations.

Canonical: https://tryraisins.dev/skills/security-threat-model/
Source revision: f9d54a7

Create a repository-grounded threat model covering assets, trust boundaries, abuse paths, and mitigations. Use only for explicit threat-modeling requests, not for vulnerability hunts or pen tests.

## When to use

- You are launching something that handles sensitive data.
- You want to understand how the system could be abused.
- A security review needs a threat model first.

## When not to use

It only runs when you ask for a threat model.

## Example

Ask: Threat model the new public API.

Outcome: It maps assets and trust boundaries from the code, lists likely abuse paths and recommends mitigations by priority.

## Install

```text
Install the Agent Skill "yeknal-security-threat-model" for all my projects.

Source, pinned to a published revision (5 files):
https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-security-threat-model
File list with SHA-256 hashes: https://tryraisins.dev/skills/security-threat-model/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-security-threat-model/
   git -C yeknal-skill-src checkout f9d54a7328469fdaa4e19120a94a22ccb3d97160
2. Copy skills/yeknal-security-threat-model into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-security-threat-model or ~/.claude/skills/yeknal-security-threat-model, so it is available in every project.
3. If a yeknal-security-threat-model folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 5 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (254 bytes)
- `LICENSE.txt` (10776 bytes)
- `references/prompt-template.md` (12642 bytes)
- `references/security-controls-and-assets.md` (1680 bytes)
- `SKILL.md` (5384 bytes)

## Related

- [Application security](https://tryraisins.dev/skills/application-security/): Designs or hardens security across web apps, APIs, cloud setup, CI/CD pipelines and AI features, covering the OWASP-style risks a product is likely to face.
- [Security best practices](https://tryraisins.dev/skills/security-best-practices/): Reviews Python, JavaScript, TypeScript or Go code for security issues and writes secure-by-default code when you ask for it.

## Source

- [yeknal-security-threat-model on GitHub](https://github.com/tryraisins/MD_Files/tree/f9d54a7328469fdaa4e19120a94a22ccb3d97160/skills/yeknal-security-threat-model)
