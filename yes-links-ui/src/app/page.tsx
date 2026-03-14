'use client'

import React, { useState, useEffect } from 'react'
import { useHandshake } from '@/hooks/useHandshake'
import { useNotification } from '@/hooks/useNotification'
import { useLinks } from '@/hooks/useLinks'
import { LinkList } from '@/components/LinkList'
import { CreateLinkForm } from '@/components/CreateLinkForm'
import { KPIStats } from '@/components/KPIStats'
import { PerformanceTrends } from '@/components/PerformanceTrends'
import { BulkUpload } from '@/components/BulkUpload'
import { FilterBar } from '@/components/FilterBar'
import { exportToCSV } from '@/lib/csvExport'
import { logger } from '@/lib/logger'
import { withTrace } from '@/lib/tracing'
import { i18n } from '@/lib/i18n'
import { Toaster } from 'sonner'
import { 
  Loader2, 
  LayoutDashboard, 
  Link as LinkIcon, 
  Download, 
  Settings,
  ShieldCheck
} from 'lucide-react'

// Primitiva UI
import { CorporateContainer } from '@/components/ui/CorporateContainer'

export default function Dashboard() {
  const { isReady, token } = useHandshake()
  const { error, success } = useNotification()
  const t = i18n.dashboard
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessingBulk, setIsProcessingBulk] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analyticsState, setAnalyticsState] = useState<'loading' | 'success' | 'error'>('loading')
  const [kpiData, setKpiData] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  
  const [filters, setFilters] = useState({ search: '', campaign: '', tags: '' })
  
  // Custom fetcher Hook
  const { links, state: linksState, mutate } = useLinks(filters)

  // Derived unique campaigns and tags from current payload or context
  // En un caso real, estas listas vendrían de un endpoint /meta/campaigns o similar
  const campaigns = Array.from(new Set(links.map(l => l.campaign).filter(Boolean))) as string[];
  const allTags = Array.from(new Set(links.flatMap(l => l.tags || []))) as string[];

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        setKpiData({ 
          total_clicks: 15430, 
          total_links: links.length || 8, 
          active_links: links.length || 6,
          ctr: 18.7,
          trends: { clicks: 12.5, ctr: 3.2 }
        })
        setChartData([
          { date: '2026-03-01', clicks: 120, conversions: 45 },
          { date: '2026-03-02', clicks: 150, conversions: 50 },
          { date: '2026-03-03', clicks: 200, conversions: 80 },
          { date: '2026-03-04', clicks: 180, conversions: 70 },
          { date: '2026-03-05', clicks: 250, conversions: 90 },
          { date: '2026-03-06', clicks: 300, conversions: 110 },
          { date: '2026-03-07', clicks: 280, conversions: 100 },
        ])
        setAnalyticsState('success')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isReady, links.length])

  const handleCreateLink = async (data: any) => {
    setIsSubmitting(true)
    await withTrace('ui.create_link.v1', { target_url: data.target_url }, async () => {
      try {
        // En una impl real: await api.post('/links', data)
        await new Promise(r => setTimeout(r, 600))
        
        // Revalidar los links usando el hook optimista
        await mutate()
        
        logger.info({ event: 'ui.link_created.v1' }, 'Enlace creado optimista')
        success('¡Enlace creado con éxito!')
      } catch (err) {
        error({ message: 'Error al crear', remediation: 'Reintenta en un momento.' })
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  const handleExport = () => {
    if (links.length === 0) return error({ message: t.noExportData, remediation: t.noExportRemediation })
    exportToCSV(links, `yes-links-${new Date().toISOString().split('T')[0]}`)
    success(t.exportSuccess)
  }

  const handleFilterChange = (newFilters: { search: string; campaign: string; tags: string }) => {
    setFilters(newFilters)
  }

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{t.loading}</span>
        </div>
      </div>
    )
  }

  return (
    <main className="yes-link-root min-h-screen bg-muted/30 py-12 px-6">
      <Toaster position="top-right" richColors />
      
      <CorporateContainer className="space-y-12">
        {/* Header Corporativo Minimalista */}
        <header className="flex items-center justify-between border-b border-muted pb-8">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-primary p-2">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{t.title}</h1>
              <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleExport} className="flex items-center space-x-2 rounded-md bg-background border border-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all">
              <Download className="h-4 w-4" />
              <span>{t.export}</span>
            </button>
            <button className="rounded-md bg-background border border-muted p-2 text-muted-foreground hover:bg-muted">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Grid de Analíticas Equilibrado */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.overview}</span>
          </div>
          <KPIStats state={analyticsState} data={kpiData} />
          <div className="grid gap-6 lg:grid-cols-1">
            <PerformanceTrends state={analyticsState} data={chartData} />
          </div>
        </section>

        {/* Sección de Gestión con Simetría Lateral */}
        <section className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          {/* Columna Izquierda: Entradas */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t.createTitle}</h2>
              <CreateLinkForm onSubmit={handleCreateLink} isSubmitting={isSubmitting} />
            </div>
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t.bulkTitle}</h2>
              <BulkUpload onProcess={async () => {}} isProcessing={isProcessingBulk} progress={uploadProgress} />
            </div>
          </div>

          {/* Columna Derecha: Listado y Filtros */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t.recentTitle}</h2>
            <div className="rounded-xl border border-muted bg-background/50 p-1">
              <FilterBar 
                campaigns={campaigns} 
                tags={allTags} 
                onFilterChange={handleFilterChange} 
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
            <LinkList 
              state={linksState === 'success' && links.length === 0 ? 'empty' : linksState} 
              links={links} 
              viewMode={viewMode}
              onDelete={async () => {}}
              onEdit={() => {}}
            />
          </div>
        </section>
      </CorporateContainer>

      {/* Footer Minimalista */}
      <footer className="mt-12 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50">
          Powered by Yes Engineering Constitution • 2026
        </p>
      </footer>
    </main>
  )
}
