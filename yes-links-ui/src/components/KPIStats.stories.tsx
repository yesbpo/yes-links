import type { Meta, StoryObj } from '@storybook/react'
import { KPIStats } from './KPIStats'

const meta: Meta<typeof KPIStats> = {
  title: 'SDK/Analytics/KPIStats',
  component: KPIStats,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof KPIStats>

export const Default: Story = {
  args: {
    state: 'success',
    data: {
      total_clicks: 1250,
      total_links: 45,
      active_links: 32,
      ctr: 12.4,
      trends: { clicks: 15, ctr: 2.1 }
    }
  }
}

export const ZeroState: Story = {
  args: {
    state: 'success',
    data: {
      total_clicks: 0,
      total_links: 0,
      active_links: 0,
      ctr: 0
    }
  }
}

export const HighVolume: Story = {
  args: {
    state: 'success',
    data: {
      total_clicks: 1250430,
      total_links: 8432,
      active_links: 6120,
      ctr: 24.8,
      trends: { clicks: 42.5, ctr: 8.2 }
    }
  }
}

export const Loading: Story = {
  args: {
    state: 'loading',
    data: null
  }
}

export const ErrorState: Story = {
  args: {
    state: 'error',
    data: null,
    error: 'Error de carga de KPIs'
  }
}
