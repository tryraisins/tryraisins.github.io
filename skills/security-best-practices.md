# Security best practices

> Reviews Python, JavaScript, TypeScript or Go code for security issues and writes secure-by-default code when you ask for it.

Canonical: https://tryraisins.dev/skills/security-best-practices/
Source revision: fc6b3b7

Load per-language and per-framework secure-coding references for Python, JavaScript/TypeScript, or Go. Use as the stack reference library behind yeknal-application-security, not as a full codebase audit.

## When to use

- You want a security review of specific code.
- New code should be secure by default from the start.
- You are working in Python, JavaScript, TypeScript or Go.

## When not to use

It only runs for explicit security review or secure-coding requests.

## Example

Ask: Do a security review of the file-upload handler.

Outcome: It checks validation, storage, paths and permissions, and reports issues with fixes and references.

## Install

```text
Install the Agent Skill "yeknal-security-best-practices" for all my projects.

Source, pinned to a published revision (14 files):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-security-best-practices
File list with SHA-256 hashes: https://tryraisins.dev/skills/security-best-practices/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-security-best-practices/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-security-best-practices into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-security-best-practices or ~/.claude/skills/yeknal-security-best-practices, so it is available in every project.
3. If a yeknal-security-best-practices folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 14 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `agents/openai.yaml` (237 bytes)
- `LICENSE.txt` (10776 bytes)
- `references/golang-general-backend-security.md` (38659 bytes)
- `references/javascript-express-web-server-security.md` (49357 bytes)
- `references/javascript-general-web-frontend-security.md` (38638 bytes)
- `references/javascript-jquery-web-frontend-security.md` (33581 bytes)
- `references/javascript-typescript-nextjs-web-server-security.md` (43423 bytes)
- `references/javascript-typescript-react-web-frontend-security.md` (41686 bytes)
- `references/javascript-typescript-vue-web-frontend-security.md` (31445 bytes)
- `references/modern-security-baseline.md` (3916 bytes)
- `references/python-django-web-server-security.md` (38661 bytes)
- `references/python-fastapi-web-server-security.md` (44926 bytes)
- `references/python-flask-web-server-security.md` (31748 bytes)
- `SKILL.md` (4480 bytes)

## Related

- [Application security](https://tryraisins.dev/skills/application-security/): Designs or hardens security across web apps, APIs, cloud setup, CI/CD pipelines and AI features, covering the OWASP-style risks a product is likely to face.
- [Threat model](https://tryraisins.dev/skills/security-threat-model/): Builds a threat model grounded in the actual repository, covering assets, trust boundaries, abuse paths and mitigations.

## Source

- [yeknal-security-best-practices on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-security-best-practices)
