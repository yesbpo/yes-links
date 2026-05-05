'use client'

import React from 'react'
import { BarChart3, Link2, Moon } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface YesLinksShellProps {
  activeTab: 'links' | 'stats' | 'dashboard'
  children: React.ReactNode
}

export const YesLinksShell: React.FC<YesLinksShellProps> = ({
  activeTab,
  children,
}) => {
  const linksActive = activeTab === 'links' || activeTab === 'dashboard'
  const statsActive = activeTab === 'stats' || activeTab === 'dashboard'

  return (
    <main className="yes-link-root min-h-screen bg-[#f5f5f6] text-foreground">
      <header
        className="border-b bg-white/90 backdrop-blur-sm"
        style={{ borderColor: 'var(--yes-border-subtle)' }}
      >
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{
                background: 'var(--yes-accent-primary)',
                boxShadow: 'var(--yes-shadow-sm)',
              }}
            >
              <Link2 className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div
                className="text-xl font-semibold text-[var(--yes-text-primary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                YesLinks
              </div>
              <div
                className="text-xs text-[var(--yes-text-tertiary)]"
                style={{ letterSpacing: 'var(--letter-spacing-tight)' }}
              >
                Precision SDK
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button
              className={cn(
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                linksActive
                  ? 'text-white'
                  : 'text-[var(--yes-text-secondary)] hover:bg-[var(--yes-surface-tertiary)]'
              )}
              style={{
                background:
                  linksActive ? 'var(--yes-accent-primary)' : 'transparent',
                boxShadow: linksActive ? 'var(--yes-shadow-sm)' : 'none',
                letterSpacing: 'var(--letter-spacing-tight)',
              }}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>Enlaces Activos</span>
            </button>
            <button
              className={cn(
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                statsActive
                  ? 'text-white'
                  : 'text-[var(--yes-text-secondary)] hover:bg-[var(--yes-surface-tertiary)]'
              )}
              style={{
                background:
                  statsActive ? 'var(--yes-accent-primary)' : 'transparent',
                boxShadow: statsActive ? 'var(--yes-shadow-sm)' : 'none',
                letterSpacing: 'var(--letter-spacing-tight)',
              }}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Estadísticas Globales</span>
            </button>
          </nav>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-md bg-white transition-colors hover:bg-[var(--yes-surface-tertiary)]"
            style={{
              border: '1px solid var(--yes-border-subtle)',
              boxShadow: 'var(--yes-shadow-sm)',
            }}
            aria-label="Theme toggle"
          >
            <Moon className="h-4 w-4 text-[var(--yes-text-secondary)]" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-6 py-6">{children}</div>

      <footer
        className="mt-12 border-t px-6 py-6 text-xs text-[var(--yes-text-tertiary)]"
        style={{ borderColor: 'var(--yes-border-subtle)' }}
      >
        <div className="mx-auto flex max-w-[1120px] items-center justify-between">
          <div className="flex items-center gap-6">
            <span>© 2024 YesLinks Precision SDK</span>
            <span>Documentation</span>
            <span>API Reference</span>
            <span>Support</span>
          </div>
          <span>v2.4.1</span>
        </div>
      </footer>
    </main>
  )
}
