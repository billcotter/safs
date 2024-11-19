import sheets from '@googleapis/sheets';
import { GoogleAuth } from 'google-auth-library';

export interface MovieEntry {
  title: string;
  releaseDate: string;
}

class GoogleSheetsError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'GoogleSheetsError';
  }
}

async function getAuthClient() {
  try {
    // Log environment variable presence (not their values for security)
    console.log('Checking Google credentials...');
    console.log('GOOGLE_CLIENT_EMAIL present:', !!import.meta.env.GOOGLE_CLIENT_EMAIL);
    console.log('GOOGLE_PRIVATE_KEY present:', !!import.meta.env.GOOGLE_PRIVATE_KEY);

    if (!import.meta.env.GOOGLE_CLIENT_EMAIL || !import.meta.env.GOOGLE_PRIVATE_KEY) {
      throw new GoogleSheetsError('Missing Google Sheets credentials in environment variables');
    }

    return new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      credentials: {
        client_email: import.meta.env.GOOGLE_CLIENT_EMAIL,
        private_key: import.meta.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
  } catch (error) {
    console.error('Auth client error details:', error);
    throw new GoogleSheetsError('Failed to initialize Google Auth client', error);
  }
}

export async function fetchMoviesList(): Promise<MovieEntry[]> {
  try {
    // Log sheet ID presence
    console.log('Checking Google Sheet ID...');
    console.log('GOOGLE_SHEET_ID present:', !!import.meta.env.GOOGLE_SHEET_ID);

    if (!import.meta.env.GOOGLE_SHEET_ID) {
      throw new GoogleSheetsError('Missing GOOGLE_SHEET_ID in environment variables');
    }

    console.log('Getting auth client...');
    const auth = await getAuthClient();

    console.log('Initializing sheets service...');
    const sheetsService = sheets.sheets({
      version: 'v4',
      auth: auth,
    });

    console.log('Fetching data from spreadsheet...');
    const response = await sheetsService.spreadsheets.values.get({
      spreadsheetId: import.meta.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A2:B', // Adjust based on your sheet structure
    }).catch((error: any) => {
      console.error('Google Sheets API error:', {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error.errors
      });
      throw new GoogleSheetsError('Failed to fetch data from Google Sheets', error);
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.warn('No data found in spreadsheet');
      return [];
    }

    console.log(`Processing ${rows.length} rows...`);
    return rows.map((row: string[], index: number) => {
      try {
        if (!row[0]) {
          throw new Error(`Missing title in row ${index + 2}`);
        }

        return {
          title: row[0],
          releaseDate: row[1] || '', // Make releaseDate optional
        };
      } catch (error) {
        console.error(`Error processing row ${index + 2}:`, error);
        return {
          title: `[Error: Malformed Entry ${index + 2}]`,
          releaseDate: '',
        };
      }
    });
  } catch (error: unknown) {
    // Enhanced error logging
    if (error instanceof GoogleSheetsError) {
      console.error('Google Sheets Error:', {
        message: error.message,
        cause: error.cause
      });
    } else if (error instanceof Error) {
      console.error('Unexpected error:', {
        type: error.constructor.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error('Unknown error:', error);
    }

    if (!(error instanceof GoogleSheetsError)) {
      throw new GoogleSheetsError('Failed to fetch movies list', error);
    }
    throw error;
  }
}
