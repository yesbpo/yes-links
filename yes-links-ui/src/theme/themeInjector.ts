/**
 * Injects theme tokens into the target element as CSS variables.
 * Ensures the UI can be styled dynamically by the host application.
 */
export const injectTheme = (theme: Record<string, any>, target: HTMLElement) => {
  // Map Colors
  if (theme.colors) {
    if (theme.colors.primary) target.style.setProperty('--yes-primary', theme.colors.primary)
    if (theme.colors.background) target.style.setProperty('--background', theme.colors.background)
    if (theme.colors.foreground) target.style.setProperty('--foreground', theme.colors.foreground)
    if (theme.colors.warning) target.style.setProperty('--yes-warning', theme.colors.warning)
    if (theme.colors.info) target.style.setProperty('--yes-info', theme.colors.info)
  }

  // Map Base Radius
  if (theme.radius) {
    target.style.setProperty('--yes-radius', theme.radius)
  }

  // Map Specific Radii
  if (theme.radii) {
    Object.entries(theme.radii).forEach(([key, value]) => {
      target.style.setProperty(`--yes-radius-${key}`, value as string)
    })
  }

  // Map Fonts
  if (theme.fonts) {
    if (theme.fonts.sans) target.style.setProperty('--font-yes-sans', theme.fonts.sans)
  }
}
