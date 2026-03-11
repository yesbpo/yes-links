/**
 * Injects granular theme tokens into the target element as CSS variables.
 * Designed for symmetry, minimalism, and extensible presets.
 */
export const injectTheme = (theme: any, target: HTMLElement) => {
  if (!theme) return

  const setVar = (key: string, value: string) => target.style.setProperty(key, value)

  // 1. Core Colors Mapping (Tailwind 4 Bridge)
  if (theme.colors) {
    const c = theme.colors
    if (c.primary) setVar('--yes-primary', c.primary)
    if (c.primaryForeground) setVar('--yes-primary-foreground', c.primaryForeground)
    if (c.secondary) setVar('--yes-secondary', c.secondary)
    if (c.secondaryForeground) setVar('--yes-secondary-foreground', c.secondaryForeground)
    if (c.background) {
      setVar('--background', c.background)
      setVar('--yes-background', c.background)
    }
    if (c.foreground) {
      setVar('--foreground', c.foreground)
      setVar('--yes-foreground', c.foreground)
    }
    if (c.muted) setVar('--yes-muted', c.muted)
    if (c.mutedForeground) setVar('--yes-muted-foreground', c.mutedForeground)
    if (c.accent) setVar('--yes-accent', c.accent)
    if (c.accentForeground) setVar('--yes-accent-foreground', c.accentForeground)
    if (c.destructive) setVar('--yes-destructive', c.destructive)
    if (c.warning) setVar('--yes-warning', c.warning)
    if (c.info) setVar('--yes-info', c.info)
    if (c.border) setVar('--yes-border', c.border)
  }

  // 2. Geometry & Spacing (Symmetry Rule)
  if (theme.radius) setVar('--yes-radius', theme.radius)
  
  if (theme.spacing) {
    const s = theme.spacing
    if (s.unit) setVar('--yes-spacing-unit', s.unit)
    if (s.container) setVar('--yes-spacing-container', s.container)
  }

  // 3. Typography (Corporate Feel)
  if (theme.typography) {
    const t = theme.typography
    if (t.sans) setVar('--font-yes-sans', t.sans)
    if (t.baseSize) setVar('--yes-font-size-base', t.baseSize)
    if (t.headingWeight) setVar('--yes-font-weight-bold', t.headingWeight)
  }
}
