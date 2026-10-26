import type { APIRoute } from 'astro';
import { homeMarkdown, markdownResponse } from '../lib/markdown';

export const GET: APIRoute = () => markdownResponse(homeMarkdown());
