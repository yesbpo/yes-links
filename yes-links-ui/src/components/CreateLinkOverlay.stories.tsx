import type { Meta, StoryObj } from '@storybook/react'
import { CreateLinkOverlay } from './CreateLinkOverlay'
import { YesLinksShell } from './YesLinksShell'

const meta: Meta<typeof CreateLinkOverlay> = {
  title: 'SDK/Links/CreateLinkOverlay',
  component: CreateLinkOverlay,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof CreateLinkOverlay>

export const Open: Story = {
  render: () => (
    <YesLinksShell activeTab="links">
      <div className="h-[720px]" />
      <CreateLinkOverlay isOpen={true} onClose={() => {}} />
    </YesLinksShell>
  ),
}
