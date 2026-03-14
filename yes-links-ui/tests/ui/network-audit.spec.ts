import { test, expect } from '@playwright/test';

test.describe('SDK Network Audit', () => {
  test('Network: useLinks applies filters and sets x-request-id', async ({ page }) => {
    // Intercept the API call to validate the contract
    const apiRequestPromise = page.waitForRequest(
      request => request.url().includes('/api/v1/links') && request.method() === 'GET'
    );

    // Initial page load
    await page.goto('/');

    // Bypass loader
    await page.evaluate(() => {
      window.postMessage({
        type: 'INIT_SESSION',
        payload: {
          token: 'audit-token',
          theme: 'corporate'
        }
      }, '*');
    });

    const request = await apiRequestPromise;
    const url = new URL(request.url());
    
    // Assert limit parameter defaults to 20
    expect(url.searchParams.get('limit')).toBe('20');
    
    // Assert x-request-id is present
    expect(request.headers()['x-request-id']).toBeDefined();
    
    // Mock the response so the page can load
    await page.route('/api/v1/links*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              id: '1',
              short_code: 'TEST-1',
              target_url: 'https://example.com/1',
              campaign: 'summer',
              tags: ['promo']
            }
          ],
          total: 1
        })
      });
    });

    // Wait for the UI to show the mocked data
    // Note: since the initial request already went out before we routed it (maybe),
    // let's trigger a filter change to test the new route interception and filtering.
    
    // Type in the search input
    const searchInput = page.getByPlaceholder('Buscar enlaces...');
    await searchInput.fill('TEST-1');
    
    // Wait for the new request with the filter
    const filteredRequestPromise = page.waitForRequest(
      req => req.url().includes('/api/v1/links') && req.url().includes('search=TEST-1')
    );
    
    const filteredRequest = await filteredRequestPromise;
    const filteredUrl = new URL(filteredRequest.url());
    
    expect(filteredUrl.searchParams.get('search')).toBe('TEST-1');
  });
});
