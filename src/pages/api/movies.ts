/**
 * @fileoverview Movies API endpoint
 * @module api/movies
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: 'Movies API endpoint placeholder' }),
    { status: 200 }
  );
};
