// src/lib/utils/logger.ts
/**
 * @fileoverview Simple logging utility
 * @module lib/utils/logger
 */

const isDev = process.env.NODE_ENV === 'development';

interface LogOptions {
  type: 'error' | 'warn' | 'info';
  context?: Record<string, unknown>;
}

export const log = (message: string, options: LogOptions) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message,
    ...options,
    environment: process.env.NODE_ENV,
  };

  // In development, pretty print to console
  if (isDev) {
    console[options.type](JSON.stringify(logEntry, null, 2));
    return;
  }

  // In production, format for Netlify logs
  console[options.type](JSON.stringify(logEntry));
};

// Usage example:
// log('User signup failed', {
//   type: 'error',
//   context: { userId: '123', reason: 'Invalid email' }
// });
