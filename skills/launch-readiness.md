# Launch readiness

> Audits a product before it becomes publicly reachable, covering the legal obligations that attach to the data, payments, email and user content it handles, plus the engineering gates no other workflow owns, then returns one register and a go or no-go.

Canonical: https://tryraisins.dev/skills/launch-readiness/
Source revision: 95a39b5

Audit a product for launch readiness before it becomes publicly reachable: legal obligations plus the engineering gates no other workflow owns, then one register and a go or no-go. Use when asked whether an app can ship.

## When to use

- You are about to let strangers reach the product for the first time.
- You need to know which privacy, payment, email and content duties apply to you, in Nigeria or elsewhere.
- You want the unglamorous checks done: database rules, a tested restore, a real performance budget, deliverability, spend caps, a rollback plan.

## When not to use

It is not legal advice and it is not a code review. It never states a statutory maximum as a likely outcome, and it marks anything it cannot verify as unassessed rather than guessing.

## Example

Ask: We launch on Monday. What are we missing?

Outcome: It builds a data map from the code, checks it against the applicable obligations and the seven launch gates, then returns a verdict with blockers first, the filings that need lead time, and every check it could not perform.

## Install

```text
Install the Agent Skill "yeknal-launch-readiness" for all my projects.

Source, pinned to a published revision (6 files):
https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-launch-readiness
File list with SHA-256 hashes: https://tryraisins.dev/skills/launch-readiness/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-launch-readiness/
   git -C yeknal-skill-src checkout 95a39b5f5552e26ca8493af435f08a8fd34456ce
2. Copy skills/yeknal-launch-readiness into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-launch-readiness or ~/.claude/skills/yeknal-launch-readiness, so it is available in every project.
3. If a yeknal-launch-readiness folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that all 6 files match the listed hashes, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `references/evidence-and-fixes.md` (6526 bytes)
- `references/jurisdictions.md` (15007 bytes)
- `references/launch-gates.md` (7325 bytes)
- `references/obligations.md` (9546 bytes)
- `references/report-template.md` (3143 bytes)
- `SKILL.md` (7681 bytes)

## Related

- [Application security](https://tryraisins.dev/skills/application-security/): Designs or hardens security across web apps, APIs, cloud setup, CI/CD pipelines and AI features, covering the OWASP-style risks a product is likely to face.
- [Finalize](https://tryraisins.dev/skills/finalize/): Runs the final documentation and quality checks, summarises the diff and handles any Git publishing you asked for.
- [Sentry errors](https://tryraisins.dev/skills/sentry/): Inspects Sentry issues and events, summarises recent production errors and pulls basic health data, using read-only queries.
- [Testing strategy](https://tryraisins.dev/skills/testing-strategy/): Keeps verification end to end: proves behavior through the real entry point, bans new unit tests, and asks before any isolated check.

## Source

- [yeknal-launch-readiness on GitHub](https://github.com/tryraisins/MD_Files/tree/95a39b5f5552e26ca8493af435f08a8fd34456ce/skills/yeknal-launch-readiness)
