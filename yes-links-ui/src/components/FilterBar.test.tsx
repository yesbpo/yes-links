import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FilterBar } from './FilterBar'

describe('FilterBar (Phase 2 Feature)', () => {
  it('should render search and campaign filter', () => {
    render(<FilterBar onFilterChange={vi.fn()} campaigns={['Summer', 'Winter']} />)
    expect(screen.getByPlaceholderText(/search links/i)).toBeDefined()
    expect(screen.getByText(/all campaigns/i)).toBeDefined()
  })

  it('should call onFilterChange when typing in search', () => {
    const onFilterChange = vi.fn()
    render(<FilterBar onFilterChange={onFilterChange} campaigns={[]} />)
    
    const input = screen.getByPlaceholderText(/search links/i)
    fireEvent.change(input, { target: { value: 'promo' } })
    
    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'promo' }))
  })

  it('should call onFilterChange when selecting a campaign', () => {
    const onFilterChange = vi.fn()
    render(<FilterBar onFilterChange={onFilterChange} campaigns={['Summer']} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'Summer' } })
    
    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ campaign: 'Summer' }))
  })
})
