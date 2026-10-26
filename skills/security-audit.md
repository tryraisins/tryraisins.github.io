# Security audit

> Runs a multi-phase security audit of a repository, directory or diff with a coverage ledger, adversarial verification and schema-validated findings.

Canonical: https://tryraisins.dev/skills/security-audit/
Source revision: fc6b3b7

Run a multi-phase security audit of a repository, directory, or diff with a coverage ledger, adversarial verification, and schema-validated findings. Use only for explicit audit or pen-test requests, not general security questions.

## When to use

- You want a full security audit or pen test of a codebase rather than a quick review.
- You need findings you can hand to someone else, with evidence and a reproduction for each.
- A previous audit needs its coverage gaps closed or its findings rechecked against changed code.

## When not to use

It only runs a full audit when you ask for one. Security questions and focused reviews belong to the narrower security skills.

## Example

Ask: Audit this repository for security vulnerabilities and give me the findings.

Outcome: It plans coverage, hunts in isolated units, has every candidate independently disproved or confirmed, and writes findings.json plus a report derived from it.

## Requirements

Needs Node.js for the two zero-dependency validators. Target code is not executed without an OS-enforced sandbox.

## Install

```text
Install the Agent Skill "yeknal-security-audit" for all my projects.

Source, pinned to a published revision (19 files):
https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-security-audit
File list with SHA-256 hashes: https://tryraisins.dev/skills/security-audit/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-security-audit/
   git -C yeknal-skill-src checkout fc6b3b7cc3c6dc9d9e72b3921ea211044675b692
2. Copy skills/yeknal-security-audit into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-security-audit or ~/.claude/skills/yeknal-security-audit, so it is available in every project.
3. If a yeknal-security-audit folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 19 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `LICENSE.txt` (1078 bytes)
- `references/AI-AND-LLM.md` (10617 bytes)
- `references/ATTACK-CLASSES.md` (15695 bytes)
- `references/CLIENT-SIDE.md` (8594 bytes)
- `references/CLOUD-AND-DEPLOYMENT.md` (8291 bytes)
- `references/DATA-ISOLATION-AND-LIFECYCLE.md` (7798 bytes)
- `references/DESKTOP-MOBILE-AND-LOCAL-IPC.md` (8739 bytes)
- `references/HUNTING.md` (22446 bytes)
- `references/MEMORY-SAFETY-AND-BINARY.md` (10513 bytes)
- `references/PROTOCOLS-RPC-AND-MESSAGING.md` (7483 bytes)
- `references/RECONNAISSANCE.md` (15902 bytes)
- `references/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md` (7476 bytes)
- `references/SUPPLY-CHAIN-AND-RELEASE.md` (7258 bytes)
- `references/VALIDATION-AND-REPORTING.md` (18175 bytes)
- `references/WEB-PROTOCOL-AND-AUTH.md` (12300 bytes)
- `scripts/report-schema.json` (14494 bytes)
- `scripts/validate-coverage-ledger.cjs` (34011 bytes)
- `scripts/validate-findings.cjs` (29379 bytes)
- `SKILL.md` (19111 bytes)

## Related

- [Application security](https://tryraisins.dev/skills/application-security/): Designs or hardens security across web apps, APIs, cloud setup, CI/CD pipelines and AI features, covering the OWASP-style risks a product is likely to face.
- [Threat model](https://tryraisins.dev/skills/security-threat-model/): Builds a threat model grounded in the actual repository, covering assets, trust boundaries, abuse paths and mitigations.
- [Security best practices](https://tryraisins.dev/skills/security-best-practices/): Reviews Python, JavaScript, TypeScript or Go code for security issues and writes secure-by-default code when you ask for it.
- [Security ownership map](https://tryraisins.dev/skills/security-ownership-map/): Maps who owns sensitive code from Git history and highlights bus-factor risk and code nobody looks after.

## Source

- [yeknal-security-audit on GitHub](https://github.com/tryraisins/MD_Files/tree/fc6b3b7cc3c6dc9d9e72b3921ea211044675b692/skills/yeknal-security-audit)
