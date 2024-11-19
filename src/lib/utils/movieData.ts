/**
 * @fileoverview Utilities for fetching and processing movie data
 */
import axios from 'axios';

interface MovieData {
  title: string;
  originalTitle?: string;
  year: number;
  rated?: string;
  released?: string;
  runtime?: string;
  plot?: string;
  tagline?: string;
  genres?: string[];
  director?: string[];
  writers?: string[];
  actors?: string[];
  language?: string[];
  country?: string[];
  awards?: string;
  poster?: string;
  posterTMDB?: string;
  backdrop?: string;
  ratings?: any[];
  metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  tmdbVoteAverage?: number;
  tmdbVoteCount?: number;
  budget?: number;
  revenue?: number;
  boxOffice?: string;
  production?: any[];
  imdbID?: string;
  tmdbID?: string;
  website?: string;
  homepage?: string;
  slug?: string;
}

export async function fetchMovieData(
  title: string,
  year?: number
): Promise<MovieData> {
  try {
    // OMDB API call
    const omdbResponse = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        t: title,
        y: year,
        plot: 'full',
      },
    });

    // TMDB API calls
    const tmdbSearchResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: title,
          year: year,
        },
      }
    );

    const tmdbMovie = tmdbSearchResponse.data.results[0];
    if (tmdbMovie) {
      const tmdbDetailsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${tmdbMovie.id}`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            append_to_response: 'credits,images',
          },
        }
      );
      const tmdbDetails = tmdbDetailsResponse.data;

      // Merge and format data
      return {
        title: omdbResponse.data.Title,
        originalTitle: tmdbDetails.original_title,
        year: parseInt(omdbResponse.data.Year),
        rated: omdbResponse.data.Rated,
        released: omdbResponse.data.Released,
        runtime: omdbResponse.data.Runtime,
        plot: omdbResponse.data.Plot,
        tagline: tmdbDetails.tagline,
        genres: [
          ...new Set([
            ...omdbResponse.data.Genre.split(', '),
            ...tmdbDetails.genres.map((g: any) => g.name),
          ]),
        ],
        director: omdbResponse.data.Director.split(', '),
        writers: omdbResponse.data.Writer.split(', '),
        actors: omdbResponse.data.Actors.split(', '),
        language: omdbResponse.data.Language.split(', '),
        country: omdbResponse.data.Country.split(', '),
        awards: omdbResponse.data.Awards,
        poster: omdbResponse.data.Poster,
        posterTMDB: tmdbDetails.poster_path
          ? `https://image.tmdb.org/t/p/original${tmdbDetails.poster_path}`
          : undefined,
        backdrop: tmdbDetails.backdrop_path
          ? `https://image.tmdb.org/t/p/original${tmdbDetails.backdrop_path}`
          : undefined,
        ratings: omdbResponse.data.Ratings,
        metascore: omdbResponse.data.Metascore,
        imdbRating: omdbResponse.data.imdbRating,
        imdbVotes: omdbResponse.data.imdbVotes,
        tmdbVoteAverage: tmdbDetails.vote_average,
        tmdbVoteCount: tmdbDetails.vote_count,
        budget: tmdbDetails.budget,
        revenue: tmdbDetails.revenue,
        boxOffice: omdbResponse.data.BoxOffice,
        production: tmdbDetails.production_companies,
        imdbID: omdbResponse.data.imdbID,
        tmdbID: tmdbMovie.id.toString(),
        website: omdbResponse.data.Website,
        homepage: tmdbDetails.homepage,
        slug: title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-'),
      };
    }

    throw new Error('Movie not found in TMDB');
  } catch (error) {
    console.error(`Error fetching data for ${title}:`, error);
    throw error;
  }
}
