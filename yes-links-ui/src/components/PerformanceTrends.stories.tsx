import type { Meta, StoryObj } from '@storybook/react'
import { PerformanceTrends } from './PerformanceTrends'

const trendData = [
  { date: '2026-02-10', clicks: 146, conversions: 138 },
  { date: '2026-02-11', clicks: 116, conversions: 108 },
  { date: '2026-02-12', clicks: 154, conversions: 152 },
  { date: '2026-02-13', clicks: 156, conversions: 154 },
  { date: '2026-02-14', clicks: 226, conversions: 224 },
  { date: '2026-02-15', clicks: 228, conversions: 226 },
  { date: '2026-02-16', clicks: 168, conversions: 162 },
  { date: '2026-02-17', clicks: 118, conversions: 112 },
  { date: '2026-02-18', clicks: 108, conversions: 104 },
  { date: '2026-02-19', clicks: 188, conversions: 194 },
]

const meta: Meta<typeof PerformanceTrends> = {
  title: 'SDK/Analytics/PerformanceTrends',
  component: PerformanceTrends,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PerformanceTrends>

export const Default: Story = {
  args: {
    state: 'success',
    data: trendData,
  },
}

export const Loading: Story = {
  args: {
    state: 'loading',
    data: [],
  },
}
