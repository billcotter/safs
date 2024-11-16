/**
 * @fileoverview Content collections configuration with Zod schemas
 * @module content/config
 */

import { defineCollection, z } from 'astro:content';

export const movieCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    releaseDate: z.date(),
    rating: z.number().min(0).max(5).optional(),
    // Add more schema definitions
  }),
});
