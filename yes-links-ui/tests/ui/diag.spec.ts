import { test, expect } from '@playwright/test';

test('Diagnose Storybook Blank Screen', async ({ page }) => {
  const logs: {type: string, text: string}[] = [];
  const errors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', msg => {
    logs.push({type: msg.type(), text: msg.text()});
  });

  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}`);
  });

  page.on('requestfailed', request => {
    failedRequests.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      failedRequests.push(`${response.request().method()} ${response.url()} - HTTP ${response.status()}`);
    }
  });

  console.log('Navigating to Storybook iframe...');
  
  // Try to load the success toast story directly
  const targetUrl = 'http://localhost:6006/iframe.html?id=ui-remediationtoast--success&viewMode=story';
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

  // Wait for network to settle or timeout
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch (e) {
    console.log('Network did not settle in 5s');
  }

  console.log('--- BROWSER LOGS ---');
  logs.forEach(log => console.log(`[${log.type}] ${log.text}`));
  
  console.log('--- BROWSER ERRORS ---');
  errors.forEach(err => console.error(err));

  console.log('--- FAILED REQUESTS ---');
  failedRequests.forEach(req => console.error(req));

  const content = await page.content();
  console.log(`Page content length: ${content.length}`);
  
  // Check if .yes-link-root is present
  const rootExists = await page.locator('.yes-link-root').count();
  console.log(`Root element (.yes-link-root) exists: ${rootExists > 0}`);

  await page.screenshot({ path: 'storybook-diag-final.png', fullPage: true });
});
