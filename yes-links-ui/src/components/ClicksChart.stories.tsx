import type { Meta, StoryObj } from '@storybook/react'
import { ClicksChart } from './ClicksChart'

const meta: Meta<typeof ClicksChart> = {
  title: 'Dashboard/ClicksChart',
  component: ClicksChart,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ClicksChart>

const mockData = [
  { date: '2026-03-01', clicks: 120 },
  { date: '2026-03-02', clicks: 450 },
  { date: '2026-03-03', clicks: 300 },
  { date: '2026-03-04', clicks: 900 },
  { date: '2026-03-05', clicks: 600 },
  { date: '2026-03-06', clicks: 1200 },
  { date: '2026-03-07', clicks: 800 },
]

export const Default: Story = {
  args: {
    data: mockData,
    title: 'Total Clicks (Last 7 Days)'
  }
}

export const Empty: Story = {
  args: {
    data: [],
    title: 'No Data Available'
  }
}

export const Loading: Story = {
  args: {
    data: [],
    title: 'Loading Analytics...',
    // Note: If the component had a loading prop, we would use it here.
    // Assuming it handles empty array as a blank state for now.
  }
}
