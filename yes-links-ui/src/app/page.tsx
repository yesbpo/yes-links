'use client'

import React, { useState, useEffect } from 'react'
import { useHandshake } from '@/hooks/useHandshake'
import { useNotification } from '@/hooks/useNotification'
import { LinkList } from '@/components/LinkList'
import { CreateLinkForm } from '@/components/CreateLinkForm'
import { KPIStats } from '@/components/KPIStats'
import { ClicksChart } from '@/components/ClicksChart'
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
  
  const [links, setLinks] = useState<any[]>([])
  const [filteredLinks, setFilteredLinks] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessingBulk, setIsProcessingBulk] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analyticsState, setAnalyticsState] = useState<'loading' | 'success' | 'error'>('loading')
  const [kpiData, setKpiData] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        setKpiData({ total_clicks: 1250, total_links: 0, top_campaign: 'Ninguna' })
        setChartData([
          { day: 'Lun', count: 10 }, { day: 'Mar', count: 25 }, { day: 'Mie', count: 40 },
          { day: 'Jue', count: 30 }, { day: 'Vie', count: 50 }
        ])
        setAnalyticsState('success')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isReady])

  const handleCreateLink = async (data: any) => {
    setIsSubmitting(true)
    await withTrace('ui.create_link.v1', { target_url: data.target_url }, async () => {
      try {
        const newLink = {
          id: Math.random().toString(36).substr(2, 9),
          short_code: Math.random().toString(36).substr(2, 5),
          ...data
        }
        setLinks((prev) => [newLink, ...prev])
        setFilteredLinks((prev) => [newLink, ...prev])
        if (data.campaign && !campaigns.includes(data.campaign)) setCampaigns(prev => [...prev, data.campaign])
        if (data.tags) setAllTags(prev => Array.from(new Set([...prev, ...data.tags])))
        
        setKpiData((prev: any) => ({ ...prev, total_links: (prev?.total_links || 0) + 1 }))
        logger.info({ event: 'ui.link_created.v1', link_id: newLink.id }, 'Enlace creado')
        success('¡Enlace creado con éxito!')
      } catch (err) {
        error({ message: 'Error al crear', remediation: 'Reintenta en un momento.' })
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  const handleExport = () => {
    if (filteredLinks.length === 0) return error({ message: t.noExportData, remediation: t.noExportRemediation })
    exportToCSV(filteredLinks, `yes-links-${new Date().toISOString().split('T')[0]}`)
    success(t.exportSuccess)
  }

  if (!isReady) {
    return (
      <div className="yes-link-flex yes-link-h-screen yes-link-items-center yes-link-justify-center yes-link-bg-background">
        <div className="yes-link-flex yes-link-flex-col yes-link-items-center yes-link-space-y-4">
          <Loader2 className="yes-link-h-10 yes-link-w-10 yes-link-animate-spin yes-link-text-primary" />
          <span className="yes-link-text-xs yes-link-font-medium yes-link-uppercase yes-link-tracking-widest yes-link-text-muted-foreground">{t.loading}</span>
        </div>
      </div>
    )
  }

  return (
    <main className="yes-link-root yes-link-min-h-screen yes-link-bg-muted/30 yes-link-py-12 yes-link-px-6">
      <Toaster position="top-right" richColors />
      
      <CorporateContainer className="yes-link-space-y-12">
        {/* Header Corporativo Minimalista */}
        <header className="yes-link-flex yes-link-items-center yes-link-justify-between yes-link-border-b yes-link-border-muted yes-link-pb-8">
          <div className="yes-link-flex yes-link-items-center yes-link-space-x-4">
            <div className="yes-link-rounded-lg yes-link-bg-primary yes-link-p-2">
              <ShieldCheck className="yes-link-h-6 yes-link-w-6 yes-link-text-primary-foreground" />
            </div>
            <div>
              <h1 className="yes-link-text-2xl yes-link-font-bold yes-link-tracking-tight yes-link-text-foreground">{t.title}</h1>
              <p className="yes-link-text-sm yes-link-text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          <div className="yes-link-flex yes-link-items-center yes-link-space-x-2">
            <button onClick={handleExport} className="yes-link-flex yes-link-items-center yes-link-space-x-2 yes-link-rounded-md yes-link-bg-background yes-link-border yes-link-border-muted yes-link-px-4 yes-link-py-2 yes-link-text-xs yes-link-font-semibold yes-link-text-foreground hover:yes-link-bg-muted transition-all">
              <Download className="yes-link-h-4 yes-link-w-4" />
              <span>{t.export}</span>
            </button>
            <button className="yes-link-rounded-md yes-link-bg-background yes-link-border yes-link-border-muted yes-link-p-2 yes-link-text-muted-foreground hover:yes-link-bg-muted">
              <Settings className="yes-link-h-4 yes-link-w-4" />
            </button>
          </div>
        </header>

        {/* Grid de Analíticas Equilibrado */}
        <section className="yes-link-space-y-6">
          <div className="yes-link-flex yes-link-items-center yes-link-space-x-2">
            <LayoutDashboard className="yes-link-h-4 yes-link-w-4 yes-link-text-primary" />
            <span className="yes-link-text-xs yes-link-font-bold yes-link-uppercase yes-link-tracking-widest yes-link-text-muted-foreground">{t.overview}</span>
          </div>
          <KPIStats state={analyticsState} data={kpiData} />
          <div className="yes-link-grid yes-link-gap-6 lg:yes-link-grid-cols-1">
            <ClicksChart state={analyticsState} data={chartData} />
          </div>
        </section>

        {/* Sección de Gestión con Simetría Lateral */}
        <section className="yes-link-grid yes-link-gap-12 lg:yes-link-grid-cols-[1fr_1.5fr]">
          {/* Columna Izquierda: Entradas */}
          <div className="yes-link-space-y-10">
            <div className="yes-link-space-y-6">
              <h2 className="yes-link-text-sm yes-link-font-bold yes-link-uppercase yes-link-tracking-widest yes-link-text-muted-foreground">{t.createTitle}</h2>
              <CreateLinkForm onSubmit={handleCreateLink} isSubmitting={isSubmitting} />
            </div>
            <div className="yes-link-space-y-6">
              <h2 className="yes-link-text-sm yes-link-font-bold yes-link-uppercase yes-link-tracking-widest yes-link-text-muted-foreground">{t.bulkTitle}</h2>
              <BulkUpload onProcess={async () => {}} isProcessing={isProcessingBulk} progress={uploadProgress} />
            </div>
          </div>

          {/* Columna Derecha: Listado y Filtros */}
          <div className="yes-link-space-y-6">
            <h2 className="yes-link-text-sm yes-link-font-bold yes-link-uppercase yes-link-tracking-widest yes-link-text-muted-foreground">{t.recentTitle}</h2>
            <div className="yes-link-rounded-xl yes-link-border yes-link-border-muted yes-link-bg-background/50 yes-link-p-1">
              <FilterBar campaigns={campaigns} tags={allTags} onFilterChange={() => {}} />
            </div>
            <LinkList 
              state={filteredLinks.length > 0 ? 'success' : 'empty'} 
              links={filteredLinks} 
              onDelete={async () => {}}
              onEdit={() => {}}
            />
          </div>
        </section>
      </CorporateContainer>

      {/* Footer Minimalista */}
      <footer className="yes-link-mt-12 yes-link-text-center">
        <p className="yes-link-text-[10px] yes-link-font-medium yes-link-uppercase yes-link-tracking-[0.2em] yes-link-text-muted-foreground/50">
          Powered by Yes Engineering Constitution • 2026
        </p>
      </footer>
    </main>
  )
}
