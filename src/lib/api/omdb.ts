import { z } from 'zod';
import { fetchWithValidation } from '../utils/api-client';

const OMDBMovieSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  // ... rest of OMDB fields
});

export async function fetchOMDBMovie(title: string, year: number) {
  return fetchWithValidation(
    `http://www.omdbapi.com/`,
    OMDBMovieSchema,
    {
      params: {
        apikey: process.env.OMDB_API_KEY,
        t: title,
        y: year
      }
    }
  );
} 