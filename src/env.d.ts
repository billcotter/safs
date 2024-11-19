/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OMDB_API_KEY: string;
  readonly SENTRY_DSN: string;
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly GOOGLE_SHEET_ID: string;
  readonly GOOGLE_CLIENT_EMAIL: string;
  readonly GOOGLE_PRIVATE_KEY: string;
  readonly GOOGLE_SHEETS_SHEET_NAME: string;
  readonly GOOGLE_SHEETS_SHEET_RANGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
