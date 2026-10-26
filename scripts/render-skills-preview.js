// Production asset renderer for Playwright CLI's run-code --filename option.
// Open the built /skills/ page first; run from the repository root. It adapts
// only a temporary browser page and writes public/og-skills.png.
async (page) => {
  const source = new URL('/skills/', page.url()).href;
  const card = await page.context().newPage();
  try {
    await card.setViewportSize({ width: 1200, height: 630 });
    await card.emulateMedia({ reducedMotion: 'reduce' });
    await card.route(source, async route => {
      const response = await route.fetch();
      const html = await response.text();
      await route.fulfill({ response, body: html.replace('</head>', `<style>
        html, body { width:1200px; height:630px; overflow:hidden; }
        .sk-world { min-height:630px; --sk-margin:72px; }
        .sk-topbar, .sk-footer, .sk-browse, .sk-all, .sk-lede, .sk-facts, .sk-sub, .sk-skip { display:none !important; }
        .sk-intro { padding:56px 72px 0 112px !important; gap:18px !important; }
        .sk-intro .sk-kicker { font-size:32px; color:var(--sk-ink); }
        .sk-intro .sk-h1 { max-width:640px !important; font-size:92px !important; line-height:.92 !important; }
        .sk-starts { position:absolute; top:132px; right:64px; width:340px; padding:0 !important; }
        .sk-starts .sk-h2 { display:none; }
        .sk-notes { grid-template-columns:1fr !important; gap:30px !important; margin:0 !important; }
        .sk-notes li:nth-child(n+3) { display:none; }
        .sk-note { min-height:0 !important; }
        .og-footer { position:absolute; left:112px; right:72px; bottom:48px; display:flex; justify-content:space-between; align-items:center; font:600 30px/1 var(--sk-hand); }
        .og-domain { min-height:52px; padding:8px 18px; display:inline-flex; align-items:center; background:var(--sk-yellow); border:1px solid var(--sk-ink); box-shadow:3px 3px 0 var(--sk-ink); font-size:32px; font-weight:600; }
      </style></head>`) });
    });
    await card.goto(source);
    await card.evaluate(() => document.fonts.ready);
    await card.evaluate(() => {
      const count = document.querySelectorAll('[data-skill]').length;
      document.querySelector('.sk-intro .sk-kicker').textContent = `Agent skills / ${count} free skills`;
      const footer = document.createElement('div');
      footer.className = 'og-footer';
      footer.innerHTML = '<span>TryRaisins / Software engineer</span><span class="og-domain">tryraisins.dev/skills</span>';
      document.querySelector('.sk-world').append(footer);
    });
    const fonts = await card.evaluate(() => [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family));
    if (!fonts.includes('Caveat') || !fonts.includes('DM Sans')) throw Error('Required portfolio fonts did not load');
    await card.screenshot({ path: 'public/og-skills.png', animations: 'disabled' });
    return { source, output: 'public/og-skills.png', width: 1200, height: 630, fonts };
  } finally {
    await card.close();
  }
}
