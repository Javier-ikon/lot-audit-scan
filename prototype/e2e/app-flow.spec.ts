import { test, expect } from '@playwright/test';

test.describe('[App Flow] Critical paths', () => {
  test('login -> rooftop -> scan flow', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Ikon Lot Scan')).toBeVisible();

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText('Select Rooftop')).toBeVisible();

    await page.getByText('Tap to select a rooftop...').click();
    await page.getByText('Friendly Chevrolet - Downtown').click();
    await page.getByRole('button', { name: 'Start audit' }).click();

    await expect(page.getByText('Scan VIN')).toBeVisible();

    await page.getByPlaceholder(/17-character VIN/i).fill('KL79MMSP2TB120806');
    await page.getByRole('button', { name: 'Look up' }).click();

    await expect(page.getByText('PASS')).toBeVisible();
    await expect(page.getByText('KL79MMSP2TB120806')).toBeVisible();
  });

  test('end audit flow', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /sign in/i }).click();
    await page.getByText('Tap to select a rooftop...').click();
    await page.getByText('Valley Motors - East').click();
    await page.getByRole('button', { name: 'Start audit' }).click();

    await page.getByRole('button', { name: 'End audit' }).click();

    await expect(page.getByText('End audit?')).toBeVisible();
    await page.getByRole('button', { name: /yes.*end audit/i }).click();

    await expect(page.getByText('Audit complete')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download CSV' })).toBeVisible();
  });
});
