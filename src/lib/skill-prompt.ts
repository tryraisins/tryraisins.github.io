// Shared by the static pages and the browser scripts so a copied prompt always
// matches the one rendered on the skill page.
export type InstallScope = 'project' | 'all';

export interface PromptSkill {
  name: string;
  slug: string;
  fileCount: number;
}

export const SITE_URL = 'https://tryraisins.dev';
export const REPOSITORY_URL = 'https://github.com/tryraisins/MD_Files';

export const sourceTreeUrl = (name: string, revision: string) => `${REPOSITORY_URL}/tree/${revision}/skills/${name}`;
export const manifestUrl = (slug: string) => `${SITE_URL}/skills/${slug}/files.json`;

export function installPrompt(skill: PromptSkill, revision: string, scope: InstallScope): string {
  const { name, slug, fileCount } = skill;
  const files = fileCount === 1 ? '1 file' : `${fileCount} files`;
  const target = scope === 'project'
    ? `2. Copy skills/${name} into the project-level skills folder your agent reads at the root of this repository, such as .agents/skills/${name} or .claude/skills/${name}.`
    : `2. Copy skills/${name} into the user-level skills folder your agent reads, such as ~/.agents/skills/${name} or ~/.claude/skills/${name}, so it is available in every project.`;
  return [
    `Install the Agent Skill "${name}" ${scope === 'project' ? 'in this project only' : 'for all my projects'}.`,
    '',
    `Source, pinned to a published revision (${files}):`,
    sourceTreeUrl(name, revision),
    `File list with SHA-256 hashes: ${manifestUrl(slug)}`,
    '',
    '1. Fetch that exact folder, including every supporting file and license notice. One way to do it:',
    // autocrlf=false keeps Windows checkouts byte-identical to the listed hashes.
    `   git clone -c core.autocrlf=false --filter=blob:none --no-checkout ${REPOSITORY_URL}.git yeknal-skill-src`,
    `   git -C yeknal-skill-src sparse-checkout set --no-cone /skills/${name}/`,
    `   git -C yeknal-skill-src checkout ${revision}`,
    target,
    `3. If a ${name} folder already exists there and any file differs from the source, stop and show me the differences instead of overwriting it. Do not change or remove any other skill.`,
    `4. Check that ${fileCount === 1 ? 'the file matches its listed hash' : `all ${files} match the listed hashes`}, then delete the temporary yeknal-skill-src checkout.`,
  ].join('\n');
}
