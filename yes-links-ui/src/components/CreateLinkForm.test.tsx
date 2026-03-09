import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CreateLinkForm } from './CreateLinkForm'

describe('CreateLinkForm (Validation & Resilience)', () => {
  it('should show an actionable error for an invalid URL', async () => {
    render(<CreateLinkForm onSubmit={vi.fn()} isSubmitting={false} />)
    
    const input = screen.getByLabelText(/target url/i)
    fireEvent.change(input, { target: { value: 'not-a-url' } })
    fireEvent.click(screen.getByRole('button', { name: /create link/i }))

    expect(await screen.findByText(/invalid url format/i)).toBeDefined()
    expect(screen.getByText(/ensure it starts with http:\/\/ or https:\/\//i)).toBeDefined()
  })

  it('should call onSubmit with valid data', async () => {
    const onSubmit = vi.fn().mockResolvedValue({})
    render(<CreateLinkForm onSubmit={onSubmit} isSubmitting={false} />)
    
    fireEvent.change(screen.getByLabelText(/target url/i), { target: { value: 'https://yes.engineering' } })
    fireEvent.change(screen.getByLabelText(/campaign/i), { target: { value: 'spring-2026' } })
    fireEvent.click(screen.getByRole('button', { name: /create link/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        target_url: 'https://yes.engineering',
        campaign: 'spring-2026',
        tags: []
      })
    })
  })

  it('should disable the button and show loading state while submitting', () => {
    render(<CreateLinkForm onSubmit={vi.fn()} isSubmitting={true} />)
    const button = screen.getByRole('button', { name: /creating/i })
    expect(button).toBeDisabled()
  })
})
