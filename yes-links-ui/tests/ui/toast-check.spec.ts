import { test, expect } from '@playwright/test';

test('Verify RemediationToast Rendering', async ({ page }) => {
  const targetUrl = 'http://localhost:6006/iframe.html?id=ui-remediationtoast--success&viewMode=story';
  console.log(`Navigating to: ${targetUrl}`);
  
  await page.goto(targetUrl);
  await page.waitForTimeout(3000);
  
  const content = await page.content();
  console.log('--- IFRAME BODY ---');
  // Log a subset of content to see if the component text is there
  console.log(content.substring(0, 2000));
  
  const toastText = await page.getByText('Links Created Successfully').isVisible();
  console.log(`Toast text visible: ${toastText}`);
  
  await page.screenshot({ path: 'toast-check.png' });
});
