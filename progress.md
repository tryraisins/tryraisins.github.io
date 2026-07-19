Original prompt: let's try to add space invaders as a game played with the charcters in a section

Progress:
- Adding a section-local Space Invaders-style hidden challenge to `src/components/GameHunt.astro`.
- The game should use letters sampled from the active portfolio section as invaders, mount only after the existing challenge reveal, and preserve the portfolio-first surprise UX.
- Implemented `Section Invaders` with a section-local canvas, keyboard controls, sampled text-character invaders, win/loss resolution, `render_game_to_text`, and `advanceTime`.
- Browser smoke test confirmed the canvas mounts and player movement works.
- Adjusted firing so Space creates a bullet on keydown instead of waiting for the next frame.
- Rebuilt successfully after the input fix.
- Focused Chrome checks confirmed movement, immediate bullet creation, `advanceTime`, and `render_game_to_text`.
- Attempted the provided `web_game_playwright_client.js`, but it could not run because `playwright` is not installed as a project dependency and the client has no system-Chrome executable option.
- Fixed hidden-game reveal reliability by observing all eligible sections (`skills`, `projects`, `contact`) and adding a scroll/resize fallback check. Chrome verification on a fresh static server showed no intro/nav on initial load and a reveal at normal scroll position.
- User still could not see the reveal. Root cause: the intro panel was positioned `absolute` inside the section, so if the trigger fired after the visitor was already partway through the section, the panel could be above the viewport. Changed `.game-intro` to `position: fixed` so it is still created only after a section trigger, but is visible in the viewport. Build passed and screenshot inspection confirmed the panel is visible after scrolling.
- Found the remaining visibility bug in a clean browser run: the section observer immediately applied `re-attention`, replacing the entrance animation before it could move `.game-intro` from its base `opacity: 0`. The panel existed and had content but stayed fully transparent. Made the visible state the CSS baseline and added a dedicated `introEnter` animation, so any animation override still leaves the panel visible.
- Rebuilt and verified the full reveal flow in Chrome at desktop (1280x800) and mobile (390x844): no panel on initial load, one visible panel after scrolling to Skills, computed opacity 1, fully inside the viewport, and no console errors. The configured public site at `https://tryraisins.dev/` currently serves no GameHunt script and shows no reveal, so the live deployment is still on an older build.

TODO:
- Consider adding a dedicated project Playwright test setup if this portfolio starts carrying more canvas games.

2026-07-19 update:
- Promoted the concept page to the root homepage; `/concept/` now redirects to `/`.
- Added functional Glyph Serpent, Five-ish, and Stack Architect games to the Play section.
- Glyph Serpent uses section characters as food, keyboard movement, edge wrapping, self-collision, canvas rendering, and deterministic state hooks.
- Five-ish derives a 5–8 letter target from Play copy and supports six guesses with exact/present/absent scoring.
- Stack Architect requires UI → API → DATA → SHIP and exposes clickable dependency nodes.
- Browser smoke-tested all three games; build passes.
