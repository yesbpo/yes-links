import type { Meta, StoryObj } from '@storybook/react'
import { KPIStats } from './KPIStats'

const meta: Meta<typeof KPIStats> = {
  title: 'Dashboard/KPIStats',
  component: KPIStats,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof KPIStats>

export const Default: Story = {
  args: {
    totalLinks: 1250,
    totalClicks: 45800,
    activeCampaigns: 12,
    conversionRate: 3.2,
  }
}

export const ZeroState: Story = {
  args: {
    totalLinks: 0,
    totalClicks: 0,
    activeCampaigns: 0,
    conversionRate: 0,
  }
}

export const HighGrowth: Story = {
  args: {
    totalLinks: 5000,
    totalClicks: 1250000,
    activeCampaigns: 45,
    conversionRate: 8.5,
  }
}
