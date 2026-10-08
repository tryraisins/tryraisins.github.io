# TryRaisins portfolio redesign exploration

## Comparison frame

- Product: a personal software-engineering portfolio for collaborators, clients, and curious builders.
- Primary job: understand how TryRaisins thinks, inspect shipped work, and make contact.
- Platform: responsive web, keyboard, pointer, and touch.
- Existing contract: six real projects, current destinations, project imagery, social links, email contact, one clear H1, and content that remains useful without motion.
- Proof boundary: the supplied collections were reviewed as gallery evidence. Gallery images support claims about visible composition, density, type, material, and hierarchy, but not accessibility, performance, or conversion. Representative original sites will be used only where interaction details materially affect a concept.

## Reference synthesis

The complete visible sets in the supplied Are.na channel (87 blocks) and Brian Lovin gallery were reviewed on 2026-09-09. The references saturated around five useful patterns:

| Pattern | Classification | Relevance to TryRaisins |
| --- | --- | --- |
| Direct self-description before credentials | Invariant | Visitors meet a person and point of view before a stack list. |
| Project artifacts used as the dominant proof | Invariant | Existing cover images can carry the work without invented metrics. |
| Index, ledger, archive, and table structures | Common option | A portfolio can feel authored without hiding basic navigation. |
| One unusual spatial or interaction device | Outlier worth testing | A tuner, route, notebook margin, console, or movable archive can create the “left the internet” feeling. |
| Extreme type, motion, or novelty repeated everywhere | Risk | It makes work harder to inspect and quickly becomes a theme rather than a personal world. |

Saturation note: after reviewing both full galleries, later items repeated the same structural families. Additional examples were not changing the decision set.

## Personal evidence used

- Public identity and memorable name: TryRaisins.
- Lagos is part of the current identity and not decorative metadata.
- The work spans products, intelligence tooling, applied NLP, developer tools, music, and sport.
- The user prefers specific, reliable, end-to-end work and has rejected generic gradient, glass, and “AI slop” aesthetics.
- Earlier portfolio iterations used games and surprise. The current product is intentionally compact, so play is treated as character, not a separate arcade.

## Five directions

### 1. Lagos Workshop Ledger

- Axis: civic-scale typography and a route-like project list.
- Thesis: a working ledger painted with the visual confidence of Lagos street signage.
- Signature: the vertical “built here / sent everywhere” route connecting six shipped systems.
- System: warm white, carbon, danfo yellow, signal red; Archivo Black plus Space Grotesk; hard rules and numbered stops.
- Rejects: fake transit branding, decorative maps, distressed texture everywhere.

```text
DESKTOP                         MOBILE
+ identity + clock + contact   + identity / contact
+ giant statement              + condensed statement
+ route | project stops        + vertical route
+ closing invitation           + project detail beneath stop
```

### 2. Field Notes

- Axis: intimate reading and annotation.
- Thesis: a field notebook from a builder who studies real problems and leaves evidence in the margins.
- Signature: margin notes that explain why each project exists.
- System: ruled paper, graphite, faded blue, correction red; Fraunces plus IBM Plex Mono; quiet page turns rather than cards.
- Rejects: scrapbook clutter, fake handwriting, nostalgic props with no content role.

### 3. Night Radio

- Axis: atmospheric interaction and focused disclosure.
- Thesis: an after-hours Lagos radio desk broadcasting one shipped system at a time.
- Signature: a frequency tuner that changes the active project and its proof image.
- System: midnight blue, warm dial light, soft cream; Instrument Serif plus Space Grotesk; one slow signal sweep with a static reduced-motion state.
- Rejects: neon cyberpunk, fake audio playback, illegible glow.

### 4. Personal System

- Axis: density, status, and operational clarity.
- Thesis: the portfolio as the calm control surface behind products that have to keep working.
- Signature: six live-looking but truthfully labeled “SHIPPED” nodes with a human operator note.
- System: off-black, phosphor cream, measured cyan; Space Grotesk plus IBM Plex Mono; dense grid with precise focus states.
- Rejects: fabricated uptime, fake terminal commands, generic SaaS cards.

### 5. Pocket Playground

- Axis: tactile play and spatial discovery.
- Thesis: a small digital desk where useful tools, odd ideas, and finished products coexist.
- Signature: a shuffleable arrangement of project tiles that never hides the complete list.
- System: soft gray desk, ink, tomato, cobalt, butter; Fraunces plus Space Grotesk; crisp press and rearrangement feedback.
- Rejects: draggable chaos on mobile, toy styling that weakens project credibility, hidden-only navigation.

## Responsive and state plan

- 320–430px: every direction becomes a deliberate mobile composition; no desktop sidebars are merely squeezed. Project actions remain at least 44px high.
- 768–1024px: split compositions reflow based on content pressure; the tuner and system grid keep their semantic order.
- 1280x720: fixed or sticky elements are bounded so contact and the prototype picker remain reachable.
- 1440px and wide: reading measures remain constrained and project imagery gains space without stretching copy.
- Keyboard: every link, tuner option, and shuffle control has a visible focus state. Number and arrow keys operate only the prototype picker.
- Reduced motion: ambient sweeps, card drift, and entrance transforms stop; all content and active-state meaning remain.

