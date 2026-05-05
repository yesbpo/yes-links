/**
 * E2E tests for clientScope + mode feature
 * RED phase — all tests will fail until implementation is complete
 *
 * Scope: YesLinksDashboard with clientScope + mode props
 *   - mode=external hides campaign/tags in create-link overlay
 *   - mode=internal shows them (default behaviour)
 *   - clientScope filters API requests with campaign/tags[] params
 */
import { test, expect } from '@playwright/test'

const BASE = '/test-sdk-scope'
const TIMEOUT = 15_000

// ── mode=external — create-link overlay ──────────────────────────────────────

test.describe('mode=external — create-link overlay', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/dashboard/summary**', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_links: 5,
          total_clicks: 20,
          avg_clicks_per_link: 4,
          top_campaigns: [],
          trends: { clicks_last_7d: 5, clicks_prev_7d: 4, pct_change: 25 },
        }),
      })
    )
    await page.route('**/links**', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, page: 1, size: 20 }),
      })
    )
  })

  test('hides campaign and tags fields when mode=external', async ({ page }) => {
    await page.goto(`${BASE}?mode=external&campaign=summer&tags=promo,portal`)
    await page.waitForSelector('[data-testid="yes-links-dashboard"]', { timeout: TIMEOUT })

    // Open create overlay
    const createBtn = page.getByRole('button', { name: /crear enlace|new link|create/i })
    await expect(createBtn).toBeVisible({ timeout: TIMEOUT })
    await createBtn.click()

    // Campaign and tags fields must NOT be in the DOM
    await expect(page.locator('#overlay-campaign')).toHaveCount(0)
    await expect(page.locator('#overlay-tags')).toHaveCount(0)
  })

  test('submits lockedCampaign and lockedTags via POST /links when mode=external', async ({ page }) => {
    let capturedBody: Record<string, unknown> | null = null

    await page.route('**/links', async (r) => {
      if (r.request().method() === 'POST') {
        capturedBody = JSON.parse(r.request().postData() ?? '{}')
        await r.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'new-1', short_code: 'abc' }),
        })
      } else {
        await r.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ items: [], total: 0, page: 1, size: 20 }),
        })
      }
    })

    await page.goto(`${BASE}?mode=external&campaign=locked-camp&tags=locked-tag`)
    await page.waitForSelector('[data-testid="yes-links-dashboard"]', { timeout: TIMEOUT })

    const createBtn = page.getByRole('button', { name: /crear enlace|new link|create/i })
    await createBtn.click()

    // Only fill target URL (campaign + tags are locked)
    await page.locator('#overlay-target-url').fill('https://locked-test.example.com')
    await page.getByRole('button', { name: /crear enlace|create link|submit/i }).last().click()

    await page.waitForTimeout(1000)
    expect(capturedBody?.campaign).toBe('locked-camp')
    expect(capturedBody?.tags).toEqual(['locked-tag'])
  })

  test('shows campaign and tags fields when mode=internal (default)', async ({ page }) => {
    await page.goto(`${BASE}?mode=internal&campaign=summer`)
    await page.waitForSelector('[data-testid="yes-links-dashboard"]', { timeout: TIMEOUT })

    const createBtn = page.getByRole('button', { name: /crear enlace|new link|create/i })
    await expect(createBtn).toBeVisible({ timeout: TIMEOUT })
    await createBtn.click()

    // Both fields must be present and editable
    await expect(page.locator('#overlay-campaign')).toBeVisible()
    await expect(page.locator('#overlay-tags')).toBeVisible()
  })
})

// ── clientScope — GET /links filtering ───────────────────────────────────────

test.describe('clientScope — API request filtering', () => {
  test('adds campaign param to GET /links when clientScope.campaign is set', async ({ page }) => {
    const capturedUrls: string[] = []

    await page.route('**/dashboard/summary**', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_links: 0, total_clicks: 0, avg_clicks_per_link: 0,
          top_campaigns: [], trends: { clicks_last_7d: 0, clicks_prev_7d: 0, pct_change: null },
        }),
      })
    )
    await page.route('**/links**', (r) => {
      capturedUrls.push(r.request().url())
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, page: 1, size: 20 }),
      })
    })

    await page.goto(`${BASE}?campaign=enterprise`)
    await page.waitForSelector('[data-testid="yes-links-dashboard"]', { timeout: TIMEOUT })
    await page.waitForTimeout(1000)

    const linksUrl = capturedUrls.find((u) => u.includes('/links'))
    expect(linksUrl).toBeDefined()
    expect(linksUrl).toContain('campaign=enterprise')
  })

  test('adds campaign param to GET /dashboard/summary when clientScope.campaign is set', async ({ page }) => {
    const capturedUrls: string[] = []

    await page.route('**/dashboard/summary**', (r) => {
      capturedUrls.push(r.request().url())
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_links: 0, total_clicks: 0, avg_clicks_per_link: 0,
          top_campaigns: [], trends: { clicks_last_7d: 0, clicks_prev_7d: 0, pct_change: null },
        }),
      })
    })
    await page.route('**/links**', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, page: 1, size: 20 }),
      })
    )

    await page.goto(`${BASE}?campaign=enterprise`)
    await page.waitForSelector('[data-testid="yes-links-dashboard"]', { timeout: TIMEOUT })
    await page.waitForTimeout(1000)

    const summaryUrl = capturedUrls.find((u) => u.includes('/dashboard/summary'))
    expect(summaryUrl).toBeDefined()
    expect(summaryUrl).toContain('campaign=enterprise')
  })

  test('sends tags[] params when clientScope.tags is set', async ({ page }) => {
    const capturedUrls: string[] = []

    await page.route('**/dashboard/summary**', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_links: 0, total_clicks: 0, avg_clicks_per_link: 0,
          top_campaigns: [], trends: { clicks_last_7d: 0, clicks_prev_7d: 0, pct_change: null },
        }),
      })
    )
    await page.route('**/links**', (r) => {
      capturedUrls.push(r.request().url())
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, page: 1, size: 20 }),
      })
    })

    await page.goto(`${BASE}?tags=portal,client-x`)
    await page.waitForSelector('[data-testid="yes-links-dashboard"]', { timeout: TIMEOUT })
    await page.waitForTimeout(1000)

    const linksUrl = capturedUrls.find((u) => u.includes('/links'))
    expect(linksUrl).toBeDefined()
    // tags[]= repeated params (URL encoded [ ] as %5B%5D)
    expect(linksUrl).toMatch(/tags(%5B%5D|\[\])=portal/)
    expect(linksUrl).toMatch(/tags(%5B%5D|\[\])=client-x/)
  })

  test('does not add scope params when no clientScope is provided', async ({ page }) => {
    const capturedUrls: string[] = []

    await page.route('**/dashboard/summary**', (r) => {
      capturedUrls.push(r.request().url())
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_links: 0, total_clicks: 0, avg_clicks_per_link: 0,
          top_campaigns: [], trends: { clicks_last_7d: 0, clicks_prev_7d: 0, pct_change: null },
        }),
      })
    })
    await page.route('**/links**', (r) => {
      capturedUrls.push(r.request().url())
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, page: 1, size: 20 }),
      })
    })

    // No campaign or tags query params → no clientScope
    await page.goto(BASE)
    await page.waitForSelector('[data-testid="yes-links-dashboard"]', { timeout: TIMEOUT })
    await page.waitForTimeout(1000)

    for (const url of capturedUrls) {
      expect(url).not.toMatch(/campaign=/)
      expect(url).not.toMatch(/tags(%5B%5D|\[\])=/)
    }
  })
})
