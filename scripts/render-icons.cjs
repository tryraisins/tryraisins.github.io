// Renders the TryRaisins app icons and favicon from the self-hosted Bricolage
// face. Run from the repository root: node scripts/render-icons.cjs
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const font = fs.readFileSync(path.join(root, 'public/fonts/bricolage-grotesque-latin.woff2')).toString('base64');
const html = (size) => `<!doctype html><style>
  @font-face { font-family: B; font-weight: 600; src: url(data:font/woff2;base64,${font}) format('woff2'); }
  html, body { margin: 0; width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
  .icon { width: 100%; height: 100%; box-sizing: border-box; display: grid; place-items: center; background: #f0ce4e;
    border-radius: ${size * 0.18}px; border: ${Math.max(1, size * 0.035)}px solid #171719; }
  span { font: 600 ${size * 0.56}px/1 B, sans-serif; letter-spacing: -.05em; color: #171719; transform: translateY(-${size * 0.04}px); }
</style><div class="icon"><span>tr</span></div>`;

const targets = [['public/favicon.png', 32], ['public/apple-touch-icon.png', 180], ['public/logo192.png', 192], ['public/logo512.png', 512]];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  for (const [file, size] of targets) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(html(size));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(root, file), omitBackground: true });
    await page.close();
  }
  await browser.close();
  // favicon.ico wraps the 32px PNG (ICO allows embedded PNG data).
  const png = fs.readFileSync(path.join(root, 'public/favicon.png'));
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
  fs.writeFileSync(path.join(root, 'public/favicon.ico'), Buffer.concat([header, png]));
  console.log('icons written:', targets.map(([file]) => file).join(', '), 'public/favicon.ico');
})();
