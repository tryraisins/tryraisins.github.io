// Loads the catalog snapshot written by MD_Files' tools/sync-portfolio.js and
// rejects anything malformed or hand-edited, so a bad snapshot fails the build
// instead of deploying broken skill pages.
import { createHash } from 'node:crypto';
import raw from '../data/skills-catalog.json';

export interface SkillFile { path: string; sha256: string; size: number }
export interface Skill {
  name: string;
  slug: string;
  title: string;
  purpose: string;
  description: string;
  tasks: string[];
  featuredRank: number;
  compatibility: boolean;
  internal: boolean;
  whenToUse: string[];
  avoid: string | null;
  requirements: string | null;
  example: { ask: string; outcome: string } | null;
  attribution: { credit: string; license: string | null; sourceUrl: string | null };
  related: string[];
  version: string;
  fileCount: number;
  totalBytes: number;
  files: SkillFile[];
}
export interface Task { id: string; label: string; description: string; count: number }
export interface Catalog {
  schemaVersion: 1;
  repository: string;
  sourceRevision: string;
  catalogCommit: string;
  cliVersion: string;
  counts: { skills: number; internal: number };
  tasks: Task[];
  startingPoints: { task: string; skill: string }[];
  redirects: { from: string; to: string }[];
  skills: Skill[];
  snapshotHash: string;
}

function fail(message: string): never {
  throw new Error(`Invalid src/data/skills-catalog.json: ${message}. Re-run the MD_Files sync instead of editing the snapshot.`);
}

function validate(input: unknown): Catalog {
  const data = input as Catalog;
  if (!data || data.schemaVersion !== 1) fail('unsupported schemaVersion');
  const { snapshotHash, ...rest } = data;
  const expected = createHash('sha256').update(JSON.stringify(rest)).digest('hex');
  if (snapshotHash !== expected) fail('snapshotHash does not match its contents');
  const sha = /^[a-f0-9]{40}$/;
  if (!sha.test(data.sourceRevision) || !sha.test(data.catalogCommit)) fail('revisions must be full commit SHAs');
  if (!Array.isArray(data.skills) || !data.skills.length) fail('no skills');
  if (data.counts.skills !== data.skills.length) fail('skill count mismatch');
  const taskIds = new Set(data.tasks.map((task) => task.id));
  const slugs = new Set<string>();
  for (const skill of data.skills) {
    const where = skill?.name ?? 'unnamed skill';
    if (!/^yeknal-[a-z0-9-]+$/.test(skill.name) || skill.slug !== skill.name.slice('yeknal-'.length)) fail(`${where} has an invalid name or slug`);
    if (slugs.has(skill.slug)) fail(`duplicate slug ${skill.slug}`);
    slugs.add(skill.slug);
    for (const key of ['title', 'purpose', 'description'] as const) if (typeof skill[key] !== 'string' || !skill[key].trim()) fail(`${where} is missing ${key}`);
    if (!skill.files.some((file) => file.path === 'SKILL.md')) fail(`${where} has no SKILL.md`);
    if (skill.fileCount !== skill.files.length) fail(`${where} file count mismatch`);
    for (const file of skill.files) if (!/^[a-f0-9]{64}$/.test(file.sha256) || file.path.includes('..')) fail(`${where} has an invalid file entry`);
    for (const task of skill.tasks) if (!taskIds.has(task)) fail(`${where} uses unknown task ${task}`);
    if (!skill.attribution?.credit) fail(`${where} has no attribution`);
  }
  for (const skill of data.skills) for (const related of skill.related) if (!slugs.has(related)) fail(`${skill.name} links to missing ${related}`);
  for (const point of data.startingPoints) if (!slugs.has(point.skill)) fail(`starting point links to missing ${point.skill}`);
  for (const redirect of data.redirects) {
    if (!slugs.has(redirect.to) || slugs.has(redirect.from)) fail(`invalid redirect ${redirect.from}`);
  }
  return data;
}

export const catalog = validate(raw);
export const skillsBySlug = new Map(catalog.skills.map((skill) => [skill.slug, skill]));
export const taskLabel = (id: string) => catalog.tasks.find((task) => task.id === id)?.label ?? id;
export const shortRevision = catalog.sourceRevision.slice(0, 7);
export const fileLabel = (count: number) => (count === 1 ? '1 file' : `${count} files`);
export const licenseUrl = (skill: Skill) => {
  const notice = skill.files.find((file) => /^LICEN[CS]E/i.test(file.path));
  return notice ? `https://github.com/${catalog.repository}/blob/${catalog.sourceRevision}/skills/${skill.name}/${notice.path}` : null;
};
