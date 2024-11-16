/**
 * @fileoverview Home page end-to-end tests
 * @module tests/e2e/home
 */

import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/St. Augustine Film Society/);
});
