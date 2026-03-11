import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { YesLinksProvider } from './YesLinksProvider'
import Dashboard from '../app/page'

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
    children: <Dashboard />
  }
}

export const DarkMode: Story = {
  args: {
    token: 'mock-token',
    theme: 'dark',
    children: <Dashboard />
  }
}

export const Midnight: Story = {
  args: {
    token: 'mock-token',
    theme: 'midnight',
    children: <Dashboard />
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
    children: <Dashboard />
  }
}
