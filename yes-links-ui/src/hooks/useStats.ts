/**
 * useStats — fetches KPI + campaign stats via SDK apiClient.
 * TF:YL-S1-T7
 *
 * Maps backend DashboardSummaryResponse → KPIStatsData + TrendData[].
 */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createApiClient, type ClientScope } from '@/lib/apiClient'
import { useYesLinks } from '@/providers/YesLinksProvider'
import type { KPIStatsData } from '@/components/KPIStats'
import type { TrendData } from '@/components/PerformanceTrends'

type State = 'idle' | 'loading' | 'success' | 'error'

interface BackendSummary {
  total_links: number
  total_clicks: number
  avg_clicks_per_link: number
  top_campaigns: Array<{ campaign: string; clicks: number }>
  trends: {
    clicks_last_7d: number
    clicks_prev_7d: number
    pct_change: number | null
  }
}

export interface UseStatsOptions {
  /** Restrict campaign stats to a date range */
  range?: { from?: string; to?: string }
  /** When false, skip fetching (used when dataSource is provided externally). */
  enabled?: boolean
  /** Scope all fetches to a specific client's data subset */
  clientScope?: ClientScope
}

export interface UseStatsResult {
  kpiData: KPIStatsData | null
  trendData: TrendData[]
  state: State
  error: Error | null
  mutate: () => Promise<void>
}

function mapSummaryToKpi(summary: BackendSummary): KPIStatsData {
  return {
    total_clicks: summary.total_clicks,
    total_links: summary.total_links,
    active_links: summary.total_links, // approximation until backend tracks active separately
    ctr: 0, // not yet tracked by backend
    trends: {
      clicks: summary.trends.pct_change ?? undefined,
      ctr: undefined,
    },
  }
}

export const useStats = (options: UseStatsOptions = {}): UseStatsResult => {
  const { token, baseUrl } = useYesLinks()
  const { enabled = true, clientScope } = options

  const [kpiData, setKpiData] = useState<KPIStatsData | null>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [state, setState] = useState<State>('loading')
  const [error, setError] = useState<Error | null>(null)

  const client = useMemo(() => {
    if (!token) return null
    return createApiClient({ token, baseUrl })
  }, [token, baseUrl])

  const fetchStats = useCallback(async () => {
    if (!client || !enabled) return

    setState('loading')
    setError(null)

    try {
      const summary = (await client.getDashboardSummary({ clientScope })) as BackendSummary
      setKpiData(mapSummaryToKpi(summary))
      // TrendData is derived from summary trends; time-series will come from a future endpoint
      setTrendData([])
      setState('success')
    } catch (err: unknown) {
      setState('error')
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }, [client, enabled, clientScope])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { kpiData, trendData, state, error, mutate: fetchStats }
}
