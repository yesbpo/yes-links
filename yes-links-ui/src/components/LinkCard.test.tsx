import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LinkCard } from './LinkCard';

const mockLink = {
  id: '1',
  short_code: 'TEST-CODE',
  target_url: 'https://example.com/very-long-url-that-should-be-truncated',
  campaign: 'Summer Campaign',
  tags: ['promo', 'social'],
  clicks: 1250,
  sparkline_data: [10, 25, 40, 30, 50, 45, 60]
};

describe('LinkCard', () => {
  it('renders link information correctly in list view', () => {
    render(<LinkCard link={mockLink} viewMode="list" />);

    expect(screen.getByText('TEST-CODE')).toBeInTheDocument();
    expect(screen.getByText('Summer Campaign')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(screen.getByText('promo')).toBeInTheDocument();
    expect(screen.getByText('social')).toBeInTheDocument();
  });

  it('renders link information correctly in grid view', () => {
    render(<LinkCard link={mockLink} viewMode="grid" />);

    expect(screen.getByText('TEST-CODE')).toBeInTheDocument();
    expect(screen.getByText('Summer Campaign')).toBeInTheDocument();
    expect(screen.getByText('1,250 clicks')).toBeInTheDocument();
  });

  it('calls onCopy when short code is clicked', async () => {
    // Mock clipboard
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<LinkCard link={mockLink} />);
    
    const copyButton = screen.getByText('TEST-CODE');
    fireEvent.click(copyButton);

    expect(writeText).toHaveBeenCalledWith('TEST-CODE');
  });

  it('renders the sparkline SVG', () => {
    const { container } = render(<LinkCard link={mockLink} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // It should have a polyline or path for the sparkline
    expect(container.querySelector('polyline')).toBeInTheDocument();
  });
});
