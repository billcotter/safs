// src/lib/monitoring/index.ts
/**
 * @fileoverview Basic monitoring setup
 * @module lib/monitoring
 */

import * as Sentry from '@sentry/astro';
import { log } from '../utils/logger';

export const initializeMonitoring = () => {
  // Only initialize Sentry in production
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,

      // Only send errors in production
      beforeSend(event) {
        if (process.env.NODE_ENV === 'production') {
          return event;
        }
        return null;
      },
    });
  }
};

// Web Vitals monitoring
export const reportWebVitals = ({ name, value, id }: any) => {
  log(`Web Vital: ${name}`, {
    type: 'info',
    context: { id, value, metric: name },
  });

  // Send to Sentry if in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage('Web Vitals Report', {
      extra: { metric: name, value, id },
      level: 'info',
    });
  }
};
