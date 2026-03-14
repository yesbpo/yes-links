import type { Meta, StoryObj } from '@storybook/react'
import { YesLinksDashboard } from './YesLinksDashboard'

const links = [
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
]

const stats = {
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
    { date: '2026-02-10', clicks: 146, conversions: 138 },
    { date: '2026-02-11', clicks: 116, conversions: 108 },
    { date: '2026-02-12', clicks: 154, conversions: 152 },
    { date: '2026-02-13', clicks: 156, conversions: 154 },
    { date: '2026-02-14', clicks: 226, conversions: 224 },
    { date: '2026-02-15', clicks: 228, conversions: 226 },
    { date: '2026-02-16', clicks: 168, conversions: 162 },
    { date: '2026-02-17', clicks: 118, conversions: 112 },
  ],
}

const meta: Meta<typeof YesLinksDashboard> = {
  title: 'SDK/Pages/YesLinksDashboard',
  component: YesLinksDashboard,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof YesLinksDashboard>

export const Default: Story = {
  args: {
    scope: {
      mode: 'campaign',
      label: 'Campaign',
      options: [
        { label: 'Enterprise / Q1 Launch', value: 'enterprise-q1' },
        { label: 'Content / AI Series', value: 'content-ai' },
      ],
      defaultValue: 'enterprise-q1',
    },
    dataSource: {
      loadLinks: async () => ({
        items: links,
        total: links.length,
      }),
      loadStats: async () => stats,
      createLink: async () => {},
      exportReport: async () => {},
    },
  },
}

export const LinksOnly: Story = {
  args: {
    sections: {
      stats: false,
    },
    scope: {
      mode: 'tag',
      label: 'Tag',
      options: [
        { label: 'enterprise', value: 'enterprise' },
        { label: 'analytics', value: 'analytics' },
      ],
      defaultValue: 'enterprise',
    },
    dataSource: {
      loadLinks: async () => ({
        items: links,
        total: links.length,
      }),
      createLink: async () => {},
    },
  },
}
