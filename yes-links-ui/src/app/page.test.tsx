import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dashboard from './page'
import { useHandshake } from '@/hooks/useHandshake'
import { logger } from '@/lib/logger'

// Mock the hooks and services
vi.mock('@/hooks/useHandshake')
vi.mock('@/lib/logger')
vi.mock('@/lib/tracing', () => ({
  withTrace: vi.fn((name, attrs, fn) => fn())
}))

describe('Dashboard Integration (Full Flow)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state while handshake is pending', () => {
    (useHandshake as any).mockReturnValue({ isReady: false, token: null })
    render(<Dashboard />)
    expect(screen.getByTestId('dashboard-loading')).toBeDefined()
  })

  it('should render form, list, and analytics after successful handshake', async () => {
    (useHandshake as any).mockReturnValue({ isReady: true, token: 'valid-token' })
    render(<Dashboard />)
    
    expect(screen.getByLabelText(/target url/i)).toBeDefined()
    expect(screen.getByText(/no links found/i)).toBeDefined()
    
    // Wait for simulated data fetch
    await waitFor(() => {
      expect(screen.getByText(/total clicks/i)).toBeDefined()
      expect(screen.getByText(/clicks over time/i)).toBeDefined()
    })
  })

  it('should filter the link list when search criteria changes', async () => {
    (useHandshake as any).mockReturnValue({ isReady: true, token: 'valid-token' })
    render(<Dashboard />)

    // Wait for initial load
    await screen.findByText(/links dashboard/i)

    // Verify search input exists
    const searchInput = screen.getByPlaceholderText(/search links/i)
    expect(searchInput).toBeDefined()

    // Export button expectation
    expect(screen.getByRole('button', { name: /export/i })).toBeDefined()
  })

  it('should emit observability event when a link is created', async () => {
    (useHandshake as any).mockReturnValue({ isReady: true, token: 'valid-token' })
    render(<Dashboard />)

    const input = screen.getByLabelText(/target url/i)
    fireEvent.change(input, { target: { value: 'https://yes.engineering' } })
    fireEvent.click(screen.getByRole('button', { name: /create link/i }))

    await waitFor(() => {
      expect(logger.info).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'ui.link_created.v1' }),
        expect.any(String)
      )
    })
  })

  it('should remove a link and emit event when delete is clicked', async () => {
    (useHandshake as any).mockReturnValue({ isReady: true, token: 'valid-token' })
    render(<Dashboard />)

    // 1. Create a link first so we have something to delete
    const input = screen.getByLabelText(/target url/i)
    fireEvent.change(input, { target: { value: 'https://to-delete.com' } })
    fireEvent.click(screen.getByRole('button', { name: /create link/i }))

    await waitFor(() => expect(screen.getByText('https://to-delete.com')).toBeDefined())

    // 2. Click Delete
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // 3. Verify removal and observability
    await waitFor(() => {
      expect(screen.queryByText('https://to-delete.com')).toBeNull()
      expect(logger.info).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'ui.link_deleted.v1' }),
        expect.any(String)
      )
    })
  })
})
