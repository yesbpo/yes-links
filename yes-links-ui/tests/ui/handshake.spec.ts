import { test, expect } from '@playwright/test';

test.describe('Iframe Secure Handshake & Theming', () => {
  test('should initialize and apply theme tokens from host postMessage', async ({ page }) => {
    // 1. Load the UI (Initially in loading state)
    await page.goto('/');
    
    // Check loading indicator
    const loading = page.getByTestId('dashboard-loading');
    await expect(loading).toBeVisible();

    // 2. Simulate Host postMessage (Handshake)
    await page.evaluate(() => {
      window.postMessage({
        type: 'INIT_SESSION',
        payload: {
          token: 'mock-jwt-token',
          theme: {
            colors: {
              primary: 'rgb(255, 0, 0)', 
              background: 'rgb(255, 255, 255)'
            },
            radius: '20px'
          }
        }
      }, '*');
    });

    // 3. Verify initialization (Loading disappears, Form appears)
    await expect(loading).not.toBeVisible();
    const createButton = page.getByRole('button', { name: /create link/i });
    await expect(createButton).toBeVisible();

    // 4. Verify Theme Token Injection (Zero Hardcoding check)
    // We check if the CSS variable was injected and the button reflects it.
    const buttonBg = await createButton.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const buttonRadius = await createButton.evaluate((el) => window.getComputedStyle(el).borderRadius);
    
    // With Tailwind prefixing, we ensure the variable is actually applied via the utility
    expect(buttonBg).toBe('rgb(255, 0, 0)');
    expect(buttonRadius).toBe('18px');
  });
});
