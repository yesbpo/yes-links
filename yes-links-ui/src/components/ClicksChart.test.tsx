import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ClicksChart } from './ClicksChart'

describe('ClicksChart (Analytics Visuals)', () => {
  it('should render loading state', () => {
    render(<ClicksChart state="loading" data={[]} />)
    expect(screen.getByTestId('chart-loading')).toBeDefined()
  })

  it('should render an SVG path and markers when data is provided', () => {
    const mockData = [
      { day: '2026-03-01', count: 10 },
      { day: '2026-03-02', count: 20 },
      { day: '2026-03-03', count: 15 }
    ]
    const { container } = render(<ClicksChart state="success" data={mockData} />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeDefined()
    
    const path = container.querySelector('polyline')
    expect(path).toBeDefined()

    // Markers check
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(3)
  })

  it('should render empty state message', () => {
    render(<ClicksChart state="success" data={[]} />)
    expect(screen.getByText(/no click data available/i)).toBeDefined()
  })
})
