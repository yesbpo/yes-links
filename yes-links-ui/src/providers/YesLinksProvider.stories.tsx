import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { YesLinksProvider } from './YesLinksProvider'

const ThemePreview = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-foreground">Theme Preview</h2>
    <p className="text-sm text-muted-foreground">
      This card validates token propagation from `YesLinksProvider`.
    </p>
    <div className="grid gap-3 md:grid-cols-2">
      <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Primary Action
      </button>
      <div className="rounded-md border border-muted bg-accent px-4 py-2 text-sm text-accent-foreground">
        Accent Surface
      </div>
    </div>
  </div>
)

const meta: Meta<typeof YesLinksProvider> = {
  title: 'SDK/ThemeVariants',
  component: YesLinksProvider,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof YesLinksProvider>

export const Corporate: Story = {
  args: {
    token: 'mock-token',
    theme: 'corporate',
    children: <ThemePreview />
  }
}

export const DarkMode: Story = {
  args: {
    token: 'mock-token',
    theme: 'dark',
    children: <ThemePreview />
  }
}

export const Midnight: Story = {
  args: {
    token: 'mock-token',
    theme: 'midnight',
    children: <ThemePreview />
  }
}

export const CustomBrand: Story = {
  args: {
    token: 'mock-token',
    theme: {
      colors: {
        primary: '#8b5cf6', // Violet
        background: '#fdf4ff',
        foreground: '#4c1d95'
      },
      radius: '20px'
    },
    children: <ThemePreview />
  }
}
