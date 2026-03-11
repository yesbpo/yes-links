import { describe, it, expect, beforeEach } from 'vitest'
import { injectTheme } from './themeInjector'

describe('Design System: Theme Presets (Corporate Minimalism)', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.className = 'yes-link-root'
  })

  it('should apply a Corporate preset with specific typography and spacing', () => {
    const corporateTheme = {
      colors: {
        primary: '#1a1a1a',
        accent: '#f5f5f5'
      },
      spacing: {
        unit: '4px',
        container: '24px'
      },
      typography: {
        baseSize: '14px',
        headingWeight: '600'
      }
    }

    injectTheme(corporateTheme, container)

    expect(container.style.getPropertyValue('--yes-primary')).toBe('#1a1a1a')
    expect(container.style.getPropertyValue('--yes-spacing-unit')).toBe('4px')
    expect(container.style.getPropertyValue('--yes-font-weight-bold')).toBe('600')
  })
})
