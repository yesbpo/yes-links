import type { Meta, StoryObj } from '@storybook/react'
import { LinkCard } from './LinkCard'

const sampleLink = {
  id: '1',
  short_code: 'PRD-2024',
  target_url: 'https://acme.com/products/enterprise-suite/annual-pricing',
  campaign: 'Enterprise / Q1 Launch',
  tags: ['enterprise', 'pricing'],
  clicks: 2847,
  sparkline_data: [32, 30, 34, 35, 31, 31, 23, 26, 18, 17, 25, 20],
}

const meta: Meta<typeof LinkCard> = {
  title: 'SDK/Links/LinkCard',
  component: LinkCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LinkCard>

export const ListView: Story = {
  args: {
    link: sampleLink,
    viewMode: 'list',
  },
}

export const GridView: Story = {
  args: {
    link: sampleLink,
    viewMode: 'grid',
  },
}
