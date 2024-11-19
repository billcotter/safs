import { defineCollection, reference, z } from 'astro:content';

// Shared schema for external IDs
const externalIdsSchema = z.object({
  imdbID: z.string(),
  tmdbID: z.string().optional(),
});

// Ratings schema
const ratingsSchema = z.object({
  Source: z.string(),
  Value: z.string(),
});

// Production company schema
const productionCompanySchema = z.object({
  name: z.string(),
  id: z.number().optional(),
  logo_path: z.string().optional(),
  origin_country: z.string().optional(),
});

// Base movie schema combining OMDB and TMDB data
export const movieSchema = z.object({
  // Basic Info
  title: z.string(),
  originalTitle: z.string().optional(),
  year: z.number(),
  rated: z.string().optional(),
  released: z.string().transform((str) => new Date(str)),
  runtime: z.string(),

  // Content
  plot: z.string(),
  tagline: z.string().optional(),
  genres: z.array(z.string()),
  director: z.array(z.string()),
  writers: z.array(z.string()),
  actors: z.array(z.string()),

  // Additional Details
  language: z.array(z.string()),
  country: z.array(z.string()),
  awards: z.string().optional(),

  // Media
  poster: z.string().optional(),
  posterTMDB: z.string().optional(),
  backdrop: z.string().optional(),

  // Ratings & Metrics
  ratings: z.array(ratingsSchema).optional(),
  metascore: z.string().optional(),
  imdbRating: z.string(),
  imdbVotes: z.string(),
  tmdbVoteAverage: z.number().optional(),
  tmdbVoteCount: z.number().optional(),

  // Business Info
  budget: z.number().optional(),
  revenue: z.number().optional(),
  boxOffice: z.string().optional(),
  production: z.array(productionCompanySchema).optional(),

  // External IDs and Links
  ...externalIdsSchema.shape,
  website: z.string().url().optional(),
  homepage: z.string().url().optional(),

  // Internal References
  schedule: z
    .object({
      showDate: z.date(),
      venue: z.string(),
      time: z.string(),
    })
    .optional(),

  // Meta
  status: z.enum(['Scheduled', 'Shown', 'Cancelled']).default('Scheduled'),
  featured: z.boolean().default(false),
  slug: z.string(),
});

// Define collections
export const collections = {
  movies: defineCollection({
    type: 'content',
    schema: movieSchema,
  }),
};
