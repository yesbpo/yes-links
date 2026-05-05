import { test, expect } from '@playwright/test';

test('Verify canonical SDK and page stories are present', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.sidebar-container', { timeout: 30000 });

  await expect(page.getByRole('button', { name: /SDK/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Pages/i })).toBeVisible();

  const expectedStories = [
    'YesLinksShell',
    'LinkCard',
    'LinkList',
    'FilterBar',
    'KPIStats',
    'PerformanceTrends',
    'CreateLinkOverlay',
    'Active Links',
    'Global Stats',
  ];

  for (const story of expectedStories) {
    await expect(page.getByRole('button', { name: new RegExp(story, 'i') })).toBeVisible();
  }
});
