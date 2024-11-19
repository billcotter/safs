import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  vite: {
    define: {
      'process.env.GOOGLE_SHEET_ID': JSON.stringify(process.env.GOOGLE_SHEET_ID),
      'process.env.GOOGLE_CLIENT_EMAIL': JSON.stringify(process.env.GOOGLE_CLIENT_EMAIL),
      'process.env.GOOGLE_PRIVATE_KEY': JSON.stringify(process.env.GOOGLE_PRIVATE_KEY),
    }
  }
});
