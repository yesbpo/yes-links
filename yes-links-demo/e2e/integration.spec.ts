/**
 * yes-links-demo — SDK Integration E2E Tests
 *
 * Verifies that the @yes/links-ui SDK integrates correctly into a host React app.
 * All backend calls are intercepted via page.route — no live backend required.
 *
 * Test layers covered:
 *   B — Provider + Dashboard managed mode
 *   C — Hook-level integration (HooksView)
 *   D — Error states
 */
import { test, expect, type Route } from '@playwright/test'

// ─── Mock data ─────────────────────────────────────────────────────────────
const MOCK_LINKS = {
  items: [
    {
      id: 'link-1',
      short_code: 'abc123',
      target_url: 'https://example.com',
      campaign: null,
      tags: [],
      created_at: '2026-05-05T00:00:00Z',
    },
  ],
  total: 1,
}

const MOCK_LINKS_EMPTY = { items: [], total: 0 }

const MOCK_SUMMARY = {
  total_links: 1,
  total_clicks: 42,
  avg_clicks_per_link: 42,
  top_campaigns: [],
  trends: { clicks_last_7d: 10, clicks_prev_7d: 8, pct_change: 25 },
}

const MOCK_SUMMARY_EMPTY = {
  total_links: 0,
  total_clicks: 0,
  avg_clicks_per_link: 0,
  top_campaigns: [],
  trends: { clicks_last_7d: 0, clicks_prev_7d: 0, pct_change: null },
}

// ─── Route helpers ──────────────────────────────────────────────────────────
function mockBackend(
  page: Parameters<typeof test>[1]['page'],
  options: {
    links?: object
    summary?: object
    linksStatus?: number
    summaryStatus?: number
  } = {},
) {
  const {
    links = MOCK_LINKS_EMPTY,
    summary = MOCK_SUMMARY_EMPTY,
    linksStatus = 200,
    summaryStatus = 200,
  } = options

  page.route('http://127.0.0.1:8001/links**', (route: Route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: linksStatus,
        contentType: 'application/json',
        body: linksStatus === 200 ? JSON.stringify(links) : JSON.stringify({ detail: 'error' }),
      })
    } else {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'new-link', short_code: 'xyz999', target_url: 'https://new.example.com' }),
      })
    }
  })

  page.route('http://127.0.0.1:8001/dashboard/summary**', (route: Route) => {
    route.fulfill({
      status: summaryStatus,
      contentType: 'application/json',
      body:
        summaryStatus === 200
          ? JSON.stringify(summary)
          : JSON.stringify({ detail: 'error' }),
    })
  })
}

const TIMEOUT = 15_000

// ─── Test suite ─────────────────────────────────────────────────────────────
test.describe('yes-links SDK Integration', () => {
  // ── B. Managed mode ─────────────────────────────────────────────────────
  test.describe('B — Provider + Dashboard (managed mode)', () => {
    test('B-1: demo app loads and shows tab navigation', async ({ page }) => {
      mockBackend(page)
      await page.goto('/')
      await expect(page.locator('[data-testid="tab-bar"]')).toBeVisible({ timeout: TIMEOUT })
      await expect(page.locator('[data-testid="tab-managed"]')).toBeVisible()
      await expect(page.locator('[data-testid="tab-hooks"]')).toBeVisible()
    })

    test('B-2: managed view is the default active tab', async ({ page }) => {
      mockBackend(page)
      await page.goto('/')
      await expect(page.locator('[data-testid="managed-view"]')).toBeVisible({ timeout: TIMEOUT })
      await expect(page.locator('[data-testid="hooks-links-panel"]')).not.toBeVisible()
    })

    test('B-3: managed dashboard renders dashboard shell (links + stats sections)', async ({ page }) => {
      mockBackend(page)
      await page.goto('/')
      // SDK renders the yes-links-dashboard shell with its sections
      await expect(page.locator('[data-testid="yes-links-dashboard"]')).toBeVisible({ timeout: TIMEOUT })
      await expect(page.locator('[data-testid="yes-links-dashboard-links"]')).toBeVisible({ timeout: TIMEOUT })
      await expect(page.locator('[data-testid="yes-links-dashboard-stats"]')).toBeVisible({ timeout: TIMEOUT })
    })

    test('B-4: managed dashboard shows stats with mocked backend data', async ({ page }) => {
      mockBackend(page, { summary: MOCK_SUMMARY })
      await page.goto('/')
      // Stats section should show a numeric value from the mock
      const statsSection = page.locator('[data-testid="yes-links-dashboard-stats"]')
      await expect(statsSection).toBeVisible({ timeout: TIMEOUT })
      // At least one numeric text in stats (total_links=1, total_clicks=42)
      await expect(statsSection.getByText(/\d+/).first()).toBeVisible({ timeout: TIMEOUT })
    })

    test('B-5: managed dashboard shows link from mocked backend', async ({ page }) => {
      mockBackend(page, { links: MOCK_LINKS, summary: MOCK_SUMMARY })
      await page.goto('/')
      // The link target URL should appear in the links list
      await expect(page.getByText('https://example.com')).toBeVisible({ timeout: TIMEOUT })
    })
  })

  // ── C. Hooks API ─────────────────────────────────────────────────────────
  test.describe('C — Hooks API (HooksView)', () => {
    test('C-1: clicking hooks tab reveals hooks view panels', async ({ page }) => {
      mockBackend(page)
      await page.goto('/')
      await page.locator('[data-testid="tab-hooks"]').click()
      await expect(page.locator('[data-testid="hooks-links-panel"]')).toBeVisible({ timeout: TIMEOUT })
      await expect(page.locator('[data-testid="hooks-stats-panel"]')).toBeVisible({ timeout: TIMEOUT })
      await expect(page.locator('[data-testid="managed-view"]')).not.toBeVisible()
    })

    test('C-2: useLinks reaches success state and shows link data', async ({ page }) => {
      mockBackend(page, { links: MOCK_LINKS, summary: MOCK_SUMMARY })
      await page.goto('/')
      await page.locator('[data-testid="tab-hooks"]').click()
      await expect(page.locator('[data-testid="links-state"]')).toHaveText('success', { timeout: TIMEOUT })
      await expect(page.locator('[data-testid="links-count"]')).toHaveText('1', { timeout: TIMEOUT })
      await expect(page.locator('[data-testid="link-item-0"]')).toContainText('abc123', { timeout: TIMEOUT })
    })

    test('C-3: useStats reaches success state and shows kpi data', async ({ page }) => {
      mockBackend(page, { links: MOCK_LINKS, summary: MOCK_SUMMARY })
      await page.goto('/')
      await page.locator('[data-testid="tab-hooks"]').click()
      await expect(page.locator('[data-testid="stats-state"]')).toHaveText('success', { timeout: TIMEOUT })
      await expect(page.locator('[data-testid="stats-total-links"]')).toHaveText('1', { timeout: TIMEOUT })
      await expect(page.locator('[data-testid="stats-total-clicks"]')).toHaveText('42', { timeout: TIMEOUT })
    })

    test('C-4: useLinks shows error state when backend returns 500', async ({ page }) => {
      mockBackend(page, { linksStatus: 500 })
      await page.goto('/')
      await page.locator('[data-testid="tab-hooks"]').click()
      await expect(page.locator('[data-testid="links-state"]')).toHaveText('error', { timeout: TIMEOUT })
      await expect(page.locator('[data-testid="hooks-error"]')).toBeVisible({ timeout: TIMEOUT })
    })
  })
})
