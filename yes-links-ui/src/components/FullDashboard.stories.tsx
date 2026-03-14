import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { KPIStats } from './KPIStats'
import { FilterBar } from './FilterBar'
import { ClicksChart } from './ClicksChart'
import { LinkList } from './LinkList'
import { CreateLinkForm } from './CreateLinkForm'
import { BulkUpload } from './BulkUpload'
import { CorporateContainer } from './ui/CorporateContainer'

const DashboardMock = () => {
  const mockLinks = [
    { id: '1', short_code: 'abc12', target_url: 'https://yes.engineering', campaign: 'summer-2026' },
    { id: '2', short_code: 'def34', target_url: 'https://google.com', campaign: 'fall-2026' },
    { id: '3', short_code: 'ghi56', target_url: 'https://github.com', campaign: 'internal' },
  ]

  const mockChartData = [
    { day: 'Lun', count: 120 },
    { day: 'Mar', count: 450 },
    { day: 'Mie', count: 300 },
    { day: 'Jue', count: 900 },
    { day: 'Vie', count: 600 },
    { day: 'Sab', count: 1200 },
    { day: 'Dom', count: 800 },
  ]

  return (
    <main className="yes-link-root min-h-screen bg-muted/30 p-6">
      <CorporateContainer className="space-y-8">
        <header className="flex items-center justify-between border-b border-muted pb-4">
          <h1 className="text-xl font-bold text-foreground">Links Analytics Dashboard</h1>
        </header>

        <KPIStats
          state="success"
          data={{
            total_clicks: 1250,
            total_links: 12,
            active_links: 10,
            ctr: 15.2,
            trends: { clicks: 12, ctr: 4.5 }
          }}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <CreateLinkForm onSubmit={async () => {}} isSubmitting={false} />
            <BulkUpload onProcess={async () => {}} isProcessing={false} progress={0} />
          </div>

          <div className="space-y-6">
            <ClicksChart state="success" data={mockChartData} />
            <div className="rounded-xl border border-muted bg-background p-4">
              <FilterBar
                campaigns={['summer-2026', 'fall-2026', 'internal']}
                tags={['promo', 'search', 'dev']}
                onFilterChange={() => {}}
              />
            </div>
            <LinkList
              state="success"
              links={mockLinks}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        </div>
      </CorporateContainer>
    </main>
  )
}

const meta: Meta = {
  title: 'Legacy/FullDashboard',
  component: DashboardMock,
}

export default meta
type Story = StoryObj<typeof DashboardMock>

export const Default: Story = {}
