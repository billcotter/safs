// netlify/functions/movie-search.ts
/**
 * @fileoverview Movie search serverless function
 * @module functions/movie-search
 */

import type { Handler, HandlerEvent } from '@netlify/functions';
import axios from 'axios';

const CACHE_DURATION = 3600; // 1 hour in seconds

export const handler: Handler = async (event: HandlerEvent) => {
  // Validate request method
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { query } = event.queryStringParameters || {};

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query parameter is required' }),
      };
    }

    // Add proper cache headers
    const headers = {
      'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}`,
      'Content-Type': 'application/json',
      // Add security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    };

    const response = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        s: query,
      },
      timeout: 5000, // 5 second timeout
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Movie search error:', error);

    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: 'Failed to search movies',
        message: error.response?.data?.message || 'Internal server error',
      }),
    };
  }
};
