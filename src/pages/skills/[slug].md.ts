import type { APIRoute } from 'astro';
import { markdownResponse, markdownSkills, skillMarkdown } from '../../lib/markdown';
import type { Skill } from '../../lib/skills';

// One markdown route per catalog skill, the same set `[slug].astro` publishes.
// Renamed-skill redirects are noindex, so they are absent from both sets.
export function getStaticPaths() {
  return markdownSkills.map((skill) => ({ params: { slug: skill.slug }, props: { skill } }));
}

export const GET: APIRoute = ({ props }) => markdownResponse(skillMarkdown(props.skill as Skill));
