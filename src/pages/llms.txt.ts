import type { APIRoute } from 'astro';
import { llmsTxt } from '../lib/markdown';

// A plain index of the site for agents that read /llms.txt. Built from the same
// catalog and profile facts as the pages, and every link points at a markdown
// version so an agent does not have to parse HTML.
export const GET: APIRoute = () => new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
