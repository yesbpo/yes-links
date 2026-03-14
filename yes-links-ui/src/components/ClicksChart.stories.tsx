import type { Meta, StoryObj } from '@storybook/react'
import { ClicksChart } from './ClicksChart'

const meta: Meta<typeof ClicksChart> = {
  title: 'Legacy/ClicksChart',
  component: ClicksChart,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ClicksChart>

const mockData = [
  { day: 'Lun', count: 120 },
  { day: 'Mar', count: 450 },
  { day: 'Mie', count: 300 },
  { day: 'Jue', count: 900 },
  { day: 'Vie', count: 600 },
  { day: 'Sab', count: 1200 },
  { day: 'Dom', count: 800 },
]

export const Default: Story = {
  args: {
    state: 'success',
    data: mockData,
  }
}

export const Empty: Story = {
  args: {
    state: 'success',
    data: [],
  }
}

export const Loading: Story = {
  args: {
    state: 'loading',
    data: [],
  }
}
