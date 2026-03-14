import type { Meta, StoryObj } from '@storybook/react'
import { YesLinksShell } from './YesLinksShell'

const meta: Meta<typeof YesLinksShell> = {
  title: 'SDK/Layout/YesLinksShell',
  component: YesLinksShell,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof YesLinksShell>

export const ActiveLinksTab: Story = {
  render: () => (
    <YesLinksShell activeTab="links">
      <div className="rounded-[20px] bg-[var(--yes-surface-primary)] p-8 text-[var(--yes-text-primary)] shadow-sm">
        Shell content
      </div>
    </YesLinksShell>
  ),
}

export const GlobalStatsTab: Story = {
  render: () => (
    <YesLinksShell activeTab="stats">
      <div className="rounded-[20px] bg-[var(--yes-surface-primary)] p-8 text-[var(--yes-text-primary)] shadow-sm">
        Shell content
      </div>
    </YesLinksShell>
  ),
}

export const CombinedDashboard: Story = {
  render: () => (
    <YesLinksShell activeTab="dashboard">
      <div className="rounded-[20px] bg-[var(--yes-surface-primary)] p-8 text-[var(--yes-text-primary)] shadow-sm">
        Shell content
      </div>
    </YesLinksShell>
  ),
}
