/// <reference path="../.astro/types.d.ts" />

// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OMDB_API_KEY: string;
  readonly SENTRY_DSN: string;
  readonly NODE_ENV: 'development' | 'production' | 'test';
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
