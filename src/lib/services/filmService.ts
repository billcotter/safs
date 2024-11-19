import axios from 'axios';
import type { Film, EnrichedFilm } from '../../types/films';

export async function enrichFilmData(film: Film): Promise<EnrichedFilm> {
  try {
    // OMDB API Call
    const omdbResponse = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: import.meta.env.OMDB_API_KEY,
        t: film.title,
        y: new Date(film.releaseDate).getFullYear(),
      },
    });

    let tmdbData = null;
    try {
      // TMDB API calls - wrapped in separate try-catch to make it optional
      const tmdbSearchResponse = await axios.get(
        'https://api.themoviedb.org/3/search/movie',
        {
          params: {
            api_key: import.meta.env.TMDB_API_KEY,
            query: film.title,
            year: new Date(film.releaseDate).getFullYear(),
          },
        }
      );

      if (tmdbSearchResponse.data.results?.length > 0) {
        const filmId = tmdbSearchResponse.data.results[0].id;
        const tmdbDetailResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${filmId}`,
          {
            params: {
              api_key: import.meta.env.TMDB_API_KEY,
              append_to_response: 'credits,images',
            },
          }
        );
        tmdbData = tmdbDetailResponse.data;
      }
    } catch (tmdbError) {
      console.warn(`TMDB enrichment failed for ${film.title}, falling back to OMDB only:`, tmdbError);
    }

    return {
      ...film,
      year: omdbResponse.data.Year,
      rated: omdbResponse.data.Rated,
      runtime: omdbResponse.data.Runtime,
      genre: omdbResponse.data.Genre?.split(', ') || [],
      director: omdbResponse.data.Director,
      actors: omdbResponse.data.Actors?.split(', ') || [],
      plot: omdbResponse.data.Plot,
      poster: omdbResponse.data.Poster,
      posterPathTMDB: tmdbData?.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
        : undefined,
      backdropPath: tmdbData?.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
        : undefined,
      imdbRating: omdbResponse.data.imdbRating,
      imdbID: omdbResponse.data.imdbID,
      tagline: tmdbData?.tagline,
      voteAverage: tmdbData?.vote_average,
      productionCompanies: tmdbData?.production_companies?.map(
        (company: any) => company.name
      ),
    };
  } catch (error) {
    console.error(`Error enriching film data for ${film.title}:`, error);
    // Return basic film data if enrichment completely fails
    return {
      ...film,
      year: new Date(film.releaseDate).getFullYear().toString(),
      rated: 'N/A',
      runtime: 'N/A',
      genre: [],
      director: 'N/A',
      actors: [],
      plot: 'N/A',
      poster: 'N/A',
      imdbRating: 'N/A',
      imdbID: 'N/A',
    } as EnrichedFilm;
  }
}

export async function enrichFilmList(films: Film[]): Promise<EnrichedFilm[]> {
  const enrichedFilms = await Promise.all(
    films.map(async (film) => {
      try {
        return await enrichFilmData(film);
      } catch (error) {
        console.error(`Failed to enrich ${film.title}:`, error);
        // Return basic film data if enrichment fails
        return {
          ...film,
          year: new Date(film.releaseDate).getFullYear().toString(),
          rated: 'N/A',
          runtime: 'N/A',
          genre: [],
          director: 'N/A',
          actors: [],
          plot: 'N/A',
          poster: 'N/A',
          imdbRating: 'N/A',
          imdbID: 'N/A',
        } as EnrichedFilm;
      }
    })
  );

  return enrichedFilms;
}
