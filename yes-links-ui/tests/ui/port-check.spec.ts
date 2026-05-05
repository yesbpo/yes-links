import { test, expect } from '@playwright/test';

test('Check Port 6008 Content', async ({ page }) => {
  await page.goto('http://localhost:6008');
  await page.waitForTimeout(5000);
  
  const title = await page.title();
  const content = await page.innerText('body');
  
  console.log(`Title: ${title}`);
  console.log(`Body text snippet: ${content.substring(0, 500)}`);
  
  await page.screenshot({ path: 'port-6008-check.png' });
});
