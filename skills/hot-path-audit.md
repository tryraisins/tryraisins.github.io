# Hot-path audit

> Reads the code paths that run on every request and prices the cost hiding in ordinary code: serialized I/O, whole rows and JSONB documents fetched for a few fields, repeated URL parsing and regex construction, hot keys trapped in large JSONB, and state that is really an undocumented state machine.

Canonical: https://tryraisins.dev/skills/hot-path-audit/
Source revision: 796d3bc

Audit the code paths that run on every request for cost that hides in ordinary code: serialized I/O that could be one round trip, whole rows and JSONB documents fetched for a few fields, redundant URL parsing and regex construction, single hot keys trapped in large JSONB, and state that is really an undocumented state machine. Use for a hot-path review, a why-is-this-slow pass, or before a refactor that touches durable state.

## When to use

- Something feels slow and you suspect the code path rather than the screen.
- You are about to touch durable state and want the implicit state machine named first.
- A query loads a whole row or a large document to read two fields.
- You want the micro-optimizations rejected out loud instead of argued about later.

## When not to use

It does not produce the before and after numbers, and it does not diagnose a broken feature. Use App performance when the claim needs a measurement, and Troubleshoot when something does not work.

## Example

Ask: Audit the checkout request path and tell me what is structurally expensive.

Outcome: It records a baseline, prices each finding by call site and frequency, splits the three genuinely unordered calls, projects two over-wide queries, and lists the regex hoists it rejected as noise.

## Install

```text
Install the Agent Skill "yeknal-hot-path-audit" for all my projects.

Source, pinned to a published revision (1 file):
https://github.com/tryraisins/MD_Files/tree/796d3bc2c70059fc861465d1156e2bdfed50b6d7/skills/yeknal-hot-path-audit
File list with SHA-256 hashes: https://tryraisins.dev/skills/hot-path-audit/files.json

1. Fetch that exact folder, including every supporting file and license notice. One way to do it:
   git clone -c core.autocrlf=false --filter=blob:none --no-checkout https://github.com/tryraisins/MD_Files.git yeknal-skill-src
   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/yeknal-hot-path-audit/
   git -C yeknal-skill-src checkout 796d3bc2c70059fc861465d1156e2bdfed50b6d7
2. Copy skills/yeknal-hot-path-audit into the user-level skills folder your agent reads, such as ~/.agents/skills/yeknal-hot-path-audit or ~/.claude/skills/yeknal-hot-path-audit, so it is available in every project.
3. If a yeknal-hot-path-audit folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.
4. Check that the file matches its listed hash, then delete the temporary yeknal-skill-src checkout.
```

## Files

- `SKILL.md` (13440 bytes)

## Related

- [App performance](https://tryraisins.dev/skills/performance/): Measures startup, screen navigation, content loading and scrolling on a throttled production build, finds the real bottleneck, then proves each fix with before and after benchmarks rather than intuition.
- [Code review](https://tryraisins.dev/skills/review/): Reads code or a whole system for real defects, regressions and maintainability risks, then sorts what it finds by severity and effort.
- [Troubleshoot](https://tryraisins.dev/skills/troubleshoot/): Works back from a reproducible error, failing build or slowdown to its cause before it suggests a fix.
- [Domain modeling](https://tryraisins.dev/skills/domain-modeling/): Clarifies a project’s domain terms and boundaries and records the decisions in a glossary or architecture decision record.

## Source

- [yeknal-hot-path-audit on GitHub](https://github.com/tryraisins/MD_Files/tree/796d3bc2c70059fc861465d1156e2bdfed50b6d7/skills/yeknal-hot-path-audit)
