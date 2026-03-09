import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LinkList } from './LinkList'

describe('LinkList (State Machine & Tokens)', () => {
  it('should render a loading state (skeleton)', () => {
    render(<LinkList state="loading" links={[]} />)
    expect(screen.getByTestId('link-list-loading')).toBeDefined()
  })

  it('should render an empty state when no links are provided', () => {
    render(<LinkList state="empty" links={[]} onCreateFirst={() => {}} />)
    expect(screen.getByText(/no links found/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /create your first link/i })).toBeDefined()
  })

  it('should render an error state with a retry action', () => {
    const onRetry = vi.fn()
    render(<LinkList state="error" links={[]} onRetry={onRetry} error="Detailed error message" />)
    
    expect(screen.getByText(/failed to fetch links/i)).toBeDefined()
    expect(screen.getByText(/detailed error message/i)).toBeDefined()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    retryButton.click()
    expect(onRetry).toHaveBeenCalled()
  })

  it('should render a list of links in success state and handle actions', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const mockLinks = [
      { id: '1', short_code: 'abc12', target_url: 'https://google.com', campaign: 'test' }
    ]
    render(<LinkList state="success" links={mockLinks} onEdit={onEdit} onDelete={onDelete} />)
    
    expect(screen.getByText('abc12')).toBeDefined()
    
    // Check Edit Action
    const editButton = screen.getByRole('button', { name: /edit/i })
    editButton.click()
    expect(onEdit).toHaveBeenCalledWith(mockLinks[0])

    // Check Delete Action
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    deleteButton.click()
    expect(onDelete).toHaveBeenCalledWith('1')
  })
})
