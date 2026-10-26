import type { APIRoute } from 'astro';
import { catalog } from '../lib/skills';
import { SITE_URL } from '../lib/skill-prompt';

// A plain index of the site for agents that read /llms.txt. It lists the same
// public pages the sitemap does and is built from the synced skills catalog.
export const GET: APIRoute = () => {
  const skills = catalog.skills
    .filter((skill) => !skill.internal)
    .map((skill) => `- [${skill.title}](${SITE_URL}/skills/${skill.slug}/): ${skill.purpose}`);
  const body = [
    '# TryRaisins',
    '',
    '> TryRaisins is a software engineer whose work is used by multiple FTSE 100 companies across four continents. TryRaisins builds web products and developer tools, mostly with Next.js, Node.js and Python, maintains and contributes to open-source projects, and publishes a free library of agent skills for coding agents such as Claude Code, Codex and Cursor.',
    '',
    '## Pages',
    '',
    `- [Portfolio](${SITE_URL}/): selected projects, including Terror Tracker, SlopLens, QuickBillz, Talent Hunter and StreamSlip, plus contact details.`,
    `- [Agent skills](${SITE_URL}/skills/): the full skills library with install prompts for one project or every project.`,
    `- [Skills source on GitHub](https://github.com/${catalog.repository}): the files each skill installs.`,
    `- [yeknal on npm](https://www.npmjs.com/package/yeknal): the command-line tool that installs the same skills.`,
    '',
    '## Agent skills',
    '',
    ...skills,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
