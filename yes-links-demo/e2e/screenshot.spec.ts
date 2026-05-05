import { test, expect } from '@playwright/test'

test('debug page render', async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
  page.on('pageerror', err => errors.push(err.message))

  await page.route('http://127.0.0.1:8001/dashboard/summary**', r => r.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ total_links: 12, total_clicks: 248, active_links: 10, ctr: 4.2 })
  }))
  await page.route('http://127.0.0.1:8001/links**', r => r.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ items: [{ id: 1, short_code: 'abc123', target_url: 'https://example.com', clicks: 24, created_at: '2026-01-01' }], total: 1, page: 1, size: 20 })
  }))

  await page.goto('http://localhost:5173')
  await page.waitForTimeout(3000)
  
  const bodyHTML = await page.evaluate(() => document.body.innerHTML.substring(0, 500))
  console.log('BODY:', bodyHTML)
  console.log('ERRORS:', JSON.stringify(errors))
  
  await page.screenshot({ path: '/tmp/demo-debug.png', fullPage: true })
})
