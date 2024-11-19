import { fetchMoviesList } from '../src/lib/utils/fetchSheets';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testGoogleSheets() {
  try {
    console.log('Fetching movies from Google Sheets...');
    const movies = await fetchMoviesList();
    console.log('Fetched movies:', JSON.stringify(movies, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testGoogleSheets();
