import type { Meta, StoryObj } from '@storybook/react'
import { GlobalStatsPage } from '@/components/GlobalStatsPage'

const meta: Meta<typeof GlobalStatsPage> = {
  title: 'Pages/Global Stats',
  component: GlobalStatsPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof GlobalStatsPage>

export const Default: Story = {
  render: () => <GlobalStatsPage />,
}
