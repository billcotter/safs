/**
 * @fileoverview Script to fetch movie data from Google Sheets and APIs
 */
import { sheets } from '@googleapis/sheets';
import { GoogleAuth } from 'google-auth-library';
import { writeFile } from 'fs/promises';
import path from 'path';
import { fetchMovieData } from '../src/lib/utils/movieData';

async function getMoviesFromSheet() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  });

  const sheetsService = sheets({
    version: 'v4',
    auth: auth,
  });

  const response = await sheetsService.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A2:C', // Adjust based on your sheet structure
  });

  return response.data.values || [];
}

async function generateMovieFiles() {
  try {
    const movies = await getMoviesFromSheet();

    for (const [title, releaseDate] of movies) {
      const year = new Date(releaseDate).getFullYear();
      const movieData = await fetchMovieData(title, year);

      // Create movie markdown file
      const content = `---
${JSON.stringify(movieData, null, 2)}
---

${movieData.plot}
`;

      await writeFile(
        path.join(process.cwd(), 'src/content/movies', `${movieData.slug}.md`),
        content
      );

      console.log(`Created file for ${title}`);
    }
  } catch (error) {
    console.error('Error generating movie files:', error);
    process.exit(1);
  }
}

generateMovieFiles();
