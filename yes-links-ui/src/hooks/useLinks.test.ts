/**
 * Tests for useLinks hook — TF:YL-S1-T6
 * Mocks apiClient (not global.fetch) to verify SDK wiring.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { YesLinksProvider } from '@/providers/YesLinksProvider'
import { useLinks } from './useLinks'

// Mock the apiClient module so we can control what getLinks returns
const mockGetLinks = vi.fn()
vi.mock('@/lib/apiClient', () => ({
  createApiClient: vi.fn(() => ({ getLinks: mockGetLinks })),
  ApiError: class ApiError extends Error {
    status: number
    constructor(status: number, message: string) {
      super(message)
      this.status = status
    }
  },
}))

const TOKEN = 'test-token'
const BASE_URL = 'https://api.example.com'

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(YesLinksProvider, { token: TOKEN, baseUrl: BASE_URL }, children)
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetLinks.mockResolvedValue({ items: [], total: 0 })
})

describe('useLinks (SDK-wired)', () => {
  it('calls apiClient.getLinks when mounted', async () => {
    renderHook(() => useLinks({}), { wrapper })
    await waitFor(() => expect(mockGetLinks).toHaveBeenCalled())
  })

  it('passes limit param (default 20)', async () => {
    renderHook(() => useLinks({}), { wrapper })
    await waitFor(() => expect(mockGetLinks).toHaveBeenCalled())
    expect(mockGetLinks.mock.calls[0][0]).toMatchObject({ limit: 20 })
  })

  it('passes campaign, tags, search params through to apiClient', async () => {
    renderHook(
      () => useLinks({ campaign: 'summer', tags: 'promo', search: 'foo' }),
      { wrapper }
    )
    await waitFor(() => expect(mockGetLinks).toHaveBeenCalled())
    expect(mockGetLinks.mock.calls[0][0]).toMatchObject({
      campaign: 'summer',
      tags: 'promo',
      search: 'foo',
    })
  })

  it('returns links from apiClient response', async () => {
    const items = [{ id: '1', short_code: 'abc', target_url: 'https://example.com' }]
    mockGetLinks.mockResolvedValueOnce({ items, total: 1 })
    const { result } = renderHook(() => useLinks({}), { wrapper })
    await waitFor(() => expect(result.current.state).toBe('success'))
    expect(result.current.links).toHaveLength(1)
    expect(result.current.links[0].short_code).toBe('abc')
  })

  it('sets state to error when apiClient throws', async () => {
    mockGetLinks.mockRejectedValueOnce(new Error('Network failure'))
    const { result } = renderHook(() => useLinks({}), { wrapper })
    await waitFor(() => expect(result.current.state).toBe('error'))
    expect(result.current.error?.message).toBe('Network failure')
  })

  it('passes clientScope through to apiClient.getLinks', async () => {
    const clientScope = { campaign: 'enterprise', tags: ['portal'] }
    renderHook(() => useLinks({ clientScope }), { wrapper })
    await waitFor(() => expect(mockGetLinks).toHaveBeenCalled())
    expect(mockGetLinks.mock.calls[0][0]).toMatchObject({ clientScope })
  })

  it('refetches when clientScope changes', async () => {
    const { rerender } = renderHook(
      ({ scope }: { scope: { campaign: string } }) => useLinks({ clientScope: scope }),
      { wrapper, initialProps: { scope: { campaign: 'alpha' } } }
    )
    await waitFor(() => expect(mockGetLinks).toHaveBeenCalledTimes(1))
    rerender({ scope: { campaign: 'beta' } })
    await waitFor(() => expect(mockGetLinks).toHaveBeenCalledTimes(2))
    expect(mockGetLinks.mock.calls[1][0]).toMatchObject({ clientScope: { campaign: 'beta' } })
  })

  it('does not fetch when token is absent', async () => {
    function noTokenWrapper({ children }: { children: React.ReactNode }) {
      // @ts-expect-error testing missing token
      return React.createElement(YesLinksProvider, { token: null, baseUrl: BASE_URL }, children)
    }
    renderHook(() => useLinks({}), { wrapper: noTokenWrapper })
    // Wait a tick and verify no call was made
    await new Promise((r) => setTimeout(r, 50))
    expect(mockGetLinks).not.toHaveBeenCalled()
  })
})
