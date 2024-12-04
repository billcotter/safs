import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSheetData } from './google-sheets';
import { cache } from './cache';
import { google } from 'googleapis';

vi.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: vi.fn(() => ({
        getClient: vi.fn()
      }))
    },
    sheets: vi.fn(() => ({
      spreadsheets: {
        values: {
          get: vi.fn()
        }
      }
    }))
  }
}));

describe('getSheetData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cache.flushAll();
  });

  it('should fetch and validate sheet data', async () => {
    const mockSheetData = {
      data: {
        values: [
          ['The Matrix', '1999'],
          ['Inception', '2010']
        ]
      }
    };

    vi.mocked(google.sheets)().spreadsheets.values.get.mockResolvedValueOnce(
      mockSheetData
    );

    const result = await getSheetData();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      title: 'The Matrix',
      year: 1999
    });
  });

  it('should throw on invalid data', async () => {
    const mockSheetData = {
      data: {
        values: [
          ['The Matrix', 'not-a-year']
        ]
      }
    };

    vi.mocked(google.sheets)().spreadsheets.values.get.mockResolvedValueOnce(
      mockSheetData
    );

    await expect(getSheetData()).rejects.toThrow();
  });

  it('should use cached data when available', async () => {
    const mockData = [{ title: 'Cached Movie', year: 2000 }];
    cache.set('sheet-movies', mockData);

    const result = await getSheetData();
    expect(result).toEqual(mockData);
    expect(google.sheets).not.toHaveBeenCalled();
  });
}); 