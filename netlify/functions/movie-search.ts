// netlify/functions/movie-search.ts
import type { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  try {
    const { query } = event.queryStringParameters || {};

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query parameter is required' }),
      };
    }

    const response = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        s: query,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to search movies' }),
    };
  }
};
