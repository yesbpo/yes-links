'use client'

import React, { useState, useEffect } from 'react'
import { useHandshake } from '@/hooks/useHandshake'
import { useNotification } from '@/hooks/useNotification'
import { LinkList } from '@/components/LinkList'
import { CreateLinkForm } from '@/components/CreateLinkForm'
import { KPIStats } from '@/components/KPIStats'
import { ClicksChart } from '@/components/ClicksChart'
import { logger } from '@/lib/logger'
import { withTrace } from '@/lib/tracing'
import { Toaster } from 'sonner'
import { Loader2, LayoutDashboard, Link as LinkIcon, Plus } from 'lucide-react'

import { FilterBar } from '@/components/FilterBar'

export default function Dashboard() {
  const { isReady, token } = useHandshake()
  const { error, success } = useNotification()
  
  const [links, setLinks] = useState<any[]>([])
  const [filteredLinks, setFilteredLinks] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Analytics State
  const [analyticsState, setAnalyticsState] = useState<'loading' | 'success' | 'error'>('loading')
  const [kpiData, setKpiData] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])

  const [campaigns, setCampaigns] = useState<string[]>([])

  useEffect(() => {
    if (isReady) {
      // Simulate fetching analytics data
      const timer = setTimeout(() => {
        setKpiData({
          total_clicks: 1250,
          total_links: 0,
          top_campaign: 'None'
        })
        setChartData([
          { day: 'Mon', count: 10 },
          { day: 'Tue', count: 25 },
          { day: 'Wed', count: 40 },
          { day: 'Thu', count: 30 },
          { day: 'Fri', count: 50 }
        ])
        setAnalyticsState('success')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isReady])

  const handleCreateLink = async (data: any) => {
    setIsSubmitting(true)
    
    await withTrace('ui.create_link.v1', { target_url: data.target_url }, async (span) => {
      try {
        const newLink = {
          id: Math.random().toString(36).substr(2, 9),
          short_code: Math.random().toString(36).substr(2, 5),
          ...data
        }

        setLinks((prev) => [newLink, ...prev])
        setFilteredLinks((prev) => [newLink, ...prev])
        
        if (data.campaign && !campaigns.includes(data.campaign)) {
          setCampaigns(prev => [...prev, data.campaign])
        }

        // Update local KPI state
        setKpiData((prev: any) => ({
          ...prev,
          total_links: (prev?.total_links || 0) + 1
        }))

        logger.info({
          event: 'ui.link_created.v1',
          link_id: newLink.id,
          short_code: newLink.short_code
        }, 'New short link created via UI')

        success('Link created successfully!')
      } catch (err: any) {
        error({
          message: 'Failed to create link',
          remediation: 'Verify the target URL and try again.',
          onRetry: () => handleCreateLink(data)
        })
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  const handleDeleteLink = async (id: string) => {
    // Rule 3: Observability (Tracing)
    await withTrace('ui.delete_link.v1', { link_id: id }, async () => {
      try {
        const linkToDelete = links.find(l => l.id === id)
        setLinks((prev) => prev.filter(l => l.id !== id) )
        setFilteredLinks((prev) => prev.filter(l => l.id !== id) )

        // Rule 7: Event Emission
        logger.info({
          event: 'ui.link_deleted.v1',
          link_id: id
        }, `Link ${id} deleted via UI`)

        success(`Link ${linkToDelete?.short_code} deleted.`)
      } catch (err: any) {
        error({
          message: 'Failed to delete link',
          remediation: 'Try refreshing the page.',
          onRetry: () => handleDeleteLink(id)
        })
      }
    })
  }

  const handleEditLink = (link: any) => {
    // Phase 2: In a real SDK, this would open a modal or populate the form
    logger.info({
      event: 'ui.link_edit_initiated.v1',
      link_id: link.id
    }, 'User initiated link edit')
    
    success(`Editing ${link.short_code} (Phase 2 feature)`)
  }

  const handleFilterChange = (filters: { search: string; campaign: string }) => {
    const { search, campaign } = filters
    const filtered = links.filter(link => {
      const matchesSearch = link.target_url.toLowerCase().includes(search.toLowerCase()) || 
                           link.short_code.toLowerCase().includes(search.toLowerCase())
      const matchesCampaign = !campaign || link.campaign === campaign
      return matchesSearch && matchesCampaign
    })
    setFilteredLinks(filtered)
  }

  if (!isReady) {
    return (
      <div 
        data-testid="dashboard-loading" 
        className="yes-link-flex yes-link-h-screen yes-link-w-full yes-link-flex-col yes-link-items-center yes-link-justify-center yes-link-space-y-4 yes-link-bg-background"
      >
        <Loader2 className="yes-link-h-8 yes-link-w-8 yes-link-animate-spin yes-link-text-primary" />
        <p className="yes-link-text-sm yes-link-font-medium yes-link-text-muted-foreground yes-link-animate-pulse">
          Initializing secure session...
        </p>
      </div>
    )
  }

  return (
    <main className="yes-link-root yes-link-min-h-screen yes-link-bg-background yes-link-p-6 md:yes-link-p-12">
      <Toaster position="top-right" richColors />
      
      <div className="yes-link-mx-auto yes-link-max-w-5xl yes-link-space-y-10">
        <header className="yes-link-flex yes-link-items-end yes-link-justify-between yes-link-border-b yes-link-border-muted yes-link-pb-6">
          <div className="yes-link-space-y-1">
            <h1 className="yes-link-text-3xl yes-link-font-bold yes-link-tracking-tight yes-link-text-foreground">Links Dashboard</h1>
            <p className="yes-link-text-sm yes-link-text-muted-foreground">Manage your short URLs and track performance.</p>
          </div>
        </header>

        {/* Analytics Section */}
        <section className="yes-link-space-y-6">
          <div className="yes-link-flex yes-link-items-center yes-link-space-x-2">
            <LayoutDashboard className="yes-link-h-5 yes-link-w-5 yes-link-text-primary" />
            <h2 className="yes-link-text-lg yes-link-font-semibold yes-link-text-foreground">Overview</h2>
          </div>
          <KPIStats state={analyticsState} data={kpiData} />
          <ClicksChart state={analyticsState} data={chartData} />
        </section>

        {/* Management Section */}
        <section className="yes-link-grid yes-link-gap-10 lg:yes-link-grid-cols-[1fr_1.5fr]">
          <div className="yes-link-space-y-6">
            <div className="yes-link-flex yes-link-items-center yes-link-space-x-2">
              <Plus className="yes-link-h-5 yes-link-w-5 yes-link-text-primary" />
              <h2 className="yes-link-text-lg yes-link-font-semibold yes-link-text-foreground">Create Link</h2>
            </div>
            <CreateLinkForm 
              onSubmit={handleCreateLink} 
              isSubmitting={isSubmitting} 
            />
          </div>

          <div className="yes-link-space-y-6">
            <div className="yes-link-flex yes-link-items-center yes-link-justify-between">
              <div className="yes-link-flex yes-link-items-center yes-link-space-x-2">
                <LinkIcon className="yes-link-h-5 yes-link-w-5 yes-link-text-primary" />
                <h2 className="yes-link-text-lg yes-link-font-semibold yes-link-text-foreground">Recent Links</h2>
              </div>
            </div>
            
            <FilterBar campaigns={campaigns} onFilterChange={handleFilterChange} />

            <LinkList 
              state={filteredLinks.length > 0 ? 'success' : 'empty'} 
              links={filteredLinks} 
              onDelete={handleDeleteLink}
              onEdit={handleEditLink}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
