export type ThemeTokens = {
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    warning: string
    info: string
    border: string
  }
  radius: string
  spacing: {
    unit: string
    container: string
  }
  typography: {
    sans: string
    baseSize: string
    headingWeight: string
  }
}

export const themes: Record<string, ThemeTokens> = {
  corporate: {
    colors: {
      primary: '#0f172a', // Slate 900
      primaryForeground: '#ffffff',
      secondary: '#f1f5f9',
      secondaryForeground: '#0f172a',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      accent: '#f1f5f9',
      accentForeground: '#0f172a',
      destructive: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      border: '#e2e8f0'
    },
    radius: '6px',
    spacing: { unit: '4px', container: '32px' },
    typography: {
      sans: '"Inter", sans-serif',
      baseSize: '14px',
      headingWeight: '600'
    }
  },
  dark: {
    colors: {
      primary: '#3b82f6', // Blue 500
      primaryForeground: '#ffffff',
      secondary: '#1e293b',
      secondaryForeground: '#f1f5f9',
      background: '#0f172a',
      foreground: '#f1f5f9',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      accent: '#334155',
      accentForeground: '#f1f5f9',
      destructive: '#f87171',
      warning: '#fbbf24',
      info: '#60a5fa',
      border: '#334155'
    },
    radius: '8px',
    spacing: { unit: '4px', container: '32px' },
    typography: {
      sans: '"Inter", sans-serif',
      baseSize: '14px',
      headingWeight: '600'
    }
  },
  midnight: {
    colors: {
      primary: '#ffffff',
      primaryForeground: '#000000',
      secondary: '#111111',
      secondaryForeground: '#ffffff',
      background: '#000000',
      foreground: '#ffffff',
      muted: '#111111',
      mutedForeground: '#888888',
      accent: '#222222',
      accentForeground: '#ffffff',
      destructive: '#ff4444',
      warning: '#ffaa00',
      info: '#00aaff',
      border: '#333333'
    },
    radius: '0px', // Ultra minimalista / Brutalista
    spacing: { unit: '2px', container: '40px' },
    typography: {
      sans: '"JetBrains Mono", monospace',
      baseSize: '13px',
      headingWeight: '700'
    }
  }
}
