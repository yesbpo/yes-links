import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within, fn } from '@storybook/test'
import { LinkList } from './LinkList'

const meta: Meta<typeof LinkList> = {
  title: 'SDK/LinkList',
  component: LinkList,
  tags: ['autodocs'],
  args: {
    onRetry: fn(),
    onCreateFirst: fn()
  }
}

export default meta
type Story = StoryObj<typeof LinkList>

export const Success: Story = {
  args: {
    state: 'success',
    links: [
      { id: '1', short_code: 'abc12', target_url: 'https://yes.engineering', campaign: 'spring-2026' },
      { id: '2', short_code: 'def34', target_url: 'https://google.com', campaign: 'test' }
    ]
  }
}

export const ErrorState: Story = {
  args: {
    state: 'error',
    links: [],
    error: 'Failed to fetch campaign links from the API.'
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const retryButton = canvas.getByRole('button', { name: /retry/i })
    
    await userEvent.click(retryButton)
    await expect(args.onRetry).toHaveBeenCalled()
  }
}

export const Loading: Story = {
  args: {
    state: 'loading',
    links: []
  }
}

export const Empty: Story = {
  args: {
    state: 'empty',
    links: []
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const createButton = canvas.getByRole('button', { name: /create your first link/i })
    
    await userEvent.click(createButton)
    await expect(args.onCreateFirst).toHaveBeenCalled()
  }
}
