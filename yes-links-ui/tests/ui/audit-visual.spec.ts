import { test, expect } from '@playwright/test';

const stories = [
  { id: 'ui-remediationtoast--success', name: 'toast-success' },
  { id: 'ui-remediationtoast--error-with-remediation', name: 'toast-error' },
  { id: 'ui-remediationtoast--progress', name: 'toast-progress' },
  { id: 'sdk-linklist--success', name: 'link-list' },
  { id: 'dashboard-filterbar--default', name: 'filter-bar' },
  { id: 'dashboard-kpistats--default', name: 'kpi-stats' },
  { id: 'pages-dashboard--default', name: 'full-dashboard' }
];

test('Capture Component Screenshots', async ({ page }) => {
  for (const story of stories) {
    console.log(`Capturing ${story.name}...`);
    // Load the story in the iframe
    await page.goto(`http://localhost:9091/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'networkidle' });
    
    // Ensure the root class is present (fallback if decorator is not active in iframe.html for some reason)
    await page.evaluate(() => {
      document.body.classList.add('yes-link-root');
    });

    await page.waitForTimeout(2000);
    await page.screenshot({ path: `audit-${story.name}.png`, fullPage: false });
  }
});
