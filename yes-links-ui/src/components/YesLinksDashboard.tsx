'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { BarChart3, Download, Link2, Plus } from 'lucide-react'
import {
  CreateLinkOverlay,
  type CreateLinkPayload,
} from '@/components/CreateLinkOverlay'
import { FilterBar } from '@/components/FilterBar'
import { KPIStats, type KPIStatsData } from '@/components/KPIStats'
import { LinkList } from '@/components/LinkList'
import { type Link } from '@/components/LinkCard'
import {
  PerformanceTrends,
  type TrendData,
} from '@/components/PerformanceTrends'
import { YesLinksShell } from '@/components/YesLinksShell'

export interface DashboardScopeOption {
  label: string
  value: string
}

export interface ResolvedDashboardScope {
  type: string
  value: string
}

export interface DashboardFilters {
  search: string
  campaign: string
  tags: string
}

export interface DashboardRange {
  from?: string
  to?: string
}

export interface DashboardSections {
  links?: boolean
  stats?: boolean
}

interface DashboardScopeBase {
  label?: string
  options: DashboardScopeOption[]
  defaultValue?: string
}

export interface CampaignDashboardScope extends DashboardScopeBase {
  mode: 'campaign'
}

export interface TagDashboardScope extends DashboardScopeBase {
  mode: 'tag'
}

export interface CustomDashboardScope extends DashboardScopeBase {
  mode: 'custom'
  label: string
  resolver: (value: string) => ResolvedDashboardScope
}

export type DashboardScope =
  | CampaignDashboardScope
  | TagDashboardScope
  | CustomDashboardScope

export interface DashboardLoadLinksInput {
  scope: ResolvedDashboardScope
  filters: DashboardFilters
  pagination?: {
    page?: number
    pageSize?: number
  }
}

export interface DashboardLoadStatsInput {
  scope: ResolvedDashboardScope
  range?: DashboardRange
}

export interface DashboardCreateLinkInput extends CreateLinkPayload {
  scope: ResolvedDashboardScope
}

export interface DashboardDataSource {
  loadLinks: (input: DashboardLoadLinksInput) => Promise<{
    items: Link[]
    total?: number
  }>
  loadStats?: (input: DashboardLoadStatsInput) => Promise<{
    kpiData: KPIStatsData
    trendData: TrendData[]
  }>
  createLink?: (payload: DashboardCreateLinkInput) => Promise<void>
  exportReport?: (input: DashboardLoadStatsInput) => Promise<void>
}

export interface YesLinksDashboardProps {
  sections?: DashboardSections
  scope: DashboardScope
  dataSource: DashboardDataSource
  range?: DashboardRange
  initialViewMode?: 'grid' | 'list'
}

const defaultFilters: DashboardFilters = {
  search: '',
  campaign: '',
  tags: '',
}

const infoPanelStyle = {
  border: '1px solid var(--yes-border-subtle)',
  boxShadow: 'var(--yes-shadow-sm)',
} as const

function getScopeLabel(scope: DashboardScope) {
  if (scope.label) {
    return scope.label
  }

  if (scope.mode === 'campaign') {
    return 'Campana'
  }

  if (scope.mode === 'tag') {
    return 'Tag'
  }

  return 'Scope'
}

function getResolvedScope(
  scope: DashboardScope,
  selectedValue: string,
): ResolvedDashboardScope {
  if (scope.mode === 'custom') {
    return scope.resolver(selectedValue)
  }

  return {
    type: scope.mode,
    value: selectedValue,
  }
}

