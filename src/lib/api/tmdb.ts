import { z } from 'zod';
import { fetchWithValidation } from '../utils/api-client';

const TMDBMovieSchema = z.object({
  title: z.string(),
  vote_average: z.number(),
  // ... rest of TMDB fields
});

export async function fetchTMDBMovie(id: string) {
  return fetchWithValidation(
    `https://api.themoviedb.org/3/movie/${id}`,
    TMDBMovieSchema,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
      }
    }
  );
} 