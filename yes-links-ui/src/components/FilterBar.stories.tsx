import type { Meta, StoryObj } from '@storybook/react'
import { FilterBar } from './FilterBar'
import { fn } from '@storybook/test'

const meta: Meta<typeof FilterBar> = {
  title: 'Dashboard/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  args: {
    onSearch: fn(),
    onFilterChange: fn(),
  }
}

export default meta
type Story = StoryObj<typeof FilterBar>

export const Default: Story = {
  args: {
    campaigns: ['summer-2026', 'fall-2026', 'product-launch', 'internal-test'],
    tags: ['promo', 'sms', 'ig', 'email', 'referral'],
  }
}

export const ActiveFilters: Story = {
  args: {
    campaigns: ['summer-2026', 'fall-2026'],
    tags: ['promo', 'sms'],
    // Note: Storybook can show how the component looks with options available
  }
}
