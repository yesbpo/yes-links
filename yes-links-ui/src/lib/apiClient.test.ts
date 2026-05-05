/**
 * Unit tests for createApiClient()
 * TF:YL-S1-T5 — RED phase
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createApiClient, ApiError } from './apiClient'

const TOKEN = 'test-jwt-token'
const BASE_URL = 'https://api.example.com'

function makeClient() {
  return createApiClient({ token: TOKEN, baseUrl: BASE_URL })
}

function mockFetchOk(body: unknown, status = 200) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

function mockFetchError(status: number, detail = 'Not found') {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify({ detail }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
})

// ── Authorization header ──────────────────────────────────────────────────────

describe('Authorization', () => {
  it('injects Bearer token on every request', async () => {
    const spy = mockFetchOk({ items: [], total: 0 })
    await makeClient().getLinks({})
    const headers = spy.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers['Authorization']).toBe(`Bearer ${TOKEN}`)
  })

  it('injects x-request-id header on every request', async () => {
    const spy = mockFetchOk({ items: [], total: 0 })
    await makeClient().getLinks({})
    const headers = spy.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers['x-request-id']).toBeTruthy()
    expect(typeof headers['x-request-id']).toBe('string')
    expect(headers['x-request-id'].length).toBeGreaterThan(0)
  })
})

// ── getLinks ──────────────────────────────────────────────────────────────────

describe('getLinks', () => {
  it('calls GET /links', async () => {
    const spy = mockFetchOk({ items: [], total: 0 })
    await makeClient().getLinks({})
    expect(spy.mock.calls[0][0]).toContain('/links')
    expect((spy.mock.calls[0][1]?.method ?? 'GET').toUpperCase()).toBe('GET')
  })

  it('passes campaign filter as query param', async () => {
    const spy = mockFetchOk({ items: [], total: 0 })
    await makeClient().getLinks({ campaign: 'summer' })
    expect(spy.mock.calls[0][0]).toContain('campaign=summer')
  })

  it('passes search, limit, offset params', async () => {
    const spy = mockFetchOk({ items: [], total: 0 })
    await makeClient().getLinks({ search: 'foo', limit: 10, offset: 20 })
    const url = spy.mock.calls[0][0] as string
    expect(url).toContain('search=foo')
    expect(url).toContain('limit=10')
    expect(url).toContain('offset=20')
  })

  it('returns the parsed response body', async () => {
    const payload = { items: [{ id: '1', short_code: 'abc' }], total: 1 }
    mockFetchOk(payload)
    const result = await makeClient().getLinks({})
    expect(result).toEqual(payload)
  })
})

// ── getDashboardSummary ───────────────────────────────────────────────────────

describe('getDashboardSummary', () => {
  it('calls GET /dashboard/summary', async () => {
    const spy = mockFetchOk({ total_links: 5 })
    await makeClient().getDashboardSummary()
    expect(spy.mock.calls[0][0]).toContain('/dashboard/summary')
  })

  it('returns parsed response', async () => {
    const payload = { total_links: 5, total_clicks: 42 }
    mockFetchOk(payload)
    const result = await makeClient().getDashboardSummary()
    expect(result).toEqual(payload)
  })
})

// ── getCampaignsStats ─────────────────────────────────────────────────────────

describe('getCampaignsStats', () => {
  it('calls GET /campaigns/stats', async () => {
    const spy = mockFetchOk([])
    await makeClient().getCampaignsStats()
    expect(spy.mock.calls[0][0]).toContain('/campaigns/stats')
  })

  it('passes from/to params when provided', async () => {
    const spy = mockFetchOk([])
    const from = '2026-01-01T00:00:00Z'
    const to = '2026-01-31T23:59:59Z'
    await makeClient().getCampaignsStats({ from, to })
    const url = spy.mock.calls[0][0] as string
    expect(url).toContain('from=')
    expect(url).toContain('to=')
  })
})

// ── createLink ────────────────────────────────────────────────────────────────

describe('createLink', () => {
  it('calls POST /links with JSON body', async () => {
    const payload = { id: 'new-id', short_code: 'xyz' }
    const spy = mockFetchOk(payload, 201)
    const input = { target_url: 'https://example.com', campaign: 'test' }
    await makeClient().createLink(input)
    expect((spy.mock.calls[0][1]?.method ?? '').toUpperCase()).toBe('POST')
    expect(spy.mock.calls[0][0]).toContain('/links')
    const body = JSON.parse(spy.mock.calls[0][1]?.body as string)
    expect(body).toEqual(input)
  })
})

// ── updateLink ────────────────────────────────────────────────────────────────

describe('updateLink', () => {
  it('calls PATCH /links/:id with JSON body', async () => {
    const spy = mockFetchOk({ id: 'abc' })
    const patch = { target_url: 'https://updated.com' }
    await makeClient().updateLink('abc', patch)
    const url = spy.mock.calls[0][0] as string
    expect(url).toContain('/links/abc')
    expect((spy.mock.calls[0][1]?.method ?? '').toUpperCase()).toBe('PATCH')
    const body = JSON.parse(spy.mock.calls[0][1]?.body as string)
    expect(body).toEqual(patch)
  })
})

// ── deleteLink ────────────────────────────────────────────────────────────────

describe('deleteLink', () => {
  it('calls DELETE /links/:id', async () => {
    const spy = mockFetchOk({ id: 'abc', deleted: true })
    await makeClient().deleteLink('abc')
    const url = spy.mock.calls[0][0] as string
    expect(url).toContain('/links/abc')
    expect((spy.mock.calls[0][1]?.method ?? '').toUpperCase()).toBe('DELETE')
  })
})

// ── clientScope — getLinks ────────────────────────────────────────────────────

describe('getLinks — clientScope', () => {
  it('passes clientScope.campaign as campaign param when no filter-level campaign is set', async () => {
    const spy = mockFetchOk({ items: [], total: 0 })
    await makeClient().getLinks({ clientScope: { campaign: 'enterprise' } })
    expect(spy.mock.calls[0][0]).toContain('campaign=enterprise')
  })

  it('passes clientScope.tags as repeated tags[] query params', async () => {
    const spy = mockFetchOk({ items: [], total: 0 })
    await makeClient().getLinks({ clientScope: { tags: ['promo', 'portal'] } })
    const url = spy.mock.calls[0][0] as string
    expect(url).toContain('tags%5B%5D=promo')
    expect(url).toContain('tags%5B%5D=portal')
  })

  it('filter-level campaign takes precedence over clientScope.campaign', async () => {
    const spy = mockFetchOk({ items: [], total: 0 })
    await makeClient().getLinks({ campaign: 'override', clientScope: { campaign: 'base' } })
    const url = spy.mock.calls[0][0] as string
    expect(url).toContain('campaign=override')
    expect(url).not.toContain('campaign=base')
  })

  it('omits scope params when clientScope is undefined', async () => {
    const spy = mockFetchOk({ items: [], total: 0 })
    await makeClient().getLinks({})
    const url = spy.mock.calls[0][0] as string
    expect(url).not.toContain('tags%5B%5D')
    // campaign param should not appear with no value
    expect(url).not.toMatch(/campaign=[^&]/)
  })
})

// ── clientScope — getDashboardSummary ─────────────────────────────────────────

describe('getDashboardSummary — clientScope', () => {
  it('passes clientScope.campaign as campaign query param', async () => {
    const spy = mockFetchOk({ total_links: 5 })
    await makeClient().getDashboardSummary({ clientScope: { campaign: 'summer' } })
    expect(spy.mock.calls[0][0]).toContain('campaign=summer')
  })

  it('passes clientScope.tags as repeated tags[] query params', async () => {
    const spy = mockFetchOk({ total_links: 5 })
    await makeClient().getDashboardSummary({ clientScope: { tags: ['a', 'b'] } })
    const url = spy.mock.calls[0][0] as string
    expect(url).toContain('tags%5B%5D=a')
    expect(url).toContain('tags%5B%5D=b')
  })

  it('omits params when clientScope is undefined (backwards compat)', async () => {
    const spy = mockFetchOk({ total_links: 5 })
    await makeClient().getDashboardSummary()
    const url = spy.mock.calls[0][0] as string
    expect(url).not.toContain('campaign=')
    expect(url).not.toContain('tags%5B%5D')
  })
})

// ── ApiError ──────────────────────────────────────────────────────────────────

describe('ApiError', () => {
  it('throws ApiError on 4xx responses', async () => {
    mockFetchError(404, 'Not found')
    await expect(makeClient().getLinks({})).rejects.toBeInstanceOf(ApiError)
  })

  it('ApiError carries status and message', async () => {
    mockFetchError(422, 'Unprocessable entity')
    try {
      await makeClient().getLinks({})
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      const err = e as ApiError
      expect(err.status).toBe(422)
      expect(err.message).toBeTruthy()
    }
  })

  it('throws ApiError on 5xx responses', async () => {
    mockFetchError(500, 'Internal server error')
    await expect(makeClient().getDashboardSummary()).rejects.toBeInstanceOf(ApiError)
  })
})
