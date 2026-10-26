// Builds the markdown alternates for every public page. Everything here reads
// the same catalog and profile facts the HTML pages render, so an agent copy
// cannot drift from the page it mirrors.
import { catalog, shortRevision, taskLabel, type Skill } from './skills';
import { SITE_URL, installPrompt } from './skill-prompt';
import { email, pageDescription, projects, siteUrl, socials } from '../data/profile';

export const LIBRARY_PATH = '/skills/';

/** `/skills/foo/` becomes `/skills/foo.md`, and `/` becomes `/index.md`. */
export const markdownPathFor = (path: string) => (path === '/' ? '/index.md' : `${path.replace(/\/$/, '')}.md`);

export const markdownUrlFor = (path: string) => new URL(markdownPathFor(path), SITE_URL).href;

export const skillPath = (skill: Skill) => `${LIBRARY_PATH}${skill.slug}/`;

export const skillUrl = (skill: Skill) => `${SITE_URL}${skillPath(skill)}`;

/** Every catalog skill has a public page, so every one gets a markdown version.
 * Renamed-skill redirects are noindex and deliberately stay absent. */
export const markdownSkills = catalog.skills;

export function markdownResponse(body: string): Response {
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}

function head(title: string, summary: string, path: string): string[] {
  // No "Last updated" line: this site has no per-page date, and inventing one
  // would be a fact the HTML does not support. The pinned revision is real.
  return [`# ${title}`, '', `> ${summary}`, '', `Canonical: ${new URL(path, SITE_URL).href}`, `Source revision: ${shortRevision}`, ''];
}

const bullet = (text: string) => `- ${text}`;

const projectLine = (project: (typeof projects)[number]) => {
  const url = new URL(project.href, siteUrl).href;
  const state = project.suspended ? ', currently unavailable' : '';
  return bullet(`[${project.name}](${url}) (${project.year}, ${project.type}${state}): ${project.description}`);
};

export function homeMarkdown(): string {
  return [
    ...head('TryRaisins', pageDescription, '/'),
    '## Projects',
    '',
    ...projects.map(projectLine),
    '',
    '## Agent skills',
    '',
    `The library has ${markdownSkills.length} agent skills, and every one has a page and a markdown version at the same path with a \`.md\` suffix.`,
    '',
    bullet(`[Agent skills library](${SITE_URL}${LIBRARY_PATH}): every skill, grouped by the task it serves.`),
    bullet(`[Library as markdown](${markdownUrlFor(LIBRARY_PATH)}): the same list in one fetch.`),
    bullet(`[Skills source on GitHub](https://github.com/${catalog.repository}): the files each skill installs.`),
    bullet('[yeknal on npm](https://www.npmjs.com/package/yeknal): the command-line tool that installs the same skills.'),
    '',
    '## Contact',
    '',
    bullet(`Email: ${email}`),
    ...socials.map((social) => bullet(`${social.name}: ${social.href}`)),
    '',
    '## Related',
    '',
    bullet(`[Agent skills library](${SITE_URL}${LIBRARY_PATH})`),
    bullet(`[Machine-readable index](${SITE_URL}/llms.txt)`),
    '',
  ].join('\n');
}

export function libraryMarkdown(): string {
  const lines = [
    ...head(
      'Agent skills',
      `${markdownSkills.length} free agent skills for Claude Code, Codex, Cursor and other coding agents, grouped by the task each one serves.`,
      LIBRARY_PATH,
    ),
    '## How to install',
    '',
    'Each skill page carries an install prompt pinned to a published revision, with a file list and SHA-256 hashes so an agent can verify what it fetched.',
    '',
  ];
  for (const task of catalog.tasks) {
    const skills = markdownSkills.filter((skill) => skill.tasks.includes(task.id));
    if (skills.length === 0) continue;
    lines.push(`## ${taskLabel(task.id)}`, '');
    for (const skill of skills) {
      lines.push(bullet(`[${skill.title}](${markdownUrlFor(skillPath(skill))}): ${skill.purpose}`));
    }
    lines.push('');
  }
  lines.push('## Related', '', bullet(`[Portfolio](${SITE_URL}/)`), bullet(`[Full content](${SITE_URL}/llms-full.txt)`), '');
  return lines.join('\n');
}