## Integration boundary

Pocket Playground was selected and is now the production homepage in `src/pages/index.astro`. The prototype route remains available for comparison at `/prototypes/portfolio-redesign/`.

### Notebook decoration

- The active page uses warm ruled paper, a shared red book margin, Bricolage Grotesque and DM Sans, and existing tomato, cobalt and butter accents. Readable content begins after the margin; decorative layers span the page and may cross the rule.
- Drawings resemble a child's classroom pencil sketches: uneven silhouettes, soft graphite edges, changes in pressure, faint retracing and sparse hatch shading. They draw first, animate their own parts for 11 seconds, then erase. Keep them transparent, behind content and display-only.
- Spinning toys have distinct silhouettes, materials and rim patterns. Motion follows spin loss, increasing wobble, a grounded fall and a brief rest. Collisions dissipate energy and can transfer spin. Avoid repeated acceleration that prevents settling.
- Respect reduced motion with completed static drawings and stationary tops. Keep all links and content readable regardless of decoration; verify the margin and viewport containment at desktop and 320px/390px widths.

## Current content verification

### 2026-10-08 free typography accents

The user requested a mix inspired by https://shantellmartin.art/, then chose to avoid paid fonts. Its live CSS identifies Kommissar Condensed Ultra for display and Calibre for supporting text. Desktop and phone browser inspection supplied visual evidence, while the foundries confirmed these are commercial families. The portfolio adopts the contrast between condensed headings and clear supporting titles, keeping its existing notebook composition and content.

Barlow Condensed 600 now serves the work/contact section headings at 48-76px with 1.05 line height and -0.015em tracking; the contact heading retains its existing smaller phone range. Public Sans 600 serves project titles at the existing responsive 28-34px range and 1.1 line height. Bricolage Grotesque 600 remains the hero face and DM Sans remains the body/control face, so these additional families have confined roles. Both additions use the SIL Open Font License, verified against the official Google Fonts source: [Barlow Condensed](https://github.com/google/fonts/blob/main/ofl/barlowcondensed/OFL.txt) and [Public Sans](https://github.com/google/fonts/blob/main/ofl/publicsans/OFL.txt). Use the shared `--play-section-font` and `--play-project-font` tokens and exact loaded weights rather than per-heading overrides.

The existing 3/2/1 project grid, controls, margin, illustrations, animations and all copy/destinations remain the governing system. Browser checks cover 11 widths, enlarged text, font-failure recovery, keyboard navigation, shuffle and Play prototype parity; screenshots at desktop/tablet/phone widths remain in ignored `output/playwright/font-mix/`. This is a typography accent update, and does not reproduce the reference site's artwork, oversized navigation or layout.

### 2026-10-05 typography selection and design review

- The user selected Bricolage Grotesque for display and DM Sans for body text/controls. This is the approved font direction and is now implemented in the active homepage and Play prototype.
- Thesis: preserve the playful working notebook while making project evidence and contact easier to read. Keep the warm paper, red margin, taped project photographs, yellow contact sheet, real copy/destinations, shuffle, sketches and existing top physics.
- Proposed roles: display weight 600 with roughly -0.03em tracking and 1.02 line height; body regular at 15-21px with 1.5 line height; controls medium/semibold at 14px with 44-48px targets; metadata at 11-12px. Use responsive values during implementation rather than copying fixed canvas sizes.
- Desktop and 390px phone live review confirmed compressed hero type, 11px project descriptions, 9px project actions and mobile availability hidden below 620px. Work navigation and shuffle announcement worked. Smaller-phone and reduced-motion checks were interrupted and remain unverified.
- Editable static proposals: Pen frames `uDYdI` (desktop), `CKIAN` (phone), and `vg9oV` (review notes) in the active document recorded in `HANDOFF.md`. Exports/live evidence are in ignored `output/design-review/`. The desktop decoration is a static excerpt from production, not a replacement animation.
- The user approved implementation, push and deployment on 2026-10-05. Implementation `7bc3ec5` is deployed and live-verified at https://tryraisins.dev/. The approved layout is implemented with a 3/2/1 grid, real shuffle, readable copy and visible phone availability. Preserve existing side effects and animation lifecycle; do not replace production behavior with the static canvas representation. Keep the two existing unexposed cover treatments until real replacement assets are approved.

- All six project names, types, descriptions, years, cover assets, destinations, social links, and the contact email match the active `src/pages/index.astro` source.
- On 2026-09-09, QuickBillz, Terror Tracker, Talent Hunter, and StreamSlip returned HTTP 200 from their saved destinations. The npm registry rejected an automated request for `yeknal` with HTTP 403, so that result does not establish whether the public browser page is unavailable.
- `https://betpicks.tryraisins.dev/` currently fails TLS hostname verification, and its `betpicks.netlify.app` origin returns HTTP 404. The prototype intentionally preserves the active homepage URL rather than silently replacing product content during a visual exploration.