export const YesLinksDashboard: React.FC<YesLinksDashboardProps> = ({
  sections,
  scope,
  dataSource,
  range,
  initialViewMode = 'list',
}) => {
  const showLinks = sections?.links !== false
  const showStats = sections?.stats !== false
  const defaultScopeValue = scope.defaultValue ?? scope.options[0]?.value ?? ''

  const [selectedScopeValue, setSelectedScopeValue] = useState(defaultScopeValue)
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  const [links, setLinks] = useState<Link[]>([])
  const [totalLinks, setTotalLinks] = useState(0)
  const [linksState, setLinksState] = useState<'loading' | 'success' | 'error'>('loading')
  const [linksError, setLinksError] = useState<string>()

  const [kpiData, setKpiData] = useState<KPIStatsData | null>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [statsState, setStatsState] = useState<'loading' | 'success' | 'error'>('loading')
  const [statsError, setStatsError] = useState<string>()

  useEffect(() => {
    setSelectedScopeValue(defaultScopeValue)
  }, [defaultScopeValue])

  const resolvedScope = useMemo(
    () => getResolvedScope(scope, selectedScopeValue),
    [scope, selectedScopeValue],
  )

  useEffect(() => {
    if (!showLinks) {
      return
    }

    let cancelled = false

    async function loadLinks() {
      setLinksState('loading')
      setLinksError(undefined)

      try {
        const response = await dataSource.loadLinks({
          scope: resolvedScope,
          filters,
        })

        if (cancelled) {
          return
        }

        setLinks(response.items)
        setTotalLinks(response.total ?? response.items.length)
        setLinksState('success')
      } catch (error) {
        if (cancelled) {
          return
        }

        setLinks([])
        setTotalLinks(0)
        setLinksError(
          error instanceof Error ? error.message : 'No se pudieron cargar los enlaces.',
        )
        setLinksState('error')
      }
    }

    void loadLinks()

    return () => {
      cancelled = true
    }
  }, [dataSource, filters, reloadToken, resolvedScope, showLinks])

  useEffect(() => {
    if (!showStats || !dataSource.loadStats) {
      return
    }

    let cancelled = false

    async function loadStats() {
      setStatsState('loading')
      setStatsError(undefined)

      try {
        const response = await dataSource.loadStats?.({
          scope: resolvedScope,
          range,
        })

        if (cancelled || !response) {
          return
        }

        setKpiData(response.kpiData)
        setTrendData(response.trendData)
        setStatsState('success')
      } catch (error) {
        if (cancelled) {
          return
        }

        setKpiData(null)
        setTrendData([])
        setStatsError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las estadisticas.',
        )
        setStatsState('error')
      }
    }

    void loadStats()

    return () => {
      cancelled = true
    }
  }, [dataSource, range, reloadToken, resolvedScope, showStats])

  const campaigns = Array.from(
    new Set(links.map((link) => link.campaign || '').filter(Boolean)),
  )
  const tags = Array.from(new Set(links.flatMap((link) => link.tags || [])))
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0)
  const activeShellTab = showLinks && showStats ? 'dashboard' : showStats ? 'stats' : 'links'
  const scopeLabel = getScopeLabel(scope)

  async function handleExport() {
    if (!dataSource.exportReport) {
      return
    }

    await dataSource.exportReport({
      scope: resolvedScope,
      range,
    })
  }

  async function handleCreateLink(payload: CreateLinkPayload) {
    if (!dataSource.createLink) {
      return
    }

    await dataSource.createLink({
      ...payload,
      scope: resolvedScope,
    })

    setReloadToken((current) => current + 1)
  }

  return (
    <YesLinksShell activeTab={activeShellTab}>
      <div className="space-y-6" data-testid="yes-links-dashboard">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--yes-surface-tertiary)]"
              style={{ border: '1px solid var(--yes-border-subtle)' }}
            >
              {showLinks && showStats ? (
                <BarChart3 className="h-5 w-5 text-[var(--yes-accent-primary)]" />
              ) : (
                <Link2 className="h-5 w-5 text-[var(--yes-accent-primary)]" />
              )}
            </div>
            <div>
              <h1
                className="text-[34px] font-semibold text-[var(--yes-text-primary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                Dashboard Yes Links
              </h1>
              <p
                className="text-sm text-[var(--yes-text-secondary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                Gestiona enlaces y analiticas por {scopeLabel.toLowerCase()} para toda la organizacion
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label
              className="flex min-w-[220px] flex-col gap-1 text-xs font-semibold text-[var(--yes-text-secondary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              {scopeLabel.toUpperCase()}
              <select
                aria-label={`Seleccionar ${scopeLabel}`}
                value={selectedScopeValue}
                onChange={(event) => setSelectedScopeValue(event.target.value)}
                className="rounded-xl bg-[var(--yes-surface-primary)] px-4 py-2.5 text-sm font-medium text-[var(--yes-text-primary)] outline-none"
                style={{
                  border: '1px solid var(--yes-border-subtle)',
                  boxShadow: 'var(--yes-shadow-sm)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                }}
              >
                {scope.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {showStats && dataSource.exportReport && (
              <button
                onClick={() => void handleExport()}
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--yes-surface-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--yes-text-primary)] transition-colors hover:bg-[var(--yes-surface-tertiary)]"
                style={{
                  border: '1px solid var(--yes-border-subtle)',
                  boxShadow: 'var(--yes-shadow-md)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                }}
              >
                <Download className="h-4 w-4" />
                <span>Exportar Reporte</span>
              </button>
            )}

            {showLinks && dataSource.createLink && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                style={{
                  background: 'var(--yes-accent-primary)',
                  border: '1px solid var(--yes-border-subtle)',
                  boxShadow: 'var(--yes-shadow-md)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                }}
              >
                <Plus className="h-4 w-4" />
                <span>Crear Enlace</span>
              </button>
            )}
          </div>
        </div>

        {!showLinks && !showStats && (
          <section
            className="rounded-[20px] bg-[var(--yes-surface-primary)] p-6"
            style={infoPanelStyle}
          >
            <p
              className="text-sm text-[var(--yes-text-secondary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              Habilita al menos una seccion del dashboard para renderizar enlaces o estadisticas.
            </p>
          </section>
        )}

        {showStats && (
          <section className="space-y-4" data-testid="yes-links-dashboard-stats">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-semibold text-[var(--yes-text-primary)]"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  Estadisticas Globales
                </h2>
                <p
                  className="text-sm text-[var(--yes-text-secondary)]"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  Rendimiento consolidado para {scope.options.find((option) => option.value === selectedScopeValue)?.label || selectedScopeValue}
                </p>
              </div>
            </div>

            {dataSource.loadStats ? (
              <>
                <KPIStats state={statsState} data={kpiData} error={statsError} />
                <PerformanceTrends
                  state={statsState}
                  data={statsState === 'success' ? trendData : []}
                />
              </>
            ) : (
              <div
                className="rounded-[20px] bg-[var(--yes-surface-primary)] p-6"
                style={infoPanelStyle}
              >
                <p
                  className="text-sm text-[var(--yes-text-secondary)]"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  Agrega `dataSource.loadStats` para habilitar la seccion de analiticas.
                </p>
              </div>
            )}
          </section>
        )}

        {showLinks && (
          <section className="space-y-4" data-testid="yes-links-dashboard-links">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-semibold text-[var(--yes-text-primary)]"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  Enlaces Activos
                </h2>
                <p
                  className="text-sm text-[var(--yes-text-secondary)]"
                  style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                >
                  {totalLinks.toLocaleString()} enlaces • {totalClicks.toLocaleString()} clics totales
                </p>
              </div>
            </div>

            <FilterBar
              campaigns={campaigns}
              tags={tags}
              onFilterChange={setFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onCreateClick={dataSource.createLink ? () => setIsCreateOpen(true) : undefined}
              showCampaignFilter={scope.mode !== 'campaign'}
              showTagsFilter={scope.mode !== 'tag'}
            />

            <LinkList
              state={linksState}
              links={links}
              viewMode={viewMode}
              error={linksError}
              onRetry={() => setReloadToken((current) => current + 1)}
              onCreateFirst={dataSource.createLink ? () => setIsCreateOpen(true) : undefined}
            />
          </section>
        )}
      </div>

      {dataSource.createLink && (
        <CreateLinkOverlay
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateLink}
        />
      )}
    </YesLinksShell>
  )
}
