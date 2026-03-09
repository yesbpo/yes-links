import { describe, it, expect } from 'vitest'
import tailwindConfig from '../../tailwind.config.ts'

describe('Theme Token System (SDK Library)', () => {
  it('should have mandatory Yes Constitution tokens defined with prefix', () => {
    // 1. Check Prefix
    expect(tailwindConfig.prefix).toBe('yes-link-')
    
    // 2. Check Colors
    const theme = tailwindConfig.theme?.extend as any
    expect(theme.colors.primary.DEFAULT).toBe('var(--yes-primary)')
    expect(theme.colors.destructive.DEFAULT).toBe('var(--yes-destructive)')
    expect(theme.colors.warning.DEFAULT).toBe('var(--yes-warning)')
    expect(theme.colors.info.DEFAULT).toBe('var(--yes-info)')
    
    // 3. Check Radii
    expect(theme.borderRadius.lg).toBe('var(--yes-radius)')
    
    // 4. Check Fonts
    expect(theme.fontFamily.sans[0]).toBe('var(--font-yes-sans)')
  })
})
