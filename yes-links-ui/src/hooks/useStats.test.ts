/**
 * Tests for useStats hook — TF:YL-S1-T7
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { YesLinksProvider } from '@/providers/YesLinksProvider'
import { useStats } from './useStats'
import type { KPIStatsData } from '@/components/KPIStats'
import type { TrendData } from '@/components/PerformanceTrends'

const mockGetDashboardSummary = vi.fn()
const mockGetCampaignsStats = vi.fn()

vi.mock('@/lib/apiClient', () => ({
  createApiClient: vi.fn(() => ({
    getDashboardSummary: mockGetDashboardSummary,
    getCampaignsStats: mockGetCampaignsStats,
    getLinks: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  })),
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

const SUMMARY_RESPONSE = {
  total_links: 10,
  total_clicks: 42,
  avg_clicks_per_link: 4.2,
  top_campaigns: [{ campaign: 'summer', clicks: 20 }],
  trends: { clicks_last_7d: 10, clicks_prev_7d: 8, pct_change: 25.0 },
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetDashboardSummary.mockResolvedValue(SUMMARY_RESPONSE)
  mockGetCampaignsStats.mockResolvedValue([])
})

describe('useStats', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => useStats(), { wrapper })
    expect(result.current.state).toBe('loading')
  })

  it('calls getDashboardSummary on mount', async () => {
    renderHook(() => useStats(), { wrapper })
    await waitFor(() => expect(mockGetDashboardSummary).toHaveBeenCalled())
  })

  it('transitions to success state', async () => {
    const { result } = renderHook(() => useStats(), { wrapper })
    await waitFor(() => expect(result.current.state).toBe('success'))
  })

  it('maps total_links and total_clicks to kpiData', async () => {
    const { result } = renderHook(() => useStats(), { wrapper })
    await waitFor(() => expect(result.current.state).toBe('success'))
    const kpi = result.current.kpiData as KPIStatsData
    expect(kpi.total_links).toBe(10)
    expect(kpi.total_clicks).toBe(42)
  })

  it('maps active_links from total_links', async () => {
    const { result } = renderHook(() => useStats(), { wrapper })
    await waitFor(() => expect(result.current.state).toBe('success'))
    const kpi = result.current.kpiData as KPIStatsData
    expect(kpi.active_links).toBe(10)
  })

  it('maps trend pct_change to kpiData.trends.clicks', async () => {
    const { result } = renderHook(() => useStats(), { wrapper })
    await waitFor(() => expect(result.current.state).toBe('success'))
    const kpi = result.current.kpiData as KPIStatsData
    expect(kpi.trends?.clicks).toBe(25.0)
  })

  it('returns trendData as an array', async () => {
    const { result } = renderHook(() => useStats(), { wrapper })
    await waitFor(() => expect(result.current.state).toBe('success'))
    expect(Array.isArray(result.current.trendData)).toBe(true)
  })

  it('transitions to error state on API failure', async () => {
    mockGetDashboardSummary.mockRejectedValueOnce(new Error('API down'))
    const { result } = renderHook(() => useStats(), { wrapper })
    await waitFor(() => expect(result.current.state).toBe('error'))
    expect(result.current.error?.message).toBe('API down')
  })

  it('kpiData is null while loading', () => {
    const { result } = renderHook(() => useStats(), { wrapper })
    expect(result.current.kpiData).toBeNull()
  })

  it('exposes mutate to re-fetch', async () => {
    const { result } = renderHook(() => useStats(), { wrapper })
    await waitFor(() => expect(result.current.state).toBe('success'))
    mockGetDashboardSummary.mockResolvedValueOnce(SUMMARY_RESPONSE)
    await result.current.mutate()
    expect(mockGetDashboardSummary).toHaveBeenCalledTimes(2)
  })

  it('passes clientScope to getDashboardSummary', async () => {
    const clientScope = { campaign: 'summer', tags: ['promo'] }
    renderHook(() => useStats({ clientScope }), { wrapper })
    await waitFor(() => expect(mockGetDashboardSummary).toHaveBeenCalled())
    expect(mockGetDashboardSummary.mock.calls[0][0]).toMatchObject({ clientScope })
  })

  it('refetches when clientScope changes', async () => {
    const { rerender } = renderHook(
      ({ scope }: { scope: { campaign: string } }) => useStats({ clientScope: scope }),
      { wrapper, initialProps: { scope: { campaign: 'alpha' } } }
    )
    await waitFor(() => expect(mockGetDashboardSummary).toHaveBeenCalledTimes(1))
    rerender({ scope: { campaign: 'beta' } })
    await waitFor(() => expect(mockGetDashboardSummary).toHaveBeenCalledTimes(2))
    expect(mockGetDashboardSummary.mock.calls[1][0]).toMatchObject({ clientScope: { campaign: 'beta' } })
  })

  it('does not fetch when token is absent', async () => {
    function noTokenWrapper({ children }: { children: React.ReactNode }) {
      // @ts-expect-error testing null token
      return React.createElement(YesLinksProvider, { token: null, baseUrl: BASE_URL }, children)
    }
    renderHook(() => useStats(), { wrapper: noTokenWrapper })
    await new Promise((r) => setTimeout(r, 50))
    expect(mockGetDashboardSummary).not.toHaveBeenCalled()
  })
})
