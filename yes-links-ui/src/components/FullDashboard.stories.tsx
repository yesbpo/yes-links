import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { KPIStats } from './KPIStats'
import { FilterBar } from './FilterBar'
import { ClicksChart } from './ClicksChart'
import { LinkList } from './LinkList'

const DashboardMock = () => {
  const mockLinks = [
    { id: '1', short_code: 'abc12', target_url: 'https://yes.engineering', campaign: 'summer-2026', tags: ['promo'] },
    { id: '2', short_code: 'def34', target_url: 'https://google.com', campaign: 'fall-2026', tags: ['search'] },
    { id: '3', short_code: 'ghi56', target_url: 'https://github.com', campaign: 'internal', tags: ['dev'] },
  ]

  const mockChartData = [
    { date: '2026-03-01', clicks: 120 },
    { date: '2026-03-02', clicks: 450 },
    { date: '2026-03-03', clicks: 300 },
    { date: '2026-03-04', clicks: 900 },
    { date: '2026-03-05', clicks: 600 },
    { date: '2026-03-06', clicks: 1200 },
    { date: '2026-03-07', clicks: 800 },
  ]

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Links Analytics Dashboard</h1>
      </div>

      <KPIStats 
        totalLinks={150}
        totalClicks={12400}
        activeCampaigns={8}
        conversionRate={4.5}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <ClicksChart data={mockChartData} title="Traffic Overview" />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <FilterBar 
                campaigns={['summer-2026', 'fall-2026', 'internal']}
                tags={['promo', 'search', 'dev']}
                onSearch={() => {}}
                onFilterChange={() => {}}
              />
            </div>
            <LinkList 
              state="success"
              links={mockLinks}
              onRetry={() => {}}
              onCreateFirst={() => {}}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Create New Link
              </button>
              <button className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Export CSV Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Dashboard/FullView',
  component: DashboardMock,
}

export default meta
type Story = StoryObj<typeof DashboardMock>

export const Default: Story = {}
