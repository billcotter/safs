import { google } from 'googleapis';
import { z } from 'zod';
import { SheetRowSchema, type SheetRow } from './schemas/sheet';
import { withRetry } from './utils/retry';
import { withCache } from './cache';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty'
  }
});

export class GoogleSheetError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'GoogleSheetError';
  }
}

export async function getSheetData(): Promise<SheetRow[]> {
  return withCache(
    'sheet-movies',
    async () => {
      try {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await withRetry(
          () => sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Movies!A2:B'
          })
        );

        const rows = response.data.values;
        
        if (!rows) {
          throw new GoogleSheetError('No data found in sheet');
        }

        logger.info(`Processing ${rows.length} rows from sheet`);

        const validatedRows = rows.map((row, index) => {
          try {
            return SheetRowSchema.parse({
              title: row[0],
              year: row[1]
            });
          } catch (error) {
            if (error instanceof z.ZodError) {
              logger.error(
                { row, errors: error.errors },
                `Validation error in row ${index + 2}`
              );
            }
            throw new GoogleSheetError(
              `Invalid data in row ${index + 2}`,
              error
            );
          }
        });

        logger.info(`Successfully validated ${validatedRows.length} rows`);
        return validatedRows;

      } catch (error) {
        logger.error(error, 'Failed to fetch sheet data');
        throw new GoogleSheetError(
          'Failed to fetch sheet data',
          error
        );
      }
    },
    3600 // Cache for 1 hour
  );
} 