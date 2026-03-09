import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { KPIStats } from './KPIStats'

describe('KPIStats (Analytics Resilience)', () => {
  it('should render loading skeletons', () => {
    render(<KPIStats state="loading" data={null} />)
    expect(screen.getAllByTestId('kpi-skeleton').length).toBeGreaterThan(0)
  })

  it('should render metrics in success state', () => {
    const mockData = {
      total_clicks: 1250,
      total_links: 45,
      top_campaign: 'Summer 2026'
    }
    render(<KPIStats state="success" data={mockData} />)
    
    expect(screen.getByText('1,250')).toBeDefined()
    expect(screen.getByText('45')).toBeDefined()
    expect(screen.getByText('Summer 2026')).toBeDefined()
  })

  it('should render error state with message', () => {
    render(<KPIStats state="error" data={null} error="Failed to load stats" />)
    expect(screen.getByText(/failed to load stats/i)).toBeDefined()
  })
})
