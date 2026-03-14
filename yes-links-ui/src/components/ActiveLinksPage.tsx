'use client'

import React, { useMemo, useState } from 'react'
import { Link2, Plus } from 'lucide-react'
import { CreateLinkOverlay } from '@/components/CreateLinkOverlay'
import { FilterBar } from '@/components/FilterBar'
import { LinkList } from '@/components/LinkList'
import { type Link } from '@/components/LinkCard'
import { YesLinksShell } from '@/components/YesLinksShell'

const defaultLinks: Link[] = [
  {
    id: '1',
    short_code: 'PRD-2024',
    target_url: 'https://acme.com/products/enterprise-suite/annual-pricing',
    campaign: 'Enterprise / Q1 Launch',
    tags: ['enterprise', 'pricing'],
    clicks: 2847,
    sparkline_data: [32, 30, 34, 35, 31, 31, 23, 26, 18, 17, 25, 20],
  },
  {
    id: '2',
    short_code: 'BLOG-A1',
    target_url: 'https://acme.com/blog/ai-powered-analytics-deep-dive',
    campaign: 'Content / AI Series',
    tags: ['blog', 'ai', 'analytics'],
    clicks: 1523,
    sparkline_data: [18, 20, 19, 21, 20, 20, 19, 18, 18, 17, 18, 16],
  },
  {
    id: '3',
    short_code: 'WEB-DEMO',
    target_url: 'https://demo.acme.com/interactive-dashboard',
    campaign: 'Sales / Demo Portal',
    tags: ['demo', 'sales'],
    clicks: 4291,
    sparkline_data: [22, 15, 20, 14, 16, 14, 18, 14, 9, 8, 12, 13],
  },
  {
    id: '4',
    short_code: 'DOCS-API',
    target_url: 'https://docs.acme.com/api/v2/authentication',
    campaign: 'Developer / Documentation',
    tags: ['docs', 'api', 'developer'],
    clicks: 892,
    sparkline_data: [14, 13, 14, 12, 14, 12, 16, 14, 12, 12, 12, 14],
  },
  {
    id: '5',
    short_code: 'EVENT-24',
    target_url: 'https://acme.com/events/summit-2024/registration',
    campaign: 'Events / Summit 2024',
    tags: ['event', 'summit'],
    clicks: 3156,
    sparkline_data: [21, 18, 17, 14, 13, 10, 10, 10, 10, 10, 12, 12],
  },
  {
    id: '6',
    short_code: 'CASE-FIN',
    target_url: 'https://acme.com/case-studies/fintech-transformation',
    campaign: 'Content / Case Studies',
    tags: ['case-study', 'fintech'],
    clicks: 674,
    sparkline_data: [10, 12, 12, 11, 11, 9, 11, 10, 8, 9, 8, 7],
  },
]

export interface ActiveLinksPageProps {
  links?: Link[]
  defaultOverlayOpen?: boolean
}

export const ActiveLinksPage: React.FC<ActiveLinksPageProps> = ({
  links = defaultLinks,
  defaultOverlayOpen = false,
}) => {
  const [filters, setFilters] = useState({ search: '', campaign: '', tags: '' })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [isCreateOpen, setIsCreateOpen] = useState(defaultOverlayOpen)

  const campaigns = Array.from(new Set(links.map((link) => link.campaign || '').filter(Boolean)))
  const tags = Array.from(new Set(links.flatMap((link) => link.tags || [])))

  const filteredLinks = useMemo(() => {
    const selectedTags = filters.tags
      ? filters.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : []

    return links.filter((link) => {
      const haystack = [
        link.short_code,
        link.target_url,
        link.campaign || '',
        ...(link.tags || []),
      ].join(' ').toLowerCase()

      const matchesSearch =
        !filters.search || haystack.includes(filters.search.toLowerCase())
      const matchesCampaign =
        !filters.campaign || link.campaign === filters.campaign
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => link.tags?.includes(tag))

      return matchesSearch && matchesCampaign && matchesTags
    })
  }, [filters, links])

  const totalClicks = filteredLinks.reduce((sum, link) => sum + (link.clicks || 0), 0)

  return (
    <YesLinksShell activeTab="links">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--yes-surface-tertiary)]"
              style={{ border: '1px solid var(--yes-border-subtle)' }}
            >
              <Link2 className="h-5 w-5 text-[var(--yes-accent-primary)]" />
            </div>
            <div>
              <h1
                className="text-[34px] font-semibold text-[var(--yes-text-primary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                Enlaces Activos
              </h1>
              <p
                className="text-sm text-[var(--yes-text-secondary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                {filteredLinks.length} enlaces • {totalClicks.toLocaleString()} clics totales
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
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
        </div>

        <FilterBar
          campaigns={campaigns}
          tags={tags}
          onFilterChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateClick={() => setIsCreateOpen(true)}
        />

        <div
          className="text-sm text-[var(--yes-text-secondary)]"
          style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
        >
          Mostrando {filteredLinks.length} de {links.length} enlaces
        </div>

        <LinkList state="success" links={filteredLinks} viewMode={viewMode} />
      </div>

      <CreateLinkOverlay isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </YesLinksShell>
  )
}
