// Production asset renderer for Playwright CLI's run-code --filename option.
// Open the built homepage first; run from the repository root.
async (page) => {
  const source = new URL('/', page.url()).href;
  const card = await page.context().newPage();
  try {
    await card.setViewportSize({ width: 1200, height: 630 });
    await card.emulateMedia({ reducedMotion: 'reduce' });
    await card.addInitScript(() => {
      let seed = 42;
      Math.random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
      };
    });
    // Install the card layout before the scene mounts, preserving real geometry
    // and launch positions without changing the production webpage.
    await card.route(source, async route => {
      const response = await route.fetch();
      const html = await response.text();
      await route.fulfill({ response, body: html.replace('</head>', `<style>
        html, body { width:1200px; height:630px; overflow:hidden; }
        .play-world { min-height:630px; --play-page-margin:72px; }
        #play-top .play-hero { height:630px; min-height:630px; padding:44px 72px 50px; gap:0; }
        #play-top .play-hero-header { min-height:40px; }
        #play-top .play-hero-header > a, .play-skip, #play-top .play-desk, #play-top .play-contact, .play-sr-status { display:none; }
        #play-top .play-hero-index { font-size:24px; font-weight:500; text-transform:none; letter-spacing:0; }
        #play-top .play-hero h1 { max-width:1020px; margin:186px 0 0; font-size:88px; line-height:1.05; letter-spacing:-.03em; text-wrap:initial; }
        #play-top .play-intro { margin-top:auto; width:100%; display:flex; justify-content:space-between; align-items:center; }
        #play-top .play-intro > p { max-width:none; font-size:24px; color:var(--play-ink); }
        #play-top .play-hero-actions { display:none; }
        .og-domain { min-height:52px; padding:8px 18px; display:inline-flex; align-items:center; background:var(--play-yellow); border:1px solid var(--play-ink); box-shadow:3px 3px 0 var(--play-ink); font-size:26px; font-weight:600; }
        #play-top .play-drawing-hero-a { top:112px; left:-28px; width:200px; }
        #play-top .play-drawing-hero-b { top:326px; bottom:auto; right:44px; width:190px; opacity:.65; }
      </style></head>`) });
    });
    await card.goto(source);
    await card.evaluate(() => document.fonts.ready);
    await card.waitForFunction(() => document.querySelector('[data-battlefield]')?.dataset.topState);
    await card.evaluate(() => {
      const index = document.querySelector('.play-hero-index');
      const name = index.textContent.split('/')[0].trim();
      const brand = document.querySelector('meta[property="og:site_name"]').content;
      index.textContent = `${name} / ${brand}`;
      const title = document.querySelector('.play-hero h1');
      const headline = title.textContent.trim();
      const breakAt = headline.lastIndexOf(' for ');
      if (breakAt >= 0) title.replaceChildren(document.createTextNode(headline.slice(0, breakAt)), document.createElement('br'), document.createTextNode(headline.slice(breakAt + 1)));
      const intro = document.querySelector('.play-intro');
      const role = document.createElement('p');
      role.textContent = 'Software engineer / Lagos, Nigeria';
      const domain = document.createElement('span');
      domain.className = 'og-domain';
      domain.textContent = 'tryraisins.dev';
      intro.replaceChildren(role, domain);
    });
    const fonts = await card.evaluate(() => [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family));
    if (!fonts.includes('Bricolage Grotesque') || !fonts.includes('DM Sans')) throw Error('Required portfolio fonts did not load');
    await card.screenshot({ path: 'public/og-notebook.png', animations: 'disabled' });
    return { source, output: 'public/og-notebook.png', width: 1200, height: 630, fonts };
  } finally {
    await card.close();
  }
}
