import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PerformanceTrends } from './PerformanceTrends';

const mockData = [
  { date: '2026-03-01', clicks: 120, conversions: 45 },
  { date: '2026-03-02', clicks: 150, conversions: 50 },
  { date: '2026-03-03', clicks: 200, conversions: 80 },
];

describe('PerformanceTrends', () => {
  it('renders title and subtitle', () => {
    render(<PerformanceTrends state="success" data={mockData} />);
    
    expect(screen.getByText('Performance Trends')).toBeInTheDocument();
    expect(screen.getByText(/Clicks and conversions over the last 30 days/i)).toBeInTheDocument();
  });

  it('renders SVG chart with two area paths and two line paths', () => {
    const { container } = render(<PerformanceTrends state="success" data={mockData} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(4);

    const strokePaths = container.querySelectorAll('path[stroke]');
    expect(strokePaths.length).toBe(2);
  });

  it('renders legend correctly', () => {
    render(<PerformanceTrends state="success" data={mockData} />);
    
    expect(screen.getByText('Clicks')).toBeInTheDocument();
    expect(screen.getByText('Conversions')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<PerformanceTrends state="loading" data={[]} />);
    expect(screen.getByTestId('trends-loading')).toBeInTheDocument();
  });
});
