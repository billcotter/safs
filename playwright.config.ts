/**
 * @fileoverview Playwright configuration for end-to-end testing
 * @module playwright.config
 */

import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  webServer: {
    command: 'pnpm run preview',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4321',
  },
};

export default config;
