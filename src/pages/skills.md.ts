import type { APIRoute } from 'astro';
import { libraryMarkdown, markdownResponse } from '../lib/markdown';

export const GET: APIRoute = () => markdownResponse(libraryMarkdown());
