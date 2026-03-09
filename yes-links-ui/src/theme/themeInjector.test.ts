import { describe, it, expect, beforeEach } from 'vitest'
import { injectTheme } from './themeInjector'

describe('Theme Injector (Zero Hardcoding Rule)', () => {
  beforeEach(() => {
    // Clear styles before each test
    document.documentElement.removeAttribute('style')
  })

  it('should inject theme tokens as CSS variables into the target element', () => {
    const target = document.createElement('div')
    const mockTheme = {
      colors: {
        primary: '#ff0000',
        background: '#000000'
      },
      radius: '20px'
    }

    injectTheme(mockTheme, target)

    expect(target.style.getPropertyValue('--yes-primary')).toBe('#ff0000')
    expect(target.style.getPropertyValue('--background')).toBe('#000000')
    expect(target.style.getPropertyValue('--yes-radius')).toBe('20px')
  })
})
