import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  const mockProps = {
    campaigns: ['summer-2026', 'product-launch'],
    tags: ['promo', 'social', 'sms'],
    onFilterChange: vi.fn(),
    viewMode: 'list' as const,
    onViewModeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and dropdown buttons', () => {
    render(<FilterBar {...mockProps} />);
    
    expect(screen.getByPlaceholderText(/Buscar enlaces/i)).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Campaña')).toBeInTheDocument();
  });

  it('debounces search input', async () => {
    vi.useFakeTimers();
    render(<FilterBar {...mockProps} />);
    
    const input = screen.getByPlaceholderText(/Buscar enlaces/i);
    fireEvent.change(input, { target: { value: 'test-query' } });
    
    // Should not be called immediately
    expect(mockProps.onFilterChange).not.toHaveBeenCalled();
    
    // Fast forward time
    vi.advanceTimersByTime(500);
    
    expect(mockProps.onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'test-query' })
    );
    vi.useRealTimers();
  });

  it('opens tags dropdown and selects a tag', async () => {
    vi.useFakeTimers();
    render(<FilterBar {...mockProps} />);
    
    const tagsButton = screen.getByText('Tags');
    fireEvent.click(tagsButton);
    
    expect(screen.getByText('Filtrar por Etiquetas')).toBeInTheDocument();
    
    const promoTag = screen.getByText('promo');
    fireEvent.click(promoTag);
    
    // Fast forward time for debounce
    vi.advanceTimersByTime(500);
    
    // Should call onFilterChange with the selected tag
    expect(mockProps.onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ tags: 'promo' })
    );
    vi.useRealTimers();
  });

  it('switches view mode', () => {
    render(<FilterBar {...mockProps} />);
    
    const gridButton = screen.getByLabelText(/Grid view/i);
    fireEvent.click(gridButton);
    
    expect(mockProps.onViewModeChange).toHaveBeenCalledWith('grid');
  });
});
