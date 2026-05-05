import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import React from 'react'
import { YesLinksDashboard } from './YesLinksDashboard'
import { YesLinksProvider } from '@/providers/YesLinksProvider'

// ── Managed-mode mocks (T1.8) ─────────────────────────────────────────────────
const mockGetLinks = vi.fn()
const mockGetDashboardSummary = vi.fn()

vi.mock('@/lib/apiClient', () => ({
  createApiClient: vi.fn(() => ({
    getLinks: mockGetLinks,
    getDashboardSummary: mockGetDashboardSummary,
    getCampaignsStats: vi.fn().mockResolvedValue([]),
  })),
  ApiError: class ApiError extends Error {
    status: number
    constructor(status: number, message: string) {
      super(message)
      this.status = status
    }
  },
}))

const managedLinks = [
  {
    id: '1',
    short_code: 'sdk-01',
    target_url: 'https://example.com',
    campaign: 'sdk-campaign',
    tags: [],
    clicks: 5,
  },
]

const managedSummary = {
  total_links: 1,
  total_clicks: 5,
  avg_clicks_per_link: 5,
  top_campaigns: [],
  trends: { clicks_last_7d: 5, clicks_prev_7d: 3, pct_change: 66.7 },
}

const mockLinks = [
  {
    id: '1',
    short_code: 'PRD-2024',
    target_url: 'https://acme.com/pricing',
    campaign: 'Enterprise / Q1 Launch',
    tags: ['enterprise'],
    clicks: 2847,
    sparkline_data: [32, 30, 34, 35],
  },
]

const mockStats = {
  kpiData: {
    total_clicks: 15430,
    total_links: 8,
    active_links: 6,
    ctr: 18.7,
    trends: {
      clicks: 12.5,
      ctr: 3.2,
    },
  },
  trendData: [
    { date: '2026-03-01', clicks: 120, conversions: 110 },
    { date: '2026-03-02', clicks: 150, conversions: 130 },
  ],
}

// ── Managed-mode tests (T1.8) ─────────────────────────────────────────────────
describe('YesLinksDashboard — managed mode (no dataSource)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetLinks.mockResolvedValue({ items: managedLinks, total: 1 })
    mockGetDashboardSummary.mockResolvedValue(managedSummary)
  })

  function ManagedDashboard() {
    return React.createElement(
      YesLinksProvider,
      { token: 'test-token', baseUrl: 'https://api.example.com' },
      React.createElement(YesLinksDashboard, {})
    )
  }

  it('renders without dataSource or scope props', async () => {
    render(React.createElement(ManagedDashboard))
    // Just verify it doesn't throw and renders something
    await waitFor(() => {
      expect(screen.getByTestId('yes-links-dashboard-links')).toBeInTheDocument()
    })
  })

  it('calls apiClient.getLinks in managed mode', async () => {
    render(React.createElement(ManagedDashboard))
    await waitFor(() => expect(mockGetLinks).toHaveBeenCalled())
  })

  it('calls apiClient.getDashboardSummary in managed mode', async () => {
    render(React.createElement(ManagedDashboard))
    await waitFor(() => expect(mockGetDashboardSummary).toHaveBeenCalled())
  })
})

