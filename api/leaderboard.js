import { neon } from '@neondatabase/serverless';

const games = new Set(['glyph-serpent', 'space-invaders', 'dino-run']);
const allowedOrigins = new Set([
  'https://tryraisins.dev',
  'https://www.tryraisins.dev',
  'https://tryraisins.github.io',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

const respond = (res, status, payload) => res.status(status).json(payload);

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.has(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'POST'].includes(req.method)) return respond(res, 405, { error: 'Method not allowed' });
  if (!process.env.DATABASE_URL) return respond(res, 503, { error: 'Leaderboard database is not configured' });

  const sql = neon(process.env.DATABASE_URL);
  try {
    if (req.method === 'GET') {
      const game = Array.isArray(req.query?.game) ? req.query.game[0] : req.query?.game;
      if (!games.has(game)) return respond(res, 400, { error: 'Unsupported game' });
      const rows = await sql`
        select name, score, level
        from game_scores
        where game = ${game}
        order by score desc, level desc, created_at asc
        limit 10
      `;
      return respond(res, 200, rows);
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const game = String(body.game || '');
    const name = String(body.name || '').replace(/[^a-z0-9]/gi, '').slice(0, 5).toUpperCase();
    const score = Number(body.score);
    const level = Number(body.level);
    if (!games.has(game) || !/^[A-Z0-9]{1,5}$/.test(name) || !Number.isSafeInteger(score) || score < 0 || score > 10000000 || !Number.isSafeInteger(level) || level < 1 || level > 100000) {
      return respond(res, 400, { error: 'Invalid score submission' });
    }
    await sql`
      insert into game_scores (game, name, score, level)
      values (${game}, ${name}, ${score}, ${level})
    `;
    return respond(res, 201, { saved: true });
  } catch (error) {
    console.error('Leaderboard API error', error);
    return respond(res, 500, { error: 'Leaderboard request failed' });
  }
}