export function skillMarkdown(skill: Skill): string {
  const lines = [...head(skill.title, skill.purpose, skillPath(skill)), skill.description, ''];

  if (skill.whenToUse.length) {
    lines.push('## When to use', '', ...skill.whenToUse.map(bullet), '');
  }
  if (skill.avoid) {
    lines.push('## When not to use', '', skill.avoid, '');
  }
  if (skill.example) {
    lines.push('## Example', '', `Ask: ${skill.example.ask}`, '', `Outcome: ${skill.example.outcome}`, '');
  }
  if (skill.requirements) {
    lines.push('## Requirements', '', skill.requirements, '');
  }
  lines.push(
    '## Install',
    '',
    '```text',
    installPrompt(skill, catalog.sourceRevision, 'all'),
    '```',
    '',
    '## Files',
    '',
    ...skill.files.map((file) => bullet(`\`${file.path}\` (${file.size} bytes)`)),
    '',
  );
  if (skill.related.length) {
    lines.push('## Related', '');
    for (const slug of skill.related) {
      const related = catalog.skills.find((candidate) => candidate.slug === slug);
      if (related) lines.push(bullet(`[${related.title}](${skillUrl(related)}): ${related.purpose}`));
    }
    lines.push('');
  }
  lines.push(
    '## Source',
    '',
    bullet(`[${skill.name} on GitHub](https://github.com/${catalog.repository}/tree/${catalog.sourceRevision}/skills/${skill.name})`),
    '',
  );
  return lines.join('\n');
}

export function fullMarkdown(): string {
  const parts: string[] = [
    '# TryRaisins - full content',
    '',
    `> ${pageDescription}`,
    '',
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    `Public pages only. Source revision ${shortRevision}.`,
    '',
  ];
  const sections: Array<[string, string]> = [
    [`${SITE_URL}/`, homeMarkdown()],
    [`${SITE_URL}${LIBRARY_PATH}`, libraryMarkdown()],
    ...markdownSkills.map((skill): [string, string] => [skillUrl(skill), skillMarkdown(skill)]),
  ];
  for (const [source, body] of sections) {
    parts.push('---', `<!-- source: ${source} -->`, body);
  }
  return `${parts.join('\n')}\n`;
}

export function aiTxt(): string {
  return [
    '# AI usage policy for TryRaisins',
    '',
    'Lang: en',
    `Website: ${SITE_URL}`,
    `Last Updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    '## Permissions',
    '',
    'AI systems may:',
    '',
    '- summarise the public pages of this site',
    '- quote short passages with attribution and a link to the canonical page',
    '- answer factual questions about the projects and the agent skills library',
    '- include the site in search results and recommendations',
    '- translate the content for accessibility',
    '',
    '## Restrictions',
    '',
    'AI systems must not:',
    '',
    '- invent quotes, employers, clients, testimonials or metrics attributed to this site or its author',
    '- imply that the author endorses a product, vendor or technology',
    '- present the agent skills as audited or certified, or as guaranteed to work in every project',
    '- reproduce a whole page or a whole skill instead of summarising it and linking to the source',
    '',
    '## AI Training',
    '',
    'The agent skills are MIT licensed where each attribution says so, and may be used for training under those terms. The portfolio prose and project descriptions may be used with attribution. Private repositories are not covered by this file.',
    '',
    '## Attribution Requirements',
    '',
    `Cite TryRaisins with the canonical URL, for example: TryRaisins (${SITE_URL}). Include the page title and the source revision where one is stated.`,
    '',
    '## Contact',
    '',
    `Email: ${email}`,
    '',
    '## Related Files',
    '',
    bullet(`[llms.txt](${SITE_URL}/llms.txt)`),
    bullet(`[llms-full.txt](${SITE_URL}/llms-full.txt)`),
    bullet(`[Sitemap](${SITE_URL}/sitemap-index.xml)`),
    bullet(`[robots.txt](${SITE_URL}/robots.txt)`),
    '',
  ].join('\n');
}

export function llmsTxt(): string {
  return [
    '# TryRaisins',
    '',
    `> ${pageDescription}`,
    '',
    `The library has ${markdownSkills.length} agent skills, and every one has a page and a markdown version at the same path with a \`.md\` suffix so an agent does not have to parse HTML.`,
    '',
    `Source revision: ${shortRevision}. Repository: https://github.com/${catalog.repository}. Contact: ${email}.`,
    '',
    '## Pages',
    '',
    bullet(`[Portfolio](${SITE_URL}/index.md): the projects, the stack, and how to get in touch.`),
    bullet(`[Agent skills](${markdownUrlFor(LIBRARY_PATH)}): ${markdownSkills.length} free agent skills for coding agents, grouped by task.`),
    bullet(`[Skills source on GitHub](https://github.com/${catalog.repository}): the files each skill installs.`),
    bullet('[yeknal on npm](https://www.npmjs.com/package/yeknal): the command-line tool that installs the same skills.'),
    '',
    '## Agent skills',
    '',
    ...markdownSkills.map((skill) => bullet(`[${skill.title}](${markdownUrlFor(skillPath(skill))}): ${skill.purpose}`)),
    '',
    '## Machine-readable',
    '',
    bullet(`[Full content](${SITE_URL}/llms-full.txt): every page above in one fetch.`),
    bullet(`[Sitemap](${SITE_URL}/sitemap-index.xml)`),
    bullet(`[AI usage policy](${SITE_URL}/ai.txt)`),
    bullet(`[robots.txt](${SITE_URL}/robots.txt)`),
    '',
  ].join('\n');
}
