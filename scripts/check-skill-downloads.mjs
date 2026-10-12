// Checks the skill download API end to end against a running deployment.
// Usage: node scripts/check-skill-downloads.mjs [api-url] [--record]
// --record also posts one real install row, so leave it off against production.
const url = process.argv.slice(2).find((arg) => !arg.startsWith('--')) || process.env.SKILL_STATS_URL || 'https://skill-downloads.tryraisins.workers.dev';
const record = process.argv.includes('--record');
const origin = 'https://tryraisins.dev';
let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
};
const json = async (input, init) => (await fetch(input, init)).json();

// Independent source totals, computed the same way the API should.
const today = new Date().toISOString().slice(0, 10);
const npm = await json(`https://api.npmjs.org/downloads/range/2026-03-05:${today}/yeknal`);
const npmTotal = npm.downloads.reduce((sum, entry) => sum + entry.downloads, 0);
const skillsSh = await json('https://skills.sh/api/search?q=yeknal&limit=500');
const skillsShTotal = skillsSh.skills.filter((skill) => skill.source === 'tryraisins/md_files').reduce((sum, skill) => sum + skill.installs, 0);
console.log(`npm yeknal all time: ${npmTotal}`);
console.log(`skills.sh tryraisins/md_files installs: ${skillsShTotal}`);

const preflight = await fetch(url, { method: 'OPTIONS', headers: { Origin: origin } });
check('OPTIONS allows the site origin', preflight.status === 204 && preflight.headers.get('access-control-allow-origin') === origin, `status ${preflight.status}`);

const get = await fetch(url, { headers: { Origin: origin } });
const body = await get.json();
check('GET returns a combined total', get.status === 200 && Number.isSafeInteger(body.total), `status ${get.status}, body ${JSON.stringify(body)}`);
check('GET exposes no per-source fields', Object.keys(body).join() === 'total');
check('GET is cacheable', /max-age/.test(get.headers.get('cache-control') || ''), get.headers.get('cache-control'));
check('GET sends CORS for the site', get.headers.get('access-control-allow-origin') === origin);
if (get.status === 200) {
  // The Worker refreshes its saved total hourly, so allow npm/skills.sh to have moved on since.
  const site = body.total - npmTotal - skillsShTotal;
  console.log(`implied site copies: ${site} (can be slightly negative while the saved total is up to an hour old)`);
  check('total is in line with npm + skills.sh', site > -500, `total ${body.total}`);
}

for (const [label, payload] of [
  ['rejects an unknown skill name', JSON.stringify({ skill: 'x', scope: 'project' })],
  ['rejects an unknown scope', JSON.stringify({ skill: 'yeknal-review', scope: 'foo' })],
  ['rejects malformed JSON', '{not json'],
]) {
  const response = await fetch(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'text/plain' }, body: payload });
  check(`POST ${label}`, response.status === 400, `status ${response.status}`);
}

if (record) {
  const response = await fetch(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'text/plain' }, body: JSON.stringify({ skill: 'yeknal-review', scope: 'project' }) });
  check('POST records a valid install', response.status === 201, `status ${response.status}`);
}

console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