// ── Explicit dataSource tests ─────────────────────────────────────────────────
describe('YesLinksDashboard', () => {
  it('loads links and stats with the resolved default scope', async () => {
    const loadLinks = vi.fn().mockResolvedValue({
      items: mockLinks,
      total: mockLinks.length,
    })
    const loadStats = vi.fn().mockResolvedValue(mockStats)

    render(
      <YesLinksDashboard
        scope={{
          mode: 'campaign',
          label: 'Campaign',
          options: [{ label: 'Enterprise', value: 'enterprise-q1' }],
          defaultValue: 'enterprise-q1',
        }}
        dataSource={{ loadLinks, loadStats }}
      />,
    )

    await waitFor(() => {
      expect(loadLinks).toHaveBeenCalledWith({
        scope: { type: 'campaign', value: 'enterprise-q1' },
        filters: { search: '', campaign: '', tags: '' },
      })
      expect(loadStats).toHaveBeenCalledWith({
        scope: { type: 'campaign', value: 'enterprise-q1' },
        range: undefined,
      })
    })
  }, 15000)

  it('resolves custom scope values before calling loaders', async () => {
    const loadLinks = vi.fn().mockResolvedValue({
      items: mockLinks,
      total: mockLinks.length,
    })

    render(
      <YesLinksDashboard
        sections={{ stats: false }}
        scope={{
          mode: 'custom',
          label: 'Business Unit',
          options: [{ label: 'Growth', value: 'growth' }],
          defaultValue: 'growth',
          resolver: (value) => ({ type: 'business_unit', value }),
        }}
        dataSource={{ loadLinks }}
      />,
    )

    await waitFor(() => {
      expect(loadLinks).toHaveBeenCalledWith({
        scope: { type: 'business_unit', value: 'growth' },
        filters: { search: '', campaign: '', tags: '' },
      })
    })
  })

  it('obeys section visibility flags', async () => {
    const loadLinks = vi.fn().mockResolvedValue({
      items: mockLinks,
      total: mockLinks.length,
    })

    render(
      <YesLinksDashboard
        sections={{ stats: false }}
        scope={{
          mode: 'tag',
          label: 'Tag',
          options: [{ label: 'enterprise', value: 'enterprise' }],
        }}
        dataSource={{ loadLinks }}
      />,
    )

    await waitFor(() => {
      expect(loadLinks).toHaveBeenCalled()
    })

    expect(screen.queryByTestId('yes-links-dashboard-stats')).not.toBeInTheDocument()
    expect(screen.getByTestId('yes-links-dashboard-links')).toBeInTheDocument()
  })

  it('shows create action only when createLink is configured', async () => {
    const loadLinks = vi.fn().mockResolvedValue({
      items: mockLinks,
      total: mockLinks.length,
    })

    const { rerender } = render(
      <YesLinksDashboard
        sections={{ stats: false }}
        scope={{
          mode: 'campaign',
          label: 'Campaign',
          options: [{ label: 'Enterprise', value: 'enterprise-q1' }],
        }}
        dataSource={{ loadLinks }}
      />,
    )

    await waitFor(() => {
      expect(loadLinks).toHaveBeenCalled()
    })

    expect(
      screen.queryByRole('button', { name: /crear enlace/i }),
    ).not.toBeInTheDocument()

    rerender(
      <YesLinksDashboard
        sections={{ stats: false }}
        scope={{
          mode: 'campaign',
          label: 'Campaign',
          options: [{ label: 'Enterprise', value: 'enterprise-q1' }],
        }}
        dataSource={{
          loadLinks,
          createLink: vi.fn().mockResolvedValue(undefined),
        }}
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /crear enlace/i })).toBeInTheDocument()
    })
  }, 15000)

  it('lets users switch scope options and reload data', async () => {
    const loadLinks = vi.fn().mockResolvedValue({
      items: mockLinks,
      total: mockLinks.length,
    })

    render(
      <YesLinksDashboard
        sections={{ stats: false }}
        scope={{
          mode: 'campaign',
          label: 'Campaign',
          options: [
            { label: 'Enterprise', value: 'enterprise-q1' },
            { label: 'Content', value: 'content-ai' },
          ],
          defaultValue: 'enterprise-q1',
        }}
        dataSource={{ loadLinks }}
      />,
    )

    await waitFor(() => {
      expect(loadLinks).toHaveBeenCalledTimes(1)
    })

    fireEvent.change(screen.getByLabelText(/seleccionar campaign/i), {
      target: { value: 'content-ai' },
    })

    await waitFor(() => {
      expect(loadLinks).toHaveBeenLastCalledWith({
        scope: { type: 'campaign', value: 'content-ai' },
        filters: { search: '', campaign: '', tags: '' },
      })
    })
  })
})
