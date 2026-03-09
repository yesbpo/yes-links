import type { Meta, StoryObj } from '@storybook/react'
import { CreateLinkForm } from './CreateLinkForm'

const meta: Meta<typeof CreateLinkForm> = {
  title: 'SDK/CreateLinkForm',
  component: CreateLinkForm,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CreateLinkForm>

export const Default: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Submitting:', data)
      await new Promise(res => setTimeout(res, 2000))
    },
    isSubmitting: false
  }
}

export const Submitting: Story = {
  args: {
    onSubmit: async () => {},
    isSubmitting: true
  }
}
