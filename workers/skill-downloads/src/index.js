// Combined install count for tryraisins.dev/skills: prompt copies recorded by the
// site, plus npm downloads of yeknal and skills.sh installs. Only the sum leaves here.
const allowedOrigins = new Set([
  'https://tryraisins.dev',
  'https://www.tryraisins.dev',
  'https://tryraisins.github.io',
]);
// Any local dev or preview server (astro dev, astro preview, test runs) can read
// the total. Nothing here is private, and posted installs are validated anyway.
const localOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/;
const isAllowed = (origin) => !!origin && (allowedOrigins.has(origin) || localOrigin.test(origin));
const NPM_PACKAGE = 'yeknal';
const NPM_FIRST_PUBLISHED = '2026-03-05';
const SKILLS_SH_SOURCE = 'tryraisins/md_files';
const SKILLS_SH_URL = `https://skills.sh/api/search?q=${NPM_PACKAGE}&limit=500`;
const FRESH_MS = 60 * 60 * 1000;

const day = (date) => date.toISOString().slice(0, 10);

const getJson = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response.json();
};

// npm's range endpoint accepts at most 18 months per request, so walk forward in windows.
async function npmDownloads() {
  const today = new Date();
  let total = 0;
  for (let start = new Date(`${NPM_FIRST_PUBLISHED}T00:00:00Z`); start <= today;) {
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 17);
    const last = end < today ? end : today;
    const { downloads } = await getJson(`https://api.npmjs.org/downloads/range/${day(start)}:${day(last)}/${NPM_PACKAGE}`);
    if (!Array.isArray(downloads)) throw new Error('npm returned no download range');
    total += downloads.reduce((sum, entry) => sum + entry.downloads, 0);
    start = new Date(last);
    start.setUTCDate(start.getUTCDate() + 1);
  }
  return total;
}

async function skillsShInstalls(url = SKILLS_SH_URL) {
  const { skills } = await getJson(url);
  if (!Array.isArray(skills)) throw new Error('skills.sh returned no skills');
  return skills
    .filter((skill) => skill.source === SKILLS_SH_SOURCE && Number.isSafeInteger(skill.installs))
    .reduce((sum, skill) => sum + skill.installs, 0);
}

// Returns the total, when it was last recomputed and when it last changed, so the
// page can tell "npm has not published" apart from "the counter is stuck".
async function currentTotal(db, skillsShUrl) {
  const saved = await db.prepare('select total, updated_at, changed_at from download_total where id = 1').first();
  const carried = saved
    ? { total: saved.total, updated: saved.updated_at, changed: saved.changed_at ?? saved.updated_at }
    : null;
  if (carried && Date.now() - saved.updated_at < FRESH_MS) return carried;
  try {
    const [site, npm, skillsSh] = await Promise.all([
      db.prepare('select count(*) as count from skill_installs').first('count'),
      npmDownloads(),
      skillsShInstalls(skillsShUrl),
    ]);
    const total = site + npm + skillsSh;
    const now = Date.now();
    const changed = carried && carried.total === total ? carried.changed : now;
    await db.prepare('insert into download_total (id, total, updated_at, changed_at) values (1, ?1, ?2, ?3) on conflict (id) do update set total = ?1, updated_at = ?2, changed_at = ?3')
      .bind(total, now, changed).run();
    return { total, updated: now, changed };
  } catch (error) {
    // A missing source would understate the total, so fall back to the last complete one.
    console.error('Skill download count failed', error);
    if (carried) return carried;
    throw error;
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    });
    if (isAllowed(origin)) headers.set('Access-Control-Allow-Origin', origin);
    const respond = (status, payload) => new Response(JSON.stringify(payload), { status, headers });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    if (request.method === 'POST') {
      let body;
      try {
        body = JSON.parse(await request.text());
      } catch {
        return respond(400, { error: 'Invalid install record' });
      }
      const skill = String(body?.skill || '');
      const scope = String(body?.scope || '');
      if (!/^yeknal-[a-z0-9-]{1,80}$/.test(skill) || !['project', 'all'].includes(scope)) {
        return respond(400, { error: 'Invalid install record' });
      }
      await env.DB.prepare('insert into skill_installs (skill, scope) values (?1, ?2)').bind(skill, scope).run();
      return respond(201, { saved: true });
    }

    if (request.method !== 'GET') return respond(405, { error: 'Method not allowed' });
    try {
      const summary = await currentTotal(env.DB, env.SKILLS_SH_URL);
      headers.set('Cache-Control', 'public, max-age=300');
      return respond(200, summary);
    } catch {
      return respond(502, { error: 'Download count unavailable' });
    }
  },
};
