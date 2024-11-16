// src/lib/monitoring/vitals.ts
/**
 * @fileoverview Web Vitals monitoring setup
 * @module lib/monitoring/vitals
 */

import { onCLS, onFID, onLCP, type Metric } from 'web-vitals';
import * as Sentry from '@sentry/astro';

/**
 * Send vitals data to Sentry
 * @param metric Web Vitals metric
 */
export function sendToAnalytics(metric: Metric) {
  const body = {
    dsn: process.env.SENTRY_DSN,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
  };

  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage('Web Vital', {
      level: 'info',
      extra: body,
    });
  } else {
    // Log in development
    console.log('[Web Vitals]', body);
  }
}

// Add to your base layout component:
// src/layouts/BaseLayout.astro
export function injectWebVitals() {
  const script = `
    try {
      webVitals();
    } catch (err) {
      console.error('[Web Vitals]', err);
    }
  `;

  return `<script>
    ${script}
  </script>`;
}

/**
 * Initialize web vitals monitoring
 */
export function webVitals() {
  try {
    onFID((metric) => sendToAnalytics(metric));
    onCLS((metric) => sendToAnalytics(metric));
    onLCP((metric) => sendToAnalytics(metric));
  } catch (err) {
    console.error('[Web Vitals]', err);
  }
}
