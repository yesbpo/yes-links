import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useContext } from 'react'
import { YesLinksProvider, YesLinksContext } from './YesLinksProvider'

const TestComponent = () => {
  const context = useContext(YesLinksContext)
  return (
    <div>
      <span data-testid="token">{context?.token}</span>
    </div>
  )
}

describe('YesLinksProvider (SDK Handshake)', () => {
  it('should provide token and theme to children', () => {
    render(
      <YesLinksProvider token="test-token" theme={{ colors: { primary: '#ff0000' } }}>
        <TestComponent />
      </YesLinksProvider>
    )

    expect(screen.getByTestId('token').textContent).toBe('test-token')
  })

  it('should apply the yes-link-root class and inject theme variables', () => {
    const { container } = render(
      <YesLinksProvider token="test-token" theme={{ colors: { primary: '#ff0000' } }}>
        <div>Content</div>
      </YesLinksProvider>
    )

    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('yes-link-root')
    // Check if the CSS variable was injected into the root element
    expect(root.style.getPropertyValue('--yes-primary')).toBe('#ff0000')
  })
})
