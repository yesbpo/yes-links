import { test, expect } from '@playwright/test';

test('Final Storybook Screenshot', async ({ page }) => {
  console.log('Navigating to main Storybook UI...');
  await page.goto('http://localhost:6006', { waitUntil: 'networkidle' });
  
  // Wait for sidebar to load
  await page.waitForSelector('.sidebar-container', { timeout: 15000 }).catch(e => console.log('Sidebar not found, taking screenshot anyway'));
  
  // Give it a bit more time for any overlays or errors to appear
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'storybook-main-ui.png', fullPage: true });
  console.log('Screenshot saved to storybook-main-ui.png');
  
  // Try to list the titles in the sidebar to see what's actually there
  const titles = await page.locator('.sidebar-item').allTextContents();
  console.log('Sidebar items:', titles.join(', '));
});
