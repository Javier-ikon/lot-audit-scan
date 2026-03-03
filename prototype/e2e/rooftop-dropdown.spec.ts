import { test, expect } from '@playwright/test';

test.describe('[Rooftop Selection] Dropdown', () => {
  test('shows dropdown trigger, not three separate boxes', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText('Select Rooftop')).toBeVisible();

    await expect(
      page.getByText('Tap to choose a rooftop')
    ).toBeVisible();

    const trigger = page.getByText('Tap to select a rooftop...');
    await expect(trigger).toBeVisible();

    const rooftopNames = [
      'Friendly Chevrolet - Downtown',
      'Metro Auto Group - North',
      'Valley Motors - East',
    ];
    for (const name of rooftopNames) {
      const visible = await page.getByText(name).isVisible();
      expect(visible, `Rooftop "${name}" should not be visible when dropdown is closed`).toBe(
        false
      );
    }
  });

  test('opens modal when dropdown trigger is clicked', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /sign in/i }).click();

    await page.getByText('Tap to select a rooftop...').click();

    await expect(page.getByText('Select a rooftop').first()).toBeVisible();

    await expect(page.getByText('Friendly Chevrolet - Downtown')).toBeVisible();
    await expect(page.getByText('Metro Auto Group - North')).toBeVisible();
    await expect(page.getByText('Valley Motors - East')).toBeVisible();

    await expect(page.getByText('Close')).toBeVisible();
  });

  test('selecting rooftop and starting audit navigates to scanning', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /sign in/i }).click();

    await page.getByText('Tap to select a rooftop...').click();

    await page.getByText('Metro Auto Group - North').click();

    await expect(page.getByText('Metro Auto Group - North')).toBeVisible();

    await page.getByRole('button', { name: 'Start audit' }).click();

    await expect(page.getByText('Scan VIN')).toBeVisible();
    await expect(page.getByPlaceholder(/17-character VIN/i)).toBeVisible();
  });
});
