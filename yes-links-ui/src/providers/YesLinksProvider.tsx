'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { injectTheme } from '@/theme/themeInjector'
import { themes } from '@/theme/presets'

interface YesLinksContextType {
  token: string | null
  baseUrl: string
  theme?: any
}

const defaultContext: YesLinksContextType = { token: null, baseUrl: '' }
export const YesLinksContext = createContext<YesLinksContextType>(defaultContext)

export const YesLinksProvider: React.FC<{
  token: string
  baseUrl: string
  theme?: 'corporate' | 'dark' | 'midnight' | any
  children?: React.ReactNode
}> = ({ token, baseUrl, theme = 'corporate', children }) => {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootRef.current) {
      try {
        // Resolve theme: Named Preset or Custom Object
        const resolvedTheme = typeof theme === 'string' ? themes[theme] : theme
        if (resolvedTheme) {
          injectTheme(resolvedTheme, rootRef.current)
        }
      } catch (err) {
        console.error('Failed to inject theme:', err)
      }
    }
  }, [theme])

  return (
    <YesLinksContext.Provider value={{ token, baseUrl, theme }}>
      <div ref={rootRef} className="yes-link-root">
        {children}
      </div>
    </YesLinksContext.Provider>
  )
}

export const useYesLinks = () => useContext(YesLinksContext)
