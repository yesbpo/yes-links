/**
 * SDK Integration Smoke Tests — TF:YL-S1-T10
 *
 * Validates that YesLinksProvider + YesLinksDashboard connects to a real backend
 * without any dataSource wiring.
 *
 * Requires:
 *   - Backend running on http://127.0.0.1:8001
 *   - Next.js dev server started by Playwright webServer config on :3000
 */
import { test, expect } from '@playwright/test'

const PAGE = '/test-sdk'
const TIMEOUT = 15_000

test.describe('SDK Integration Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE)
    // Wait for the dashboard shell to mount (not loading spinner)
    await page.waitForSelector('[data-testid="yes-links-dashboard"]', { timeout: TIMEOUT })
  })

  test('(1) YesLinksDashboard renders without dataSource — no crash, links section visible', async ({ page }) => {
    // Links section must be in the DOM
    await expect(page.locator('[data-testid="yes-links-dashboard-links"]')).toBeVisible({
      timeout: TIMEOUT,
    })

    // No unhandled error boundary text visible
    await expect(
      page.getByText(/something went wrong|unhandled error|runtime error/i),
    ).not.toBeVisible()
  })

  test('(2) Stats section renders with real numbers from backend', async ({ page }) => {
    // Stats section in DOM
    const statsSection = page.locator('[data-testid="yes-links-dashboard-stats"]')
    await expect(statsSection).toBeVisible({ timeout: TIMEOUT })

    // Wait for loading state to clear (no skeletons / "loading" text)
    await expect(page.getByText(/^loading\.\.\.$/i)).not.toBeVisible({ timeout: TIMEOUT })

    // At least one numeric value is rendered in the stats section
    const numericText = statsSection.getByText(/\d+/)
    await expect(numericText.first()).toBeVisible({ timeout: TIMEOUT })
  })

  test('(3) Create link form submits and new link appears in list', async ({ page }) => {
    // Find and click the create button
    const createBtn = page.getByRole('button', { name: /crear enlace|new link|create/i })
    await expect(createBtn).toBeVisible({ timeout: TIMEOUT })
    await createBtn.click()

    // Fill the target URL field
    const uniqueUrl = `https://e2e-sdk-test-${Date.now()}.example.com`
    const urlInput = page.getByLabel(/url|target/i).first()
    await expect(urlInput).toBeVisible({ timeout: 5_000 })
    await urlInput.fill(uniqueUrl)

    // Submit the form
    const submitBtn = page.getByRole('button', { name: /create|save|crear|submit/i }).last()
    await submitBtn.click()

    // New link should appear in the list
    await expect(page.getByText(uniqueUrl)).toBeVisible({ timeout: TIMEOUT })
  })
})
