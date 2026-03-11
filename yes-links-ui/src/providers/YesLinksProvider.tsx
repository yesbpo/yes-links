'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { injectTheme } from '@/theme/themeInjector'
import { themes } from '@/theme/presets'

interface YesLinksContextType {
  token: string | null
  theme?: any
}

export const YesLinksContext = createContext<YesLinksContextType | null>(null)

export const YesLinksProvider: React.FC<{
  token: string
  theme?: 'corporate' | 'dark' | 'midnight' | any
  children: React.ReactNode
}> = ({ token, theme = 'corporate', children }) => {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootRef.current) {
      // Resolve theme: Named Preset or Custom Object
      const resolvedTheme = typeof theme === 'string' ? themes[theme] : theme
      if (resolvedTheme) {
        injectTheme(resolvedTheme, rootRef.current)
      }
    }
  }, [theme])

  return (
    <YesLinksContext.Provider value={{ token, theme }}>
      <div ref={rootRef} className="yes-link-root">
        {children}
      </div>
    </YesLinksContext.Provider>
  )
}

export const useYesLinks = () => {
  const context = useContext(YesLinksContext)
  if (!context) {
    throw new Error('useYesLinks must be used within a YesLinksProvider')
  }
  return context
}
