export interface Film {
  title: string;
  releaseDate: string;
}

export interface EnrichedFilm extends Film {
  year: string;
  rated: string;
  runtime: string;
  genre: string[];
  director: string;
  actors: string[];
  plot: string;
  poster: string;
  posterPathTMDB?: string;
  backdropPath?: string;
  imdbRating: string;
  imdbID: string;
  tagline?: string;
  voteAverage?: number;
  productionCompanies?: string[];
}

export interface FilmList {
  films: EnrichedFilm[];
  isLoading?: boolean;
  error?: string;
}
