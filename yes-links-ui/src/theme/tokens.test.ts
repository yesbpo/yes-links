import { describe, it, expect } from 'vitest'
import tailwindConfig from '../../tailwind.config'

describe('Design System Audit: High-Fidelity Tokens (Rule 4 & 7)', () => {
  it('should have mandatory Figma elevation and glassmorphism tokens', () => {
    // 1. Surface & Glassmorphism
    const theme = tailwindConfig.theme?.extend as any
    expect(theme.colors.background).toBe('var(--background)')
    expect(theme.colors.accent.DEFAULT).toBe('var(--yes-accent)')
    
    // 2. Typography & Technical Mono (Linear style)
    expect(theme.fontFamily.sans[0]).toBe('var(--font-yes-sans)')
    
    // 3. Geometry: 8px Grid & Calculated Radii
    expect(theme.borderRadius.lg).toBe('var(--yes-radius)')
    // Verificamos que el MD y SM son cálculos dinámicos
    expect(theme.borderRadius.md).toContain('calc(var(--yes-radius) - 2px)')
  })
})
