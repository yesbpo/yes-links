/**
 * SDK Surface Tests — Layer E
 *
 * Verifies that @yes/links-ui exports all required symbols with correct shapes.
 * These tests run in Vitest node environment — no DOM, no React.
 * They are the first thing that breaks when the SDK dist is missing or misbuilt.
 */
import { describe, it, expect } from 'vitest'
import {
  YesLinksProvider,
  YesLinksDashboard,
  useLinks,
  useStats,
  createApiClient,
  ApiError,
} from '@yes/links-ui'

describe('SDK surface — exported symbols', () => {
  it('YesLinksProvider is exported and is a function', () => {
    expect(typeof YesLinksProvider).toBe('function')
  })

  it('YesLinksDashboard is exported and is a function', () => {
    expect(typeof YesLinksDashboard).toBe('function')
  })

  it('useLinks is exported and is a function', () => {
    expect(typeof useLinks).toBe('function')
  })

  it('useStats is exported and is a function', () => {
    expect(typeof useStats).toBe('function')
  })

  it('createApiClient is exported and is a function', () => {
    expect(typeof createApiClient).toBe('function')
  })

  it('ApiError is exported and constructable with .status and .message', () => {
    expect(typeof ApiError).toBe('function')
    const err = new ApiError(404, 'not found')
    expect(err.status).toBe(404)
    expect(err.message).toBe('not found')
    expect(err).toBeInstanceOf(Error)
  })

  it('createApiClient returns object with all 6 required methods', () => {
    const client = createApiClient({ token: 'test-token', baseUrl: 'http://localhost:8001' })
    const requiredMethods = [
      'getLinks',
      'getDashboardSummary',
      'getCampaignsStats',
      'createLink',
      'updateLink',
      'deleteLink',
    ]
    for (const method of requiredMethods) {
      expect(typeof (client as Record<string, unknown>)[method]).toBe('function')
    }
  })
})
