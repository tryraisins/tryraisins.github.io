import type { APIRoute } from 'astro';
import { aiTxt } from '../lib/markdown';

export const GET: APIRoute = () => new Response(aiTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
