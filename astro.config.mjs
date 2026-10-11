import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'https://tryraisins.dev';
// Renamed skills keep a noindex redirect page; keep those out of the sitemap.
const { redirects } = JSON.parse(readFileSync(new URL('./src/data/skills-catalog.json', import.meta.url), 'utf8'));
const redirectPages = new Set(redirects.map((redirect) => `${site}/skills/${redirect.from}/`));

export default defineConfig({
  site,
  integrations: [sitemap({ filter: (page) => !redirectPages.has(page) })],
});
