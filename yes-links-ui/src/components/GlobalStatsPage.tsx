'use client'

import React from 'react'
import { BarChart3, Download } from 'lucide-react'
import { KPIStats } from '@/components/KPIStats'
import { PerformanceTrends } from '@/components/PerformanceTrends'
import { YesLinksShell } from '@/components/YesLinksShell'

const defaultKpiData = {
  total_clicks: 15430,
  total_links: 8,
  active_links: 6,
  ctr: 18.7,
  trends: {
    clicks: 12.5,
    ctr: 3.2,
  },
}

const defaultTrendData = [
  { date: '2026-02-10', clicks: 146, conversions: 138 },
  { date: '2026-02-11', clicks: 116, conversions: 108 },
  { date: '2026-02-12', clicks: 154, conversions: 152 },
  { date: '2026-02-13', clicks: 156, conversions: 154 },
  { date: '2026-02-14', clicks: 226, conversions: 224 },
  { date: '2026-02-15', clicks: 228, conversions: 226 },
  { date: '2026-02-16', clicks: 168, conversions: 162 },
  { date: '2026-02-17', clicks: 118, conversions: 112 },
  { date: '2026-02-18', clicks: 108, conversions: 104 },
  { date: '2026-02-19', clicks: 188, conversions: 194 },
  { date: '2026-02-20', clicks: 198, conversions: 202 },
  { date: '2026-02-21', clicks: 156, conversions: 150 },
  { date: '2026-02-22', clicks: 224, conversions: 222 },
  { date: '2026-02-23', clicks: 228, conversions: 226 },
  { date: '2026-02-24', clicks: 132, conversions: 130 },
  { date: '2026-02-25', clicks: 128, conversions: 126 },
  { date: '2026-02-26', clicks: 172, conversions: 170 },
  { date: '2026-02-27', clicks: 204, conversions: 200 },
  { date: '2026-02-28', clicks: 220, conversions: 216 },
  { date: '2026-03-01', clicks: 154, conversions: 148 },
  { date: '2026-03-02', clicks: 212, conversions: 210 },
  { date: '2026-03-03', clicks: 134, conversions: 134 },
  { date: '2026-03-04', clicks: 134, conversions: 134 },
  { date: '2026-03-05', clicks: 222, conversions: 232 },
  { date: '2026-03-06', clicks: 238, conversions: 236 },
  { date: '2026-03-07', clicks: 234, conversions: 230 },
  { date: '2026-03-08', clicks: 236, conversions: 238 },
  { date: '2026-03-09', clicks: 184, conversions: 170 },
  { date: '2026-03-10', clicks: 112, conversions: 102 },
  { date: '2026-03-11', clicks: 146, conversions: 142 },
]

const panelStyle = {
  border: '1px solid var(--yes-border-subtle)',
  boxShadow: 'var(--yes-shadow-md)',
} as const

export interface GlobalStatsPageProps {
  kpiData?: typeof defaultKpiData
  trendData?: typeof defaultTrendData
}

export const GlobalStatsPage: React.FC<GlobalStatsPageProps> = ({
  kpiData = defaultKpiData,
  trendData = defaultTrendData,
}) => {
  return (
    <YesLinksShell activeTab="stats">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--yes-surface-tertiary)]"
              style={{ border: '1px solid var(--yes-border-subtle)' }}
            >
              <BarChart3 className="h-5 w-5 text-[var(--yes-accent-primary)]" />
            </div>
            <div>
              <h1
                className="text-[34px] font-semibold text-[var(--yes-text-primary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                Estadísticas Globales
              </h1>
              <p
                className="text-sm text-[var(--yes-text-secondary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                Analíticas y métricas de rendimiento de todos los enlaces
              </p>
            </div>
          </div>

          <button
            className="flex items-center gap-2 rounded-xl bg-[var(--yes-surface-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--yes-text-primary)] transition-colors hover:bg-[var(--yes-surface-tertiary)]"
            style={{
              border: '1px solid var(--yes-border-subtle)',
              boxShadow: 'var(--yes-shadow-md)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            <Download className="h-4 w-4" />
            <span>Exportar Reporte</span>
          </button>
        </div>

        <KPIStats state="success" data={kpiData} />
        <PerformanceTrends state="success" data={trendData} />

        <div className="grid gap-4 md:grid-cols-2">
          <section
            className="rounded-[20px] bg-[var(--yes-surface-primary)] p-6"
            style={panelStyle}
          >
            <h3
              className="mb-4 text-base font-semibold text-[var(--yes-text-primary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              Enlaces con Mejor Rendimiento
            </h3>

            <div className="space-y-3">
              {[
                { rank: 1, code: 'WEB-DEMO', clicks: 4291, change: '+12%' },
                { rank: 2, code: 'EVENT-24', clicks: 3156, change: '+8%' },
                { rank: 3, code: 'PRD-2024', clicks: 2847, change: '+15%' },
              ].map((item) => (
                <div
                  key={item.code}
                  className="flex items-center justify-between rounded-xl bg-[var(--yes-surface-tertiary)] p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded bg-[var(--yes-accent-light)] text-xs font-semibold text-[var(--yes-accent-primary)]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {item.rank}
                    </div>
                    <span
                      className="text-sm font-semibold text-[var(--yes-text-primary)]"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: 'var(--letter-spacing-tight)',
                      }}
                    >
                      {item.code}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-semibold text-[var(--yes-text-primary)]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {item.clicks.toLocaleString()}
                    </span>
                    <span className="rounded bg-[var(--yes-success-light)] px-2 py-1 text-xs font-semibold text-[var(--yes-success)]">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            className="rounded-[20px] bg-[var(--yes-surface-primary)] p-6"
            style={panelStyle}
          >
            <h3
              className="mb-4 text-base font-semibold text-[var(--yes-text-primary)]"
              style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              Actividad Reciente
            </h3>

            <div className="space-y-4">
              {[
                { action: 'Enlace creado', code: 'CASE-FIN', time: 'hace 2 horas' },
                { action: 'Clics registrados', code: 'DOCS-API', time: 'hace 5 horas' },
                { action: 'Enlace compartido', code: 'OLD-PROMO', time: 'hace 1 día' },
                { action: 'Enlace copiado', code: 'CAMPAIGN-Q4', time: 'hace 2 días' },
              ].map((item) => (
                <div key={`${item.action}-${item.code}`} className="flex items-start gap-3">
                  <div
                    className="mt-1.5 h-2 w-2 rounded-full bg-[var(--yes-accent-primary)]"
                    style={{ boxShadow: '0 0 0 4px var(--yes-accent-light)' }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-sm text-[var(--yes-text-primary)]"
                        style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                      >
                        {item.action}
                      </span>
                      <span
                        className="text-sm font-semibold text-[var(--yes-text-primary)]"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: 'var(--letter-spacing-tight)',
                        }}
                      >
                        {item.code}
                      </span>
                    </div>
                    <div
                      className="mt-0.5 text-xs text-[var(--yes-text-tertiary)]"
                      style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
                    >
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </YesLinksShell>
  )
}
