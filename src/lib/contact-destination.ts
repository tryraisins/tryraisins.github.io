import { randomBytes } from 'node:crypto';

// Scraper deterrence, not encryption: keep the address out of the raw HTML and
// client bundle. The browser decodes it only after a real click opens the reveal.
export function obscureContactDestination(destination: string) {
  const mask = randomBytes(16);
  const value = Buffer.from(destination, 'utf8');
  const masked = value.map((byte, index) => byte ^ mask[index % mask.length]);
  return Buffer.concat([mask, masked]).toString('base64');
}
