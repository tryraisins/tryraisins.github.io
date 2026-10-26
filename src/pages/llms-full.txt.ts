import type { APIRoute } from 'astro';
import { fullMarkdown } from '../lib/markdown';

// Every page in llms.txt joined into one fetch, built from the same renderers as
// the individual markdown routes.
export const GET: APIRoute = () =>
  new Response(fullMarkdown(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
