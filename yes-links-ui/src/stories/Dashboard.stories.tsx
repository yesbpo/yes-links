'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Dashboard from '../app/page'

const meta: Meta<typeof Dashboard> = {
  title: 'Legacy/App Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Dashboard>

export const Default: Story = {
  render: () => <Dashboard />,
}
