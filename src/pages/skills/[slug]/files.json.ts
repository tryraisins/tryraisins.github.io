import type { APIRoute } from 'astro';
import { catalog, type Skill } from '../../../lib/skills';
import { sourceTreeUrl } from '../../../lib/skill-prompt';

// Hash manifest referenced by install prompts so agents can verify a complete copy.
export function getStaticPaths() {
  return catalog.skills.map((skill) => ({ params: { slug: skill.slug }, props: { skill } }));
}

export const GET: APIRoute = ({ props }) => {
  const { skill } = props as { skill: Skill };
  const raw = `https://raw.githubusercontent.com/${catalog.repository}/${catalog.sourceRevision}/skills/${skill.name}`;
  const body = {
    name: skill.name,
    sourceRevision: catalog.sourceRevision,
    source: sourceTreeUrl(skill.name, catalog.sourceRevision),
    fileCount: skill.fileCount,
    files: skill.files.map((file) => ({ ...file, url: `${raw}/${file.path.split('/').map(encodeURIComponent).join('/')}` })),
  };
  return new Response(JSON.stringify(body, null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
};
