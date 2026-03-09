import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

async function createLink(
  baseURL: string,
  request: APIRequestContext,
): Promise<{ shortCode: string }> {
  const response = await request.post(`${baseURL}/links`, {
    data: {
      target_url: `${baseURL}/health`,
      campaign: 'ui-e2e',
      tags: ['ui', 'playwright'],
    },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  return { shortCode: body.short_code as string };
}

test('redirect works in browser', async ({ page, request, baseURL }) => {
  if (!baseURL) {
    throw new Error('baseURL is required');
  }

  const { shortCode } = await createLink(baseURL, request);

  await page.goto(`${baseURL}/${shortCode}`);
  await expect(page).toHaveURL(/\/health$/);
});

test('headers preserved', async ({ page, request, baseURL }) => {
  if (!baseURL) {
    throw new Error('baseURL is required');
  }

  const { shortCode } = await createLink(baseURL, request);
  let redirectHeaders: Record<string, string> | null = null;

  page.on('response', (response) => {
    if (response.url() === `${baseURL}/${shortCode}` && response.status() === 302) {
      redirectHeaders = response.headers();
    }
  });

  await page.goto(`${baseURL}/${shortCode}`);

  expect(redirectHeaders).not.toBeNull();
  expect(redirectHeaders?.location).toContain('/health');
  expect(redirectHeaders?.['x-request-id']).toBeTruthy();
  expect(redirectHeaders?.['x-trace-id']).toMatch(/^[0-9a-f]{32}$/);
});

test('latency acceptable', async ({ page, request, baseURL }) => {
  if (!baseURL) {
    throw new Error('baseURL is required');
  }

  const { shortCode } = await createLink(baseURL, request);
  const maxLatencyMs = Number(process.env.UI_LATENCY_MS || '2000');

  const startedAt = Date.now();
  const response = await page.goto(`${baseURL}/${shortCode}`);
  const latencyMs = Date.now() - startedAt;

  expect(response?.status()).toBe(200);
  expect(latencyMs).toBeLessThan(maxLatencyMs);
});
