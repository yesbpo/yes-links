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
    expect(screen.getByText(/iniciando sesión segura/i)).toBeDefined()
  })

  it('should render form, list, and analytics after successful handshake', async () => {
    (useHandshake as any).mockReturnValue({ isReady: true, token: 'valid-token' })
    render(<Dashboard />)
    
    expect(screen.getByLabelText(/url de destino/i)).toBeDefined()
    expect(screen.getByText(/no se encontraron enlaces/i)).toBeDefined()
    
    // Wait for simulated data fetch
    expect(await screen.findByText(/total de clicks/i)).toBeDefined()
    expect(screen.getByText(/clicks en el tiempo/i)).toBeDefined()
  })

  it('should render export and filter controls', async () => {
    (useHandshake as any).mockReturnValue({ isReady: true, token: 'valid-token' })
    render(<Dashboard />)

    // Wait for initial load
    await screen.findByText(/panel de enlaces/i)

    // Verify search input exists
    const searchInput = screen.getByPlaceholderText(/buscar enlaces/i)
    expect(searchInput).toBeDefined()

    // Export button expectation
    expect(screen.getByRole('button', { name: /exportar/i })).toBeDefined()
  })

  it('should emit observability event when a link is created', async () => {
    (useHandshake as any).mockReturnValue({ isReady: true, token: 'valid-token' })
    render(<Dashboard />)

    const input = screen.getByLabelText(/url de destino/i)
    fireEvent.change(input, { target: { value: 'https://yes.engineering' } })
    fireEvent.click(screen.getByRole('button', { name: /crear enlace/i }))

    await waitFor(() => {
      expect(logger.info).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'ui.link_created.v1' }),
        expect.any(String)
      )
    })
  })

  it('should render edit/delete actions for created links', async () => {
    (useHandshake as any).mockReturnValue({ isReady: true, token: 'valid-token' })
    render(<Dashboard />)

    const input = screen.getByLabelText(/url de destino/i)
    fireEvent.change(input, { target: { value: 'https://to-delete.com' } })
    fireEvent.click(screen.getByRole('button', { name: /crear enlace/i }))

    await waitFor(() => expect(screen.getByText('https://to-delete.com')).toBeDefined())

    expect(screen.getByRole('button', { name: /editar/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /eliminar/i })).toBeDefined()
  })
})
