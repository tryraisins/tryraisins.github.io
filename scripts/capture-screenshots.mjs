// One-shot screenshot capture for the portfolio's project cards.
// Uses Puppeteer bundled Chromium. Run once; commit the resulting PNGs.
//
// Usage: node scripts/capture-screenshots.mjs

import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'work');

const SITES = [
  { slug: 'betpicks',       url: 'https://betpicks.tryraisins.dev' },
  { slug: 'talent-hunter',  url: 'https://talenthunter.tryraisins.dev' },
  { slug: 'terror-tracker', url: 'https://terrortracker.tryraisins.dev' },
  { slug: 'echo-list',      url: 'https://echolist.tryraisins.dev' },
  { slug: 'streamslip',     url: 'https://streamslip.tryraisins.dev' },
  { slug: 'iss-tracker',    url: 'https://isstracker.tryraisins.dev' },
];

const VIEWPORT = { width: 1600, height: 1000, deviceScaleFactor: 1 };

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
    ignoreHTTPSErrors: true,
  });

  for (const { slug, url } of SITES) {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    console.log(`→ ${slug}: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      // Small pause so hero animations settle before we snap
      await new Promise((r) => setTimeout(r, 2000));
      const outPath = join(OUT_DIR, `${slug}.png`);
      await page.screenshot({
        path: outPath,
        type: 'png',
        clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      });
      console.log(`   ✓ saved ${outPath}`);
    } catch (err) {
      console.error(`   ✗ ${slug} failed: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
