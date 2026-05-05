import type { Meta, StoryObj } from '@storybook/react'
import { ActiveLinksPage } from '@/components/ActiveLinksPage'

const meta: Meta<typeof ActiveLinksPage> = {
  title: 'Pages/Active Links',
  component: ActiveLinksPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ActiveLinksPage>

export const Default: Story = {
  render: () => <ActiveLinksPage />,
}

export const CreateLinkOpen: Story = {
  render: () => <ActiveLinksPage defaultOverlayOpen={true} />,
}
