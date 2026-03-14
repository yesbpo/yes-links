import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KPIStats } from './KPIStats';

const mockData = {
  total_clicks: 15430,
  total_links: 8,
  active_links: 6,
  ctr: 18.7,
  trends: {
    clicks: 12.5,
    ctr: 3.2
  }
};

describe('KPIStats', () => {
  it('renders all KPI cards with values', () => {
    render(<KPIStats state="success" data={mockData} />);
    
    expect(screen.getByText('15,430')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('18.7%')).toBeInTheDocument();
  }, 10000);

  it('renders percentage trends when available', () => {
    render(<KPIStats state="success" data={mockData} />);
    
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('+3.2%')).toBeInTheDocument();
  });

  it('renders skeleton loader when in loading state', () => {
    render(<KPIStats state="loading" data={null} />);
    const skeletons = screen.getAllByTestId('kpi-skeleton');
    expect(skeletons.length).toBe(4);
  });

  it('renders error message when in error state', () => {
    render(<KPIStats state="error" data={null} error="Failed to load" />);
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });
});
